const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.protect = async (req, res, next) => {
  let token;

  // Check if the authorization header is present and formatted correctly as a Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token from the "Bearer <token>" string
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key from your .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user associated with the token's ID and attach it to the request object.
      // We exclude the password for security.
      req.user = await User.findById(decoded.id).select('-password');

      // If the user is found, proceed to the next function in the chain (the controller)
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is found in the header, deny access
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

