const express = require("express");
const multer = require("multer");
const {
  uploadMediaToS3,
  deleteMediaFromS3,
} = require("../../helpers/s3");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToS3(req.file.path);
    res.status(200).json({
      success: true,
      data: result, 
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error uploading file" });
  }
});

router.delete("/delete/:key", async (req, res) => {
  try {
    const { key } = req.params;
    if (!key) {
      return res.status(400).json({
        success: false,
        message: "File key is required",
      });
    }
    await deleteMediaFromS3(key);
    res.status(200).json({
      success: true,
      message: "File deleted successfully from S3",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error deleting file" });
  }
});

router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToS3(fileItem.path)
    );
    const results = await Promise.all(uploadPromises);
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, message: "Error in bulk uploading files" });
  }
});

module.exports = router;
