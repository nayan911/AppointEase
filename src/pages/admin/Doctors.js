import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import axios from 'axios';
import { Table, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const Doctors = () => {

  const [doctors,setDoctors] = useState([]);
  // const [singledoctors,setsingleDoctors] = useState([]);
  const navigate = useNavigate();

  const getDoctors = async ()=>{
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors",{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if(res.data.success){
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);

    }
  }

  // handle Account
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post("/api/v1/admin/changeAccountStatus",{ doctorId: record._id, userId: record.userId, status: status },{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      }
    } catch (error) {
      message.error("Something Went Wrong");
    }
  };

  // const handleprofile = async (record) => {
  //   try {
  //     const res = await axios.get("/api/v1/admin/getsingleprofile",{ doctorId: record._id},{
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     console.log(record._id);
  //     if (res.data.success) {
  //       console.log(res.data.data)
  //       setsingleDoctors(res.data.data)
  //     }
  //     console.log(singledoctors);
  //     console.log("got the profile");
  //   } catch (error) {
  //     message.error("Something Went Wrong");
  //   }
  // };


  useEffect(()=>{
    getDoctors();
  },[])

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
          <button className="btn btn-outline-secondary btn-sm mx-1" onClick={() => navigate(`/admin/doctor/profile/${record._id}`)}>Full Profile</button>
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "phone",
      dataIndex: "phone",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" ? (
            <>
              <button className="btn btn-success mx-1" onClick={()=>handleAccountStatus(record,"approved")}>Approve</button>
              <button className="btn btn-danger mx-1" onClick={()=>handleAccountStatus(record,"rejected")}>Reject</button>
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
      ),
    },
  ];

  return (
    <Layout>
      <h1>Doctors List</h1>
      <Table columns={columns} dataSource={doctors}/>
    </Layout>
  )
}

export default Doctors