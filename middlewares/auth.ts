import { Response, NextFunction } from "express";

import Token from "../classes/token";

/**
 * Auth JWT
 */
export const verifyToken = async (req: any, res: Response, next: NextFunction) => {
  const userToken = req.get('x-token') || '';

  try {
    const decoded = await Token.compareToken(userToken);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(400).json({
      ok     : false,
      message: 'Token invalid'
    });
  }
};