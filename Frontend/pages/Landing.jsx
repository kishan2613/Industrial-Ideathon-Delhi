import React from "react";
import Hero from "../components/home/Hero";
import Navigation from "../components/common/Navbar";
// import Features from "../components/home/Feartures";
// import Services from "../components/home/Services";
// import Stats from "../components/home/Stats";
// import Footer from "../components/home/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-black text-white">
        <Navigation/>
        <Hero/>
    </div>
  );
};

export default Landing;
