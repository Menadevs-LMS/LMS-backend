const mongoose = require("mongoose");

const CategoreSchema = new mongoose.Schema({
    categoreName: String,
});

module.exports = mongoose.model("Categories", CategoreSchema);
