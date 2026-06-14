import { Request, Response, NextFunction } from 'express';
import { User } from '../user/user.model';
import bcryptjs from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../../../config';

// 📝 ১. রেজিস্টার ইউজার (Register User)
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    // ইউজার ইতিমধ্যে রেজিস্টার্ড কিনা চেক করা
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      throw new Error('User already exists with this email!');
    }

    // নতুন ইউজার তৈরি করা (পাসওয়ার্ড হ্যাশিং মডেলের pre-save হুক দিয়ে অটোমেটিক হবে)
    const newUser = await User.create({
      name,
      email,
      password,
      role,
    });

    // টোকেন অপশনস টাইপ সেফ করা
    const accessTokenOptions: SignOptions = {
      expiresIn: config.jwt.expires_in as jwt.SignOptions['expiresIn']
    };

    const refreshTokenOptions: SignOptions = {
      expiresIn: config.jwt.refresh_expires_in as jwt.SignOptions['expiresIn']
    };

    // রেজিস্টার হওয়ার সাথে সাথেই টোকেন জেনারেট করা (যাতে ইউজারকে সরাসরি লগইন করানো যায়)
    const accessToken = jwt.sign(
      { _id: newUser._id.toString(), role: newUser.role },
      config.jwt.secret as string,
      accessTokenOptions
    );

    const refreshToken = jwt.sign(
      { _id: newUser._id.toString(), role: newUser.role },
      config.jwt.refresh_secret as string,
      refreshTokenOptions
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      data: newUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// 🔑 ২. লগইন ইউজার (Login User)
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // ইউজার এক্সিস্ট করে কিনা চেক এবং পাসওয়ার্ড সিলেক্ট করা
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('User does not exist!');
    }

    // পাসওয়ার্ড ম্যাচ করা
    const isPasswordMatched = await bcryptjs.compare(password, user.password!);
    if (!isPasswordMatched) {
      throw new Error('Password incorrect!');
    }

    const accessTokenOptions: SignOptions = {
      expiresIn: config.jwt.expires_in as jwt.SignOptions['expiresIn']
    };

    const refreshTokenOptions: SignOptions = {
      expiresIn: config.jwt.refresh_expires_in as jwt.SignOptions['expiresIn']
    };

    const accessToken = jwt.sign(
      { _id: user._id.toString(), role: user.role },
      config.jwt.secret as string,
      accessTokenOptions
    );

    const refreshToken = jwt.sign(
      { _id: user._id.toString(), role: user.role },
      config.jwt.refresh_secret as string,
      refreshTokenOptions
    );

    res.status(200).json({
      success: true,
      message: 'User logged in successfully!',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  registerUser,
  loginUser,
};