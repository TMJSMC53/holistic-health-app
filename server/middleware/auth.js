import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

exports.ownerAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Not authorized' });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: 'Not authorized, token not available' });
  }
};
