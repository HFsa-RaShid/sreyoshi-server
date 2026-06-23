import { Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import config from '../../../config';
import { User } from '../user/user.model';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createTokens = (user: any) => {
  const accessTokenOptions: SignOptions = { expiresIn: config.jwt.expires_in as any };
  const refreshTokenOptions: SignOptions = { expiresIn: config.jwt.refresh_expires_in as any };

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

  return { accessToken, refreshToken };
};


const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) throw new Error('Password and Confirm Password do not match!');

    const isPhoneExist = await User.findOne({ phone });
    if (isPhoneExist) throw new Error('Phone number already registered!');

    if (email) {
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) throw new Error('Email already registered!');
    }

    const newUser = await User.create({ name, phone, email, password, role });
    const { accessToken, refreshToken } = createTokens(newUser);

    await User.findByIdAndUpdate(newUser._id, { refreshToken });

    res.status(201).json({ success: true, message: 'User registered successfully!', accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

// 🔑 ২. রেগুলার লগইন
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identity, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identity }, { phone: identity }]
    }).select('+password');

    if (!user) throw new Error('User not found!');
    if (!user.password) throw new Error('This account uses Google Login. Please click Sign in with Google.');

    const isPasswordMatched = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatched) throw new Error('Password incorrect!');

    const { accessToken, refreshToken } = createTokens(user);

    await User.findByIdAndUpdate(user._id, { refreshToken });

    res.status(200).json({ success: true, message: 'Logged in successfully!', accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

// social login
const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      throw new Error('Google ID Token is required!');
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID, 
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Google authentication failed! Invalid token.');
    }

    const { name, email } = payload; 
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || 'Google User',
        email,
        phone: `google-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        isSocialLogin: true,
        role: 'user'
      });
    }

    const { accessToken, refreshToken } = createTokens(user);

   
    await User.findByIdAndUpdate(user._id, { refreshToken });

    res.status(200).json({ 
      success: true, 
      message: 'Google login successful!', 
      accessToken, 
      refreshToken 
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = { registerUser, loginUser, googleLogin };