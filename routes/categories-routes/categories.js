const express = require("express");

const { deleteCategore, getAllCatgories } = require("../../controllers/categories-controller/categories-controller");

const router = express.Router();

router.post("/allcatgories", getAllCatgories);
router.delete("/deletebyid/:id", deleteCategore);


module.exports = router;