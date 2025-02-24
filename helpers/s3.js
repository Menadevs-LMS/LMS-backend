const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
  region: process.env.AWS_REGION, 
});

const uploadMediaToS3 = async (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const key = `uploads/${Date.now()}-${fileName}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME, 
      Key: key,
      Body: fileContent,
    };

    const result = await s3.upload(params).promise();
    return result;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Error uploading file to S3");
  }
};

const deleteMediaFromS3 = async (key) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key, 
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error("S3 deletion error:", error);
    throw new Error("Error deleting file from S3");
  }
};

module.exports = { uploadMediaToS3, deleteMediaFromS3 };
