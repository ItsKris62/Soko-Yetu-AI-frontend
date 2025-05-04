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
    { value: 5280, label: 'Active Farmers', color: 'text-green-300' },
    { value: 12450, label: 'Products Listed', color: 'text-orange-300' },
    { value: 8740, label: 'Successful Trades', color: 'text-blue-300' },
  ];

  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white">
      {/* Background Video */}
      <video
        id="hero-video"
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-[-1]" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-8 md:gap-16">

        {/* Left Column: Text and CTAs */}
        <div className="w-full md:w-1/2 lg:w-3/5 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Empowering Kenyan Farmers with AI-Driven Insights
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Connect directly with buyers, get fair prices, and make data-driven decisions with our innovative agricultural marketplace.
          </p>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              variant="primary" 
              size="lg" 
            >
              List Your Produce
            </Button>
            <Button
              variant="secondary"
              size="lg" 
              
            >
              Find Products
            </Button>
          </div>
        </div>

        {/* Right Column: Stats Cards */}
        <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col sm:flex-row gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-6 text-center flex flex-col items-center flex-1 w-full sm:w-auto"
            >
              <span className="text-3xl font-bold">
                <CountUp start={0} end={stat.value} duration={2.5} separator="," />
              </span>
              <span className={`mt-1 text-sm font-medium ${stat.color}`}>
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