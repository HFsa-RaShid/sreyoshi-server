import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'; // JwtPayload ইম্পোর্ট করুন
import config from '../config';

const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error('You are not authorized');
    }

    // এখানে 'as JwtPayload' দিয়ে টাইপ অ্যাসর্ট করে দিন
    const verifiedUser = jwt.verify(token, config.jwt.secret as Secret) as JwtPayload;

    req.user = verifiedUser; // এখন আর কোনো এরর দিবে না
    next();
  } catch (error) {
    next(error);
  }
};

export default auth;