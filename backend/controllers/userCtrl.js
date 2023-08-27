const userModel = require('../models/userModels')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "xkjnjs";
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const moment = require('moment')

const loginController = async (req,res)=>{
    try {
        const user = await userModel.findOne({email: req.body.email})
        if(!user){
            return res.send({message: 'user Not exists',success: false})
        }
        const isMatch = await bcrypt.compare(req.body.password,user.password);
        if(!isMatch){
            return res.send({message: "Invalid email or password"});
        }
        const token = jwt.sign({id:user._id},JWT_SECRET,{expiresIn: "1d"})
        res.send({message: 'Login Success',success:true,token})
    } catch (error) {
        console.log(error)
        res.send({success: false,message: `Error login controller ${error.message}`})
    }
}

const registerController = async (req,res)=>{
    try {
        const existinguser = await userModel.findOne({email: req.body.email})
        if(existinguser){
            return res.send({message: 'user Already exists',success: false})
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        req.body.password = hash;
        const newUser = new userModel(req.body)
        await newUser.save();
        res.send({message: 'register successfully',success: true});
    } catch (error) {
        console.log(error)
        res.send({success: false,message: `Register controller ${error.message}`})
    }
}

const authcontroller = async (req,res)=>{
    try {
        const user = await userModel.findById({_id: req.body.userId})
        user.password = undefined;
        if(!user){
            res.send({message: "user not found",success: false})
        }
        else{
            res.send({success: true,
                data: user
            })
        }
    } catch (error) {
        console.log(error)
        res.send({message: 'auth error',success: false});
    }
}

const applyDoctorController = async (req,res) =>{
    try {
        const newDoctor = await doctorModel({...req.body, status:'pending'});
        await newDoctor.save()
        const adminUser = await userModel.findOne({isAdmin:true})
        const notifcation = adminUser.notifcation;
        notifcation.push({
            type: 'apply-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName}`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: "/admin/docotrs",
              },
        })
        await userModel.findByIdAndUpdate(adminUser._id,{notifcation})
        res.send({success: true , message: "Doctor account applied successfully"});
    } catch (error) {
        console.log(error)
        res.send({success: false , message: "error while applying Doctor"});
    }
}

const getAllNotificationController = async (req, res) => {
    try {
      const user = await userModel.findOne({ _id: req.body.userId });
      const seennotification = user.seennotification;
      const notifcation = user.notifcation;
      seennotification.push(...notifcation);
      user.notifcation = [];
      user.seennotification = notifcation;
      const updatedUser = await user.save();
      res.status(200).send({success: true,message: "all notification marked as read",data: updatedUser});
    } catch (error) {
      console.log(error);
      res.status(500).send({message: "Error in notification",success: false,error,});
    }
  };

  const deleteAllNotificationController = async (req, res) => {
    try {
      const user = await userModel.findOne({ _id: req.body.userId });
      user.notifcation = [];
      user.seennotification = [];
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).send({success: true,message: "Notifications Deleted successfully",data: updatedUser});
    } catch (error) {
      console.log(error);
      res.status(500).send({success: false,message: "unable to delete all notifications",error});
    }
  };

  const getAllDocotrsController = async (req, res) => {
    try {
      const doctors = await doctorModel.find({ status: "approved" });
      res.status(200).send({success: true,message: "Docots Lists Fetched Successfully",data: doctors});
    } catch (error) {
      console.log(error);
      res.status(500).send({success: false,error,message: "Errro WHile Fetching DOcotr"});
    }
  };

  const bookAppointmentController = async (req,res)=>{
    try {
        req.body.date = moment(req.body.date, "DD-MM-YY").toISOString();
        req.body.time = moment(req.body.time, "HH:mm").toISOString();
        const newappointment = await appointmentModel({...req.body, status: 'pending'})
        await newappointment.save();
        const user = await userModel.findOne({_id: req.body.doctorInfo.userId})
        user.notifcation.push({
            type: "New-appointment-request",
            message: `A nEw Appointment Request from ${req.body.userInfo.name}`,
            onCLickPath: "/user/appointments",
        })
        await user.save();
        res.send({message: "appointment booked",success: true});
    } catch (error) {
        console.log(error);
        res.status(500).send({success: false,error,message: "Errro WHile booking appointment"});
    }
  }

  const userAppointmentController = async (req,res)=>{
    try {
        const appointments = await appointmentModel.find({})
        res.send({success: true,message: "appintment success",data: appointments});
    } catch (error) {
        console.log(error);
        res.status(500).send({success: false,error,message: "Errro WHile user appointment"});
    }
  }

  const UpdateAppointmentController = async (req,res)=>{
    try {
        const {appointmentId,status} = req.body;
        const updateappointment = await appointmentModel.findByIdAndUpdate(appointmentId, {status});
        const user = await userModel.findOne({_id: updateappointment.userId});
        user.notifcation.push({
            type:"Update-appointment-Request",
            message:`Your Appointement with Dr has been ${status}`,
            onClickpath:'/',
        })
        await user.save();
        res.send({success: true,message: "update appintment success"});
    } catch (error) {
        console.log(error);
        res.status(500).send({success: false,error,message: "Errro WHile update appointment"});
    }
  }

module.exports = {loginController,registerController,authcontroller,applyDoctorController,getAllNotificationController,deleteAllNotificationController,getAllDocotrsController,bookAppointmentController,userAppointmentController,UpdateAppointmentController}