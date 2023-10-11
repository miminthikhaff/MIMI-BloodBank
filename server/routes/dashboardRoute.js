const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Inventory = require("../models/inventoryModels");
const mongoose = require("mongoose");

//get all blood groups totalIn, totalOut, available data from inventory
router.get("/blood-groups-data",authMiddleware, async (req, res) => {
  console.log("1111");
  try {
    const allBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    const bloodGroupsData = [];

    await Promise.all(
      allBloodGroups.map(async (bloodGroup) => {
        const totalIn = await Inventory.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "in",
              organization:organization
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$quantity",
              },
            },
          },
        ]);

        const totalOut = await Inventory.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "out", // Changed 'type' to 'inventoryType'
              organization,
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$quantity",
              },
            },
          },
        ]);

        const available = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

        bloodGroupsData.push({
          bloodGroup,
          available,
          totalIn: totalIn[0]?.total || 0,
          totalOut: totalOut[0]?.total || 0,
        });
      })
    );

    res.send({
      success: true,
      message: "Blood Groups Data",
      data: bloodGroupsData,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
