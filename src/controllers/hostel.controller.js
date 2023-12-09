import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import HostelModel from "../models/hostel.model.js";
import UserModel from "../models/user.model.js";
import validateMongodbId from "../utils/validateMongoDbid.js";
import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";
import { deleteImageBulb, uploadImageInBulb } from "../azure/upload.image.js";
import "dotenv/config";
import { sendMail } from "../utils/sendmail.js";
import jwt from "jsonwebtoken";
export const RegisterHostelHandler = asyncHandler(async (req, res, next) => {
  try {
    const { name, hostelName, phone, email, password } = req.body;
    const hostelExists = await HostelModel.findOne({ name: hostelName });

    if (hostelExists) {
      return next(new ErrorHandler("Hostel with this name already exist", 400));
    }

    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return next(new ErrorHandler("User with this email already exist", 400));
    }

    const { token, activationcode } = createActivationToken(
      name,
      hostelName,
      phone,
      email,
      password
    );

    const html = `<div> <p>  Your Activation Code is  <br/>$<h1> ${activationcode} </h1> <br/> Thanks for registering at Our Hostel <br/> If you havent register at the our hostel then please kindlty ignore this mail sry  </p> </div>`;
    try {
      await sendMail({
        email: email,
        subject: "Activate your account",
        html,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }

    res.status(200).json({
      success: true,
      message: "mail sent successfully",
      token,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const activateHostelHandler = asyncHandler(async (req, res, next) => {
  try {
    const { activationToken, activationCode } = req.body;
    if (!activationCode || !activationToken) {
      return next(
        new ErrorHandler(
          "ActivationCode or activationToken field is required",
          400
        )
      );
    }
    console.log(process.env.ACTIVATION_SECRET);
    const newUserHostel = jwt.verify(
      activationToken,
      process.env.ACTIVATION_SECRET
    );
    if (!newUserHostel) {
    }
    if (newUserHostel.activationcode !== activationCode) {
      return next(
        new ErrorHandler("Invalid ActivationCode or token expired ", 400)
      );
    }

    const newUser = await UserModel.create({
      name: newUserHostel.name,
      email: newUserHostel.email,
      phone: newUserHostel.phone,
      password: newUserHostel.password,
      role: "owner",
    });

    const newHostel = await HostelModel.create({
      name: newUserHostel.hostelName,
      email: newUserHostel.email,
      phone: newUserHostel.phone,
      user: newUser._id,
    });

    newUser.hostel = newHostel._id;
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Hostel And user registered successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const createActivationToken = (
  name,
  hostelName,
  phone,
  email,
  password
) => {
  const activationcode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    {
      name,
      hostelName,
      phone,
      email,
      password,
      activationcode,
    },
    process.env.ACTIVATION_SECRET,
    { expiresIn: "5m" }
  );

  return { token, activationcode };
};

export const getSingleHostelHandler = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const isValid = validateMongodbId(id);
    if (!isValid) {
      return next(new ErrorHandler("The id is not valid", 400));
    }

    const hostel = await HostelModel.findById(id).populate("review");

    if (!hostel) {
      return next(new ErrorHandler("hostel with this id doesnt exist", 404));
    }

    res.status(200).json({
      success: true,
      hostel,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getAllHostelHandler = asyncHandler(async (req, res, next) => {
  try {
    const hostels = await HostelModel.find({ status: "verified" });

    res.status(200).json({
      success: true,
      hostels,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const addImages = asyncHandler(async (req, res, next) => {
  try {
    const id = req.body.hostelId;
    if (!req.files) {
      return next(new ErrorHandler("Image field is required", 400));
    }

    const hostel = await HostelModel.findById(id);

    for (let file of req.files) {
      let result;
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"
      ) {
        result = await uploadImageInBulb(file.path, next);
        hostel.images.push({
          url: result.imageUrl,
          bulbName: result.blobName,
        });
      }
    }

    for (let file of req.files) {
      try {
        fs.unlinkSync(file.path);
        console.log("Delete File successfully.");
      } catch (error) {
        console.log(error);
      }
    }

    await hostel.save();

    res.status(200).json({
      success: true,
      hostel,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message, 500));
  }
});

export const addthumbnailUrlHandler = asyncHandler(async (req, res, next) => {
  try {
    const id = req.body.hostelId;
    const hostel = await HostelModel.findById(id);

    if (hostel.thumbnailUrl.bulbName) {
      await deleteImageBulb(hostel.thumbnailUrl.bulbName);
    }

    const result = await cloudinary.v2.uploader.upload(req.file.path);
    hostel.thumbnailUrl = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    try {
      fs.unlink(req.file.path);
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }

    await hostel.save();
    res.status(200).json({
      success: true,
      hostel,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const updateHostelContentHandler = asyncHandler(
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const isValid = validateMongodbId(id);
      if (!isValid) {
        return next(new ErrorHandler("The id is not valid", 400));
      }

      const hostel = await HostelModel.findById(id);

      if (!hostel) {
        return next(new ErrorHandler("hostel with this id doesnt exist", 404));
      }
      await HostelModel.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );

      const updHostel = await HostelModel.findById(id).populate("review");

      res.status(200).json({
        success: true,
        updHostel,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

export const featuredHostel = asyncHandler(async (req, res, next) => {
  try {
    const hostels = await HostelModel.find({}).sort({ averageRating: -1 });
    if (!hostels) {
      return next(new ErrorHandler("hostels not found", 404));
    }

    res.status(200).json({
      success: true,
      hostels,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
export const searchHostel = asyncHandler(async (req, res, next) => {
  try {
    console.log(req.query);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const searchForHostel = asyncHandler(async (req, res, next) => {
  try {
    const keyword = req.query.keyword;
    const data = await HostelModel.find({
      $or: [{ name: { $regex: keyword } }],
    });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const deleteHostelImage = asyncHandler(async (req, res, next) => {
  try {
    const id = req.body.hostelId;
    const bulbName = req.body.bulbName;
    const hostel = await HostelModel.findById(id);
    if (!hostel) {
      return next(new ErrorHandler("Hostel with this id doesnt exist", 400));
    }

    await deleteImageBulb(bulbName);
    const newImages = hostel.images.filter(
      (data) => data.bulbName !== bulbName
    );

    hostel.images = newImages;

    await hostel.save();
    res.status(200).json({
      success: true,
      hostel,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const verifyHostelImage = asyncHandler(async (req, res, next) => {
  try {
    const hostelId = req.body.hostelId;
    const hostel = await HostelModel.findById(hostelId);
    if (!hostel) {
      return next(new ErrorHandler("hostel with this id doesnt exist", 400));
    }
    if (hostel.hostelRegisterDocument.bulbName) {
      await deleteImageBulb(hostel.hostelRegisterDocument.bulbName);
    }
    if (!req.file) {
      return next(new ErrorHandler("unable to upload the certificate", 400));
    }
    const myCloud = await uploadImageInBulb(req.file.path, next);
    if (!myCloud.imageUrl && myCloud.blobName) {
      return next(new ErrorHandler("unable to upload the certificate", 400));
    }
    hostel.hostelRegisterDocument = {
      url: myCloud.imageUrl,
      bulbName: myCloud.blobName,
    };
    await hostel.save();
    fs.unlinkSync(req.file.path);
    res.status(200).json({
      success: true,
      message: "verification certificated added  successfully",
      hostel,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const verifyHostelHandler = asyncHandler(async (req, res, next) => {
  try {
    const { hostelId } = req.body;
    const hostel = await HostelModel.findById(hostelId);
    if (!hostel) {
      return next(new ErrorHandler("Hostel with this id doesnt exist", 404));
    }
    if (
      !hostel.hostelRegisterDocument.url &&
      !hostel.hostelRegisterDocument.bulbName
    ) {
      return next(
        new ErrorHandler("How can you verify hostel without certificate ", 400)
      );
    }
    if (hostel.status === "pending") {
      hostel.status = "verified";
    } else {
      hostel.status = "pending";
    }
    await hostel.save();
    console.log(hostel);
    res.status(200).json({
      success: true,
      message: "Hostel status has changed successfully",
      hostel,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getAllHostelsForSuperAdminHandler = asyncHandler(
  async (req, res, next) => {
    try {
      const hostels = await HostelModel.find();

      res.status(200).json({
        success: true,
        hostels,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

export const deleteHostelVerificationCertificate = asyncHandler(
  async (req, res, next) => {
    try {
      const { hostelId } = req.body;
      const hostel = await HostelModel.findById(hostelId);
      if (hostel.hostelRegisterDocument.bulbName) {
        console.log(hostel);
      }
      if (hostel.hostelRegisterDocument.bulbName) {
        await deleteImageBulb(hostel.hostelRegisterDocument.bulbName);
      }
      hostel.hostelRegisterDocument = {};
      hostel.status = "pending";
      await hostel.save();

      res.status(200).json({
        success: true,
        hostel,
        message: "Hostel verification certificate deleted successfully",
      });
    } catch (error) {
      console.log(error);
      next(new ErrorHandler(error.message, 500));
    }
  }
);
