import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

export const userAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        next();
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    next();
  }
};
