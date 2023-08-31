import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Row, message } from 'antd';

const DoctorProfile = () => {

  const params = useParams();
  const [singledoctors,setsingleDoctors] = useState([]);

    const getsingledoctorinfo = async () => {
    try {
      const res = await axios.post("/api/v1/admin/getsingleprofile",{ doctorId: params.id},{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setsingleDoctors(res.data.data)
      }
    } catch (error) {
      message.error("Something Went Wrong");
    }
  };

  useEffect(()=>{
    getsingledoctorinfo();
  },[])

  return (
    <Layout>
        <Row>
          <div className='card m-2'>
            <div className='card-header'>
              <h1>{singledoctors.firstName} {singledoctors.lastName}</h1>
            </div>
            <div className='card-header' style={{height: "60vh", fontSize: "20px"}}>
                 <b>Specialization</b> - {singledoctors.specialization}<br></br>
                 <b>Email</b> - {singledoctors.email}<br></br>
                 <b>Experience</b> - {singledoctors.experience}<br></br>
                 <b>Contact</b> - {singledoctors.phone}<br></br>
                 <b>Status</b> - {singledoctors.status}<br></br>
                 <b>Address</b> - {singledoctors.address}<br></br>
                 <b>Fees</b> - {singledoctors.feesPerCunsaltation}
            </div>
          </div>
        </Row>
    </Layout>
  )
}

export default DoctorProfile
