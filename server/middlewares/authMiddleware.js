const jwt = require('jsonwebtoken'); // Import the JWT library

const exampleMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Get the 'Authorization' header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const token = authHeader.replace('Bearer ', ''); // Extract the token from the header
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify the token using the secret key

    // Attach the decoded user ID to the request for use in subsequent middleware or route handlers
    req.body.userId = decoded.userId;
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }
};

module.exports = exampleMiddleware; // Export the middleware for use in other parts of your application
