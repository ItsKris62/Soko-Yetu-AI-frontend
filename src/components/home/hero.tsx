"use client";

import { useEffect } from 'react';
import CountUp from 'react-countup';
import Button from '../common/Button';

const Hero = () => {
  useEffect(() => {
    const video = document.getElementById('hero-video') as HTMLVideoElement;
    if (video) video.play();
  }, []);

  const stats = [
    { value: 5280, label: 'Active Farmers', color: 'text-[#88ddd8]' },
    { value: 12450, label: 'Products Listed', color: 'text-[#FFEBD0]' },
    { value: 8740, label: 'Successful Trades', color: 'text-[#88ddd8]' },
  ];

  return (
    <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background Video */}
      <video
        id="hero-video"
        className="absolute top-0 left-0 w-full h-full object-cover z-[-2]"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/v1744231895/hero-video.mp4`} 
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-[-1]" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-10 lg:gap-20 max-w-7xl">

        {/* Left Column: Text and CTAs */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="font-leonetta text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-wide text-white drop-shadow-lg">
            Empowering Kenyan Farmers with AI-Driven Insights
          </h1>
          <p className="font-siptext text-lg md:text-xl mb-8 max-w-lg mx-auto md:mx-0 text-gray-200">
            Connect directly with buyers, get fair prices, and make data-driven decisions with our innovative agricultural marketplace.
          </p>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              variant="primary"
              size="lg"
              className="bg-[#278783] hover:bg-[#1f6f6b] text-white font-navara px-6 py-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
            >
              List Your Produce
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="bg-[#FFEBD0] hover:bg-[#ffe3c0] text-[#121212] font-navara px-6 py-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Find Products
            </Button>
          </div>
        </div>

        {/* Right Column: Stats Cards */}
        <div className="w-full md:w-1/2 flex flex-col sm:flex-row gap-5">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center flex flex-col items-center flex-1 border border-white/20 hover:border-white/40 transition-all duration-300"
            >
              <span className="text-3xl sm:text-4xl font-hogira font-bold">
                <CountUp start={0} end={stat.value} duration={2.5} separator="," />
              </span>
              <span className={`mt-2 text-sm font-medium ${stat.color}`}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Hero;