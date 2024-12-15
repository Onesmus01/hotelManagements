import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import Register from '../pages/Register';
import AddHotel from '../pages/AddHotel';
import SearchBar from '../components/SearchBar';

interface Props {
    children: React.ReactNode;
}

const Layout = ({children}: Props) => {
  return (
    <div>
        <div className=" shadow flex flex-col min-h-screen">
            <Header />

            <Hero />
            <div className="container mx-auto">
              <SearchBar />
            </div>
            <div className="flex  mb-3 ml-39 justify-center items-center">
            <AddHotel />
            </div>
            <div className="container mx-auto py-10 flex-1">{children}</div>
            <Footer />
        </div>
      
    </div>
  )
}

export default Layout
