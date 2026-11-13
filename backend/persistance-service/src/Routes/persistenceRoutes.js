const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
  try {
    const user = req.user || null;

    if (user && Object.keys(user).length > 0) {
      return res.status(200).json({
        success: true,
        authenticated: true,
        message: 'Dati utente Google caricati correttamente.',
        user: {
          googleId: user.googleId || user.id || user.sub,
          displayName: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        timestamp: new Date().toISOString(),
      });
    }

    const token =
      req.cookies?.token ||
      req.cookies?.jwt ||
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        message: 'Nessuna sessione Google attiva. Effettua il login.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({
      success: true,
      authenticated: true,
      message: 'Dati utente Google caricati correttamente.',
      user: {
        googleId: decoded.googleId || decoded.id || decoded.sub,
        displayName: decoded.displayName || `${decoded.firstName || ''} ${decoded.lastName || ''}`.trim(),
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      message: 'Nessuna sessione Google valida. Effettua di nuovo il login.',
      error: err.message
    });
  }
});

module.exports = router;