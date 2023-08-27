import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';
import ProtectedRoutes from './components/ProtectedRoutes';
import PublicRoute from './components/PublicRoute';
import ApplyDoctor from './pages/ApplyDoctor';
import NotificationPage from './pages/NotificationPage';
import Users from './pages/admin/Users';
import Doctors from './pages/admin/Doctors';
import Profile from './pages/doctor/Profile';
import BookingPage from './pages/BookingPage';
import Appointments from './pages/Appointments';
// import DoctorList from './components/DoctorList';

function App() {
  const {loading} = useSelector(state=>state.alerts) // state.reducer hota hai and reducer humara alerts hai
  return (
    <>
        <Router>
          {loading ? <Spinner/> : 
            <Routes>
            <Route path='/' element={<ProtectedRoutes><HomePage/></ProtectedRoutes>}/>
            <Route path='/apply-doctor' element={<ProtectedRoutes><ApplyDoctor/></ProtectedRoutes>}/>
            <Route path='/notification' element={<ProtectedRoutes><NotificationPage/></ProtectedRoutes>}/>
            <Route path='/admin/users' element={<ProtectedRoutes><Users/></ProtectedRoutes>}/>
            <Route path='/admin/doctors' element={<ProtectedRoutes><Doctors/></ProtectedRoutes>}/>
            <Route path='/doctor/profile/:id' element={<ProtectedRoutes><Profile/></ProtectedRoutes>}/>
            <Route path='/login' element={<PublicRoute><Login/></PublicRoute>}/>
            <Route path='/register' element={<PublicRoute><Register/></PublicRoute>}/>
            <Route path='/doctor/book-appointment/:id' element={<ProtectedRoutes><BookingPage/></ProtectedRoutes>}/>
            <Route path='/appointments' element={<ProtectedRoutes><Appointments/></ProtectedRoutes>}/>
            {/* <Route path='/doctorlist' element={<PublicRoute><DoctorList/></PublicRoute>}/> */}
        </Routes>
        }
        </Router>
    </>
  );
}

export default App;
