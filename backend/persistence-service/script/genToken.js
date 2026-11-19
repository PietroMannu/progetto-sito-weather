// Solo per test: genera un token finto senza passare da Google.  Uso: node scripts/genToken.js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

console.log(
    jwt.sign(
        { googleId: "123456789", displayName: "Mario Rossi", email: "mario@test.it" },
        JWT_SECRET,
        { expiresIn: "1h" }
    )
);
