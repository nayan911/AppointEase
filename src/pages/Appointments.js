import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import { Table, message } from 'antd'
import moment from 'moment/moment'

const Appointments = () => {

    const [appointments,setappointments] = useState([])
    const getappointment = async ()=>{
        try {
            const res = await axios.get('/api/v1/user/user-appointment',{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(res.data.success){
                setappointments(res.data.data);
                message.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleappClick = async (record,status)=>{
      try {
        const res = await axios.post("/api/v1/user/updateappointment",{status: status, appointmentId: record._id, userId: record.userId},{
          headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if(res.data.success){
          message.success("Appointment status updated successfully")
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
        getappointment();
    },[])

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
        },
        // {
        //     title: 'Name',
        //     dataIndex:'name',
        //     render:(text,record)=>(
        //         <span>{record.doctorInfo.firstName} {record.doctorInfo.lastName}</span>
        //     )
        // },
        {
            title: "Date & Time",
            dataIndex: "date",
            render: (text, record) => (
              <span>
                {moment(record.date).format("DD-MM-YYYY")} &nbsp;
                {moment(record.time).format("HH:mm")}
              </span>
            ),
          },
          {
            title: "Status",
            dataIndex: "status",
          },
          {
            title: "Actions",
            dataIndex: "actions",
            render: (text,record)=>(
              <div className='d-flex'>
                {record.status==="pending" ? (
                  <>
                  <button className='btn btn-primary mx-1' onClick={()=>{handleappClick(record,"approved")}}>Approve</button>
                  <button className='btn btn-danger mx-1' onClick={()=>{handleappClick(record,"rejected")}}>reject</button>
                  </>
                ) : (
                  <>
                  {record.status==="approved"?(
                    <span>approved</span>
                  ):(
                    <span>rejected</span>
                  )}
                  </>
                )}
              </div>
            )
          }
    ]

  return (
    <Layout>
      <h1>Appointment list</h1>
      <Table columns={columns} dataSource={appointments}></Table>
    </Layout>
  )
}

export default Appointments