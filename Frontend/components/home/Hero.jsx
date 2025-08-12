import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  Clock,
  Navigation2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackgroundEffect = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Animated gradient orbs */}
    <div className="absolute w-screen h-screen">
      <div className="absolute w-96 h-96 -top-48 -left-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute w-96 h-96 top-1/3 right-1/4 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
    </div>

    {/* Light grid overlay */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    ></div>
  </div>
);

const GlowingBadge = ({ icon: Icon, text, color }) => (
  <div
    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium 
    bg-${color}-500/10 text-${color}-600 border border-${color}-500/20 
    shadow-lg shadow-${color}-500/10 hover:bg-${color}-500/20 transition-all duration-300`}
  >
    <Icon className="w-4 h-4 mr-2" />
    {text}
  </div>
);

const Hero = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Smarter Logistics, Faster Deliveries";
  const navigate = useNavigate();

  const buttons = [
  {
    text: "Get Started",
    onClick: () => navigate("/home"),
    className:
      "bg-gradient-to-r from-gray-800 to-black text-white hover:shadow-md hover:shadow-gray-900/50",
    icon: (
      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
    ),
  },
    {
  text: "See Demo",
  onClick: () => navigate("/demo"),
  className:
    "bg-gray-900 border border-gray-700 text-white hover:bg-black hover:border-black",
  icon: <PlayCircle className="ml-2 w-5 h-5 text-white" />,
}
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-white text-black font-sans overflow-hidden">
      <BackgroundEffect />

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative container mx-auto px-6 pt-32 pb-24"
      >
        <div className="max-w-5xl mx-auto text-center">

          {/* Removed truck icon */}

          {/* Badges */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <GlowingBadge icon={Clock} text="Real-Time Tracking" color="cyan" />
            <GlowingBadge icon={Navigation2} text="Route Optimization" color="cyan" />
            {/* Omitted truck badge as truck icon is removed */}
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              Revolutionize Your Logistics Operations
            </span>
          </motion.h1>

          {/* Animated Subtitle */}
          <motion.div variants={itemVariants} className="h-8 mb-8">
            <span className="text-xl text-cyan-600 font-mono">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
          >
            TrakIndia streamlines deliveries with AI-driven planning, real-time tracking, and smart logistics insights
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 mt-12"
          >
            {buttons.map(({ text, onClick, className, icon }, index) => (
              <motion.button
                key={index}
                onClick={onClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`group px-8 py-4 cursor-pointer rounded-xl transition-all duration-300 flex items-center justify-center font-medium ${className}`}
              >
                <span>{text}</span>
                {icon}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default Hero;
