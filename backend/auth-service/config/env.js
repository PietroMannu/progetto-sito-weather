require("dotenv").config();

const requiredVars = ["AUTH_PORT"];

requiredVars.forEach(key => {
    if (!process.env[key]) {
        console.error(`La variabile ${key} non è definita nel file .env`);
        process.exit(1);
    }
});

module.exports = {
    AUTH_PORT: parseInt(process.env.AUTH_PORT, 10)
};