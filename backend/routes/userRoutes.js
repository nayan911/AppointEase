const express = require('express')
const { loginController, registerController, authcontroller, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDocotrsController, bookAppointmentController, userAppointmentController, UpdateAppointmentController} = require('../controllers/userCtrl')
const authMiddleware = require('../middlewares/authMiddleware')

//router obj
const router = express.Router()

//routes
//Login || POST
router.post('/login',loginController)

// register || POST
router.post('/register',registerController)

router.post('/getUserData',authMiddleware,authcontroller)

//apply doctor
router.post('/apply-doctor',authMiddleware,applyDoctorController)

router.post("/get-all-notification",authMiddleware,getAllNotificationController);

router.post("/delete-all-notification",authMiddleware,deleteAllNotificationController);

router.get("/getAllDoctors",authMiddleware,getAllDocotrsController);

router.post("/book-appointment",authMiddleware,bookAppointmentController);

router.get("/user-appointment",authMiddleware,userAppointmentController);

router.post("/updateappointment",authMiddleware,UpdateAppointmentController);

module.exports = router