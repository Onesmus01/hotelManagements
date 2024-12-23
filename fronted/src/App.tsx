import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Edithotel from "./pages/Edithotel";
import Search from "./pages/Search";
import Details from "./pages/Details";
import Booking from "./pages/Booking";
import BookingForm from "./forms/BookingForm/BookingForm";
import MyBookings from "./pages/myBookings";
import Home from "./pages/Home";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token"); 
    console.log("Auth Token:", token);

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer />
      
      
      <div className="">
        <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />

          <Route path="/search" element={<Layout><Search /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/signin" element={<Layout><SignIn /></Layout>} />
          <Route path="/detail/:hotelId" element={<Layout><Details/></Layout>} />



          
          {/* Protected Routes */}
          {isLoggedIn && (
            <>
              <Route path="/add-hotel" element={<Layout><AddHotel /></Layout>} />
              <Route path="/edit-hotel/:hotelId" element={<Layout><Edithotel /></Layout>} />
              <Route path="/my-hotels" element={<Layout><MyHotels /></Layout>} />
              <Route path='/hotel/:hotelId/booking' element={<Layout><Booking /></Layout>} />
              <Route path='/mybookings' element={<Layout><MyBookings /></Layout>} />



            </>
          )}
        </Routes>
      </div>
      
    </BrowserRouter>
  );
};

export default App;
