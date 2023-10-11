const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const AddInventory = require("../models/inventoryModels");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Inventory = require("../models/inventoryModels");

// Register new user
router.post("/register", async (req, res) => {
  try {
    let user = new User(req.body);
    // Check if user already exi
    // let user = new User(req.body);
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    console.log(req.body.password);
    user = new User(req.body);
    /*  const user=new User({
      userType:req.body.userType,
      name:req.body.name,
      phone:req.body.phone,
      email:req.body.email,
      password:hashedPassword
      }) */

    // Create new user & Save new user to the database
    console.log(user);
    await user.save();

    return res.send({
      success: true,
      message: "User registered successfully",
      email: req.body.email,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
      email: req.body.email,
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    // check if userType matches
    if (user.userType !== req.body.userType) {
      return res.send({
        success: false,
        message: `User is not registered as a ${req.body.userType}`,
      });
    }

    // Compare password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.send({
        success: false,
        message: "Invalid password",
      });
    }

    //generate token
    const token = jwt.sign({ userId: user.id }, process.env.jwt_secret, {
      expiresIn: 3600,
    });

    return res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
      user: user,
    });

    // Add the login logic here...
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
      email: req.body.email,
    });
  }
});

//get current user
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ _id: req.body.userId });
    return res.send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all unique donors
router.get("/get-all-donars", authMiddleware, async (req, res) => {
  try {
    // Get all unique donor ids from inventory
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueDonarIds = await Inventory.distinct("donar", {
      organization,
    });

    const donars = await User.find({
      _id: { $in: uniqueDonarIds },
    });

    return res.send({
      success: true,
      data: donars,
      message: "Donars fetched successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});



 //get all unique hospitals
router.get("/get-all-hospitals", authMiddleware, async (req, res) => {
  //get all unique hospitals ids from inventory
  try {
    
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueHospitalIds = await Inventory.distinct("hospital", {
      organization,
    });

    const hospitals = await User.find({
      id: { $in: uniqueHospitalIds },
    });

    return res.send({
      success: true,
      message: "Hospitals fetched succesfully",
      data: hospitals,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});





//get all unique organization  for donar
router.get(
  "/get-all-organizations-of-a-donar",
  authMiddleware,
  async (req, res) => {
    try {
      //get all unique organizations ids from inventory
      const donar = new mongoose.Types.ObjectId(req.body.userId);
      const uniqueOrganizationIds = await Inventory.distinct("organization", {
        donar,
      });

      const hospitals = await User.find({
        id: { $in: uniqueOrganizationIds },
      });

      return res.send({
        success: true,
        message: "Hospitals fetched succesfully",
        data: hospitals,
      });
    } catch (error) {
      return res.send({
        success: false,
        message: error.message,
      });
    }
  }
); 

//get all unique organization  for a hospitals
router.get("/get-all-organizations-of-a-hospital", authMiddleware, async (req, res) => {
    try {
      //get all unique organizations ids from inventory
      const hospital = new mongoose.Types.ObjectId(req.body.userId);
      const uniqueOrganizationIds = await AddInventory.distinct("organization", {
        hospital,
      });

      const hospitals = await User.find({
        id: { $in: uniqueOrganizationIds },
      });

      return res.send({
        success: true,
        message: "Hospitals fetched succesfully",
        data: hospitals,
      });
    } catch (error) {
      return res.send({ 
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;