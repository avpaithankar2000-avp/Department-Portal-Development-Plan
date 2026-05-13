import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

const toDocument = (result, file) => ({
  public_id: result.public_id,
  secure_url: result.secure_url,
  fileType: file.mimetype,
  uploadedAt: new Date()
});

export const uploadToCloudinary = (file, folder = "aiml_portal") =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

export const uploadDocument = async (file, folder) => {
  const result = await uploadToCloudinary(file, folder);
  return result ? toDocument(result, file) : undefined;
};

export const uploadDocumentFields = async (files = {}, folder) => {
  const entries = await Promise.all(
    Object.entries(files).map(async ([field, fileList]) => {
      const file = fileList?.[0];
      if (!file) return null;
      const uploaded = await uploadDocument(file, folder);
      return [field, uploaded];
    })
  );

  return Object.fromEntries(entries.filter(Boolean));
};

const uploadImage = async (file, folder = "aiml_portal") => {
  const result = await uploadToCloudinary(file, folder);
  if (!result) return null;

  return {
    url: result.secure_url,
    publicId: result.public_id,
    public_id: result.public_id,
    secure_url: result.secure_url,
    fileType: file.mimetype,
    uploadedAt: new Date()
  };
};

export default uploadImage;
