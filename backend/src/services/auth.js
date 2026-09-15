import { THIRTY_MINUTES, ONE_DAY } from '../constants/time.js';
import { Session } from '../models/session.js';
import crypto from 'crypto';

export const createSession = async (userId) => {
  const accessToken = crypto.randomUUID();
  const refreshToken = crypto.randomUUID();

  return await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + THIRTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const setSessionCookies = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: THIRTY_MINUTES,
  });

  const idString = session._id.toString();

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', idString, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });
};

export const clearSessionCookies = (res) => {
  const options = { httpOnly: true, secure: true, sameSite: 'none' };

  res.clearCookie('accessToken', options);
  res.clearCookie('refreshToken', options);
  res.clearCookie('sessionId', options);
};
