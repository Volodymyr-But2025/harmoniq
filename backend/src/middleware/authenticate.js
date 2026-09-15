import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  let { sessionId, accessToken } = req.cookies;

  if (!accessToken || !sessionId) {
    throw createHttpError(401, 'Missing access token');
  }

  if (typeof sessionId === 'string') {
    sessionId = sessionId.replace(/^j:/, '').replace(/^"|"$/g, '');
  }

  const session = await Session.findOne({ _id: sessionId, accessToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isAccessTokenExpired = session.accessTokenValidUntil < new Date();

  if (isAccessTokenExpired) {
    throw createHttpError(401, 'Access token expired');
  }

  const user = await User.findOne({ _id: session.userId });

  if (!user) {
    throw createHttpError(401);
  }

  req.user = user;

  next();
};
