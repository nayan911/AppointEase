import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import moment from 'moment/moment'
import { DatePicker, TimePicker, message } from 'antd'
import { useSelector } from 'react-redux'

const BookingPage = () => {
    
    const {user} = useSelector(state=>state.user)
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [isAvailable, setIsAvailable] = useState();
    const params = useParams();
    const [doctors,setdoctors] = useState([])
    const getUserData = async () => {
        try {
          const res = await axios.post("/api/v1/doctor/getdoctorbyid",{ doctorId: params.id },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
          if (res.data.success) {
            setdoctors(res.data.data);
          }
        } catch (error) {
          console.log(error);
        }
      };

      const handleBooking = async ()=>{
        try {
            const res = await axios.post('/api/v1/user/book-appointment',{doctorId: params.id, useId: user._id, doctorInfo: doctors, date: date, time: time,userInfo: user},{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(res.data.success){
                message.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
      }

    useEffect(() => {
        getUserData();
        // eslint-disable-next-line
    }, [])
    

  return (
    <Layout>
      <h1>Booking Page</h1>
      {doctors && (
          <div>
            <h4>
              Dr.{doctors.firstName} {doctors.lastName}
            </h4>
            <h4>Fees : {doctors.feesPerCunsaltation}</h4>
            <h4>
              Timings : {doctors.timings && doctors.timings[0]} -{" "}
              {doctors.timings && doctors.timings[1]}{" "}
            </h4>
            <div className="d-flex flex-column w-50">
              <DatePicker className="m-2" format="DD-MM-YYYY" onChange={(value) =>setDate(moment(value).format("DD-MM-YYYY"))} />
              <TimePicker format="HH:mm" className="m-2" onChange={(value) => {setTime(moment(value).format("HH:mm"));}} />
              <button className="btn btn-primary mt-2"> Check Availability </button>
              <button className="btn btn-dark mt-2" onClick={handleBooking}>Book Now</button>
            </div>
          </div>
        )}
    </Layout>
  )
}

export default BookingPage
