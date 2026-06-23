import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../config';

const auth = (...requiredRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ১. রিকোয়েস্ট হেডার থেকে অথরাইজেশন ফিল্ডটি নেওয়া
    const tokenWithBearer = req.headers.authorization;
    
    // 💡 কুইক ডিবাগিং টেম্পলেট (আপনার টার্মিনালে হেডার্স দেখতে পাবেন)
    // console.log("Incoming Headers:", req.headers);

    if (!tokenWithBearer) {
      throw new Error('You are not authorized! Token is missing in headers.');
    }

    // ২. টোকেন ফরম্যাটিং ফিক্স: যদি টোকেনের শুরুতে 'Bearer ' থাকে, তবে স্প্লিট করে শুধু পিওর টোকেনটা নেওয়া
    const token = tokenWithBearer.startsWith('Bearer ') 
      ? tokenWithBearer.split(' ')[1] 
      : tokenWithBearer;

    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('You are not authorized! Invalid token format.');
    }

    // ৩. সিক্রেট কি (Secret Key) দিয়ে টোকেন ভেরিফাই করা
    const verifiedUser = jwt.verify(token, config.jwt.secret as Secret) as JwtPayload;

    // ৪. রোল বেসড অথরাইজেশন চেক করা
    if (requiredRoles.length > 0 && !requiredRoles.includes(verifiedUser.role)) {
      throw new Error('Forbidden! You do not have permission to access this route.');
    }

    // ৫. এক্সপ্রেস রিকোয়েস্টে ইউজার অবজেক্ট অ্যাসাইন করা
    req.user = verifiedUser; 
    
    next();
  } catch (error) {
    next(error);
  }
};

export default auth;