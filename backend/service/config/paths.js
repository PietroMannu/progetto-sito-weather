const path = require("path");

const ROOT = path.join(__dirname, "..");
const FRONTEND_PUBLIC = path.join(ROOT, "..", "..","frontend", "public");

module.exports = {
    ROOT,
    SRC: path.join(ROOT, "src"),
    //Public: path.join(ROOT, "public"),
    PUBLIC: FRONTEND_PUBLIC,
    ROUTES: path.join(ROOT, "src", "routes"),
    CONTROLLERS: path.join(ROOT, "src", "controllers"),
    UTILS: path.join(ROOT, "src", "utils"),
};