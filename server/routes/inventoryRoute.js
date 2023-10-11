const router = require("express").Router();
const Inventory = require("../models/inventoryModels");
const User = require("../models/userModel");
const { verifyToken } = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");

//add inventory
router.post("/add", authMiddleware, async (req, res) => {
  try {
    //validate email and inventoryType
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("Invalid Email");

    if (req.body.inventoryType === "in" && user.userType !== "donar") {
      throw new Error("This email is not registered as a donar");
    }

    if (req.body.inventoryType === "out" && user.userType !== "hospital") {
      throw new Error("This email is not registered as a hospital");
    }

    if (req.body.inventoryType === "out") {
      //check if inventory available
      const requestedGroup = req.body.bloodGroup;
      const requestedQuantity = req.body.quantity;
        const organization = new mongoose.Types.ObjectId(req.body.userId);
      console.log(organization);
      const totalInOfRequestedGroup = await Inventory.aggregate([
        {
          $match: {
            organization: organization, // Use lowercase "organization"
            inventoryType: "in", // Use lowercase "inventoryType"
            bloodGroup: requestedGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup", // Use "_id" to group by bloodGroup
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalIn = totalInOfRequestedGroup[0] ? totalInOfRequestedGroup[0].total : 0;

      //calculate totalOut
      const totalOutOfRequestedGroup = await Inventory.aggregate([
        {
          $match: {
            organization,
            inventoryType: "out",
            bloodGroup: requestedGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      const totalOut = totalOutOfRequestedGroup[0]?.total || 0;

      // Calculate availableQuantityOfRequestedGroup
      const availableQuantityOfRequestedGroup = totalIn - totalOut;

      if (availableQuantityOfRequestedGroup < requestedQuantity) {
        throw new Error(
          `only ${availableQuantityOfRequestedGroup} units of ${requestedGroup.toUpperCase()} is available`
        );
      }
      //Assign Hospital ID to inventory
      req.body.hospital = user._id;
    } else {
      req.body.donar = user._id; //assign donar ID to inventory
    }

    // add inventory
    const inventory = new Inventory(req.body);
    await inventory.save();

    return res.send({ success: true, message: "Inventory Added Successfully" });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

//get inventory
router.get("/get", authMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find({ organization: req.body.userId })
      .sort({ createdAt: -1 })
      .populate("donar")
      .populate("hospital");
    return res.send({ success: true, data: inventory });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

//get inventory
router.post("/filter", authMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find(req.body.filters)
      .limit(req.body.limit || 10)
      .sort({ createdAt: -1 })
      .populate("donar")
      .populate("hospital")
      .populate("organization");
    return res.send({ success: true, data: inventory });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

module.exports = router;
