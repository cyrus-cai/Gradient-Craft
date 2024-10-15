'use client'

import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import React from 'react';
import RefinedFlowingBackground from './components/RefinedFlowingBackground';

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <RefinedFlowingBackground />
      <div className="relative z-10">
        <Header />
        <Hero />
        <Footer />
      </div>
    </div>
  );
};

export default Home;