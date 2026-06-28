import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../config';

const auth = (...requiredRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ১. রিকোয়েস্ট হেডার থেকে অথরাইজেশন ফিল্ডটি নেওয়া
    const tokenWithBearer = req.headers.authorization;

    if (!tokenWithBearer) {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized! Token is missing in headers.',
      });
    }

    // ২. টোকেন ফরম্যাটিং ফিক্স
    const token = tokenWithBearer.startsWith('Bearer ') 
      ? tokenWithBearer.split(' ')[1] 
      : tokenWithBearer;

    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized! Invalid token format.',
      });
    }

    // ৩. সিক্রেট কি দিয়ে টোকেন ভেরিফাই করা
    const verifiedUser = jwt.verify(token, config.jwt.secret as Secret) as JwtPayload;

    // ৪. রোল বেসড অথরাইজেশন চেক করা
    if (requiredRoles.length > 0 && !requiredRoles.includes(verifiedUser.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden! You do not have permission to access this route.',
      });
    }

    // ৫. এক্সপ্রেস রিকোয়েস্টে ইউজার অবজেক্ট অ্যাসাইন করা
    req.user = verifiedUser; 
    
    next();
  } catch (error: any) {
    // 🎯 মেইন ফিক্স: টোকেন এক্সপায়ার হলে এক্সপ্রেস গ্লোবাল হ্যান্ডলারে না পাঠিয়ে এখানেই ৪০১ রেসপন্স দিয়ে দেওয়া
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'jwt expired', // ফ্রন্টএন্ড এই মেসেজটি দেখেই অটো-লগআউট করাবে
        errorMessages: [{ path: '', message: 'Your session has expired. Please login again.' }]
      });
    }
    
    // অন্য কোনো আননোন এরর হলে গ্লোবাল হ্যান্ডলারে যাবে
    next(error);
  }
};

export default auth;