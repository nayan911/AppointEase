const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController, singleprofilecontroller } = require("../controllers/adminCtrl");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

//GET METHOD || DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// post status approval
router.post("/changeAccountStatus",authMiddleware,changeAccountStatusController)

router.post("/getsingleprofile",authMiddleware,singleprofilecontroller)

module.exports = router;