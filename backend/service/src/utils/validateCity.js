// utils/validateCity.js
function validateCity(city) {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    return typeof city === "string" &&
           city.trim().length > 1 &&
           regex.test(city.trim());
}

module.exports = { validateCity };