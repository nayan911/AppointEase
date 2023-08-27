const express = require("express");
const { getDoctorInfoController, updateProfileController, getDoctorbyid } = require("../controllers/doctorCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//POST SINGLE DOC INFO
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

router.post("/getdoctorbyid", authMiddleware, getDoctorbyid);

module.exports = router;