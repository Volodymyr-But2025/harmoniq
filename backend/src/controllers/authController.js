import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';

import { Session } from '../models/session.js';
import {
  clearSessionCookies,
  createSession,
  setSessionCookies,
} from '../services/auth.js';

const cleanSessionId = (id) => {
  if (!id || typeof id !== 'string') return id;
  if (id.startsWith('j:')) {
    return id.replace(/^j:"|"$/g, '');
  }
  return id;
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const userWithSameEmail = await User.findOne({ email });
  if (userWithSameEmail) {
    throw createHttpError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const newSession = await createSession(newUser._id);

  setSessionCookies(res, newSession);

  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }
  await Session.deleteOne({ userId: user._id });
  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);
  res.status(200).json(user);
};

export const refreshUserSession = async (req, res) => {
  const rawSessionId = req.cookies.sessionId;
  const refreshToken = req.cookies.refreshToken;
  const sessionId = cleanSessionId(rawSessionId);

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isRefreshTokenExpired = session.refreshTokenValidUntil < new Date();

  if (isRefreshTokenExpired) {
    await session.deleteOne();
    clearSessionCookies(res);
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({ _id: session._id });
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);
  res.status(200).json({
    message: 'Session refreshed',
  });
};

export const logoutUser = async (req, res) => {
  const sessionId = cleanSessionId(req.cookies.sessionId);

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  clearSessionCookies(res);

  res.status(204).send();
};
