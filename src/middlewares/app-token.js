import jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import Application from '../models/application';

export default async (req, res, next) => {
  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded._id)
      throw new Error('Bad token');

    const app = await Application.findById(decoded._id);
    if (!app)
      throw new Error('Application not found');

    delete decoded.iat;
    req.application = decoded;

    return next();
  } catch (err) {
    if (err.message === 'Bad token')
      return res.error('Bad token', 401);
    return res.error('Application not found', 404);
  }
};
