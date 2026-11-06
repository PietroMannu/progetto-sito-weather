const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');
const env = require('../../config/env');

router.get('/me', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ user: null });
  }

  return res.json({ user: req.user });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(env.FRONTEND_URL || 'http://localhost:4000/');
  }
);

module.exports = router;