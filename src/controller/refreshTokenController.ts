import { Response,Request } from "express";
import UserSchema from "../models/User";
import jwt from "jsonwebtoken";

export const refreshTokenHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const cookies = req.cookies;
  
      // Check if JWT cookie exists
      if (!cookies?.jwt) {
        res.sendStatus(401); // Unauthorized
      }
  
      const refreshToken = cookies.jwt;
  
      // Find the user with the given refresh token
      const foundUser = await UserSchema.findOne({ refreshToken }); // Use `findOne` for a single document
  
      if (!foundUser) {
        res.sendStatus(403); // Forbidden
      }
  
      const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET;
  
      if (!refresh_token_secret) {
        throw new Error('Refresh token secret is not defined');
      }
  
      // Verify the refresh token
      jwt.verify(refreshToken, refresh_token_secret, async (err: any, decoded: any) => {
        if (err || !decoded) {
          return res.sendStatus(403); // Forbidden if token is invalid
        }
  
        const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
  
        if (!access_token_secret) {
          throw new Error('Access token secret is not defined');
        }
  
        // Generate a new access token
        const accessToken = jwt.sign(
          { userId: decoded.userId },
          access_token_secret,
          { expiresIn: '1h' }
        );
  
        // Respond with the new access token
        return res.status(200).json({
          accessToken,
        });
      });
    } catch (err) {
      console.error('Error in refreshTokenHandler:', err);
  
      // Respond with a structured error object
      res.status(500).json({
        success: false,
        message: err instanceof Error ? err.message : 'An unexpected error occurred',
      });
    }
  };