require("dotenv").config();

const requiredVars = ["MONGO_URI", "JWT_SECRET"];

requiredVars.forEach(key => {
    if (!process.env[key]) {
        console.error(`La variabile ${key} non è definita nel file .env`);
        process.exit(1);
    }
});

module.exports = {
    PORT: parseInt(process.env.PORT || "5001", 10),
    MONGO_URI: process.env.MONGO_URI,
    DB_NAME: process.env.DB_NAME || "progetto",
    JWT_SECRET: process.env.JWT_SECRET
};
