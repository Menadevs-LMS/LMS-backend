const CategoreSchema = require("../../models/Categories");


const getAllCatgories = async (req, res) => {
    try {
        const categories = await CategoreSchema.find({});
        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while get the cateegoreis.",
        });
    }
}

const deleteCategore = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteCategore = await CategoreSchema.deleteOne({ _id: id });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting.",
        });
    }
}

module.exports = {
    deleteCategore,
    getAllCatgories
}