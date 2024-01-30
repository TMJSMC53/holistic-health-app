import User from '../models/auth.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  // TODO receive firstName here
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password less than 6 characters' });
  }
  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      username,
      password: hash,
      firstName,
      lastName,
      // TODO add firstName and lastName here
    })
      .then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          {
            id: user._id,
            username: username,
            firstName: firstName,
            lastName: lastName,
          },
          jwtSecret,
          {
            expiresIn: maxAge, // 3hrs
          }
        );
        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        });
        res.status(201).json({
          message: 'User successfully created',
          owner: user._id,
        });
      })
      .catch((error) =>
        res.status(400).json({
          message: 'User not successfully created',
          error: error.message,
        })
      );
  });
};

// Validate existing credentials

export const login = async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password is provided
  if (!username || !password) {
    return res.status(400).json({
      message: 'Username or password is not present',
    });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({
        message: 'Login unsuccessful',
        error: 'user not found',
      });
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            {
              id: user._id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
            },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: 'User successfully logged in',
          });
        } else {
          res.status(400).json({ message: 'login not successful' });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: 'An error occurred',
      error: error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    if (req.user) {
      // Assuming you have a method like findById in your User model
      const currentUser = await User.findById(req.user._id);

      // Send the current user data (or null if not found)
      res.json(currentUser || null);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Error retrieving current user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// export const getCurrentUser = (req, res) => {
//   if (req.user) {
//     res.send(User);
//   } else {
//     res.send(null);
//   }
// };
