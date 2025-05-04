"use client";

import React from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Dummy data for testimonials
const testimonials = [
  {
    name: 'John Mwangi',
    role: 'Maize Farmer, Nakuru',
    message:
      'Soko Yetu has transformed my farming business. I now get fair prices for my maize and can plan my harvests based on market insights. My income has increased by 40% in just six months!',
    rating: 5,
    avatar: 'https://via.placeholder.com/100?text=JM',
  },
  {
    name: 'Sarah Wanjiku',
    role: 'Restaurant Owner, Nairobi',
    message:
      'As a restaurant owner, finding reliable suppliers was always a challenge. With Soko Yetu, I can source fresh vegetables directly from farmers near Nairobi. The quality assessment feature ensures I always get the best produce.',
    rating: 5,
    avatar: 'https://via.placeholder.com/100?text=SW',
  },
  {
    name: 'David Omondi',
    role: 'Tomato Farmer, Kiambu',
    message:
      'The AI price insights have been a game-changer for my tomato farm. I now know exactly when to sell for maximum profit. The platform has connected me with buyers I never had access to before, expanding my market reach significantly.',
    rating: 5,
    avatar: 'https://via.placeholder.com/100?text=DO',
  },
];

const Testimonials = () => {
  // Carousel settings for react-slick
  const settings = {
    dots: true, // Navigation dots
    arrows: true, // Navigation arrows
    infinite: true, // Loop through slides
    speed: 500, // Transition speed in milliseconds
    slidesToShow: 3, // Show 3 cards on desktop
    slidesToScroll: 1, // Scroll 1 card at a time
    autoplay: true, // Auto-play carousel
    autoplaySpeed: 3000, // 3-second interval
    responsive: [
      {
        breakpoint: 1024, // Tablet breakpoint
        settings: {
          slidesToShow: 2, // Show 2 cards
        },
      },
      {
        breakpoint: 600, // Mobile breakpoint
        settings: {
          slidesToShow: 1, // Show 1 card
        },
      },
    ],
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2
          className="text-3xl font-bold text-center mb-4 text-[#278783]"
          style={{ fontFamily: 'Leonetta Serif' }}
        >
          Success Stories
        </h2>
        <p
          className="text-center mb-8 text-gray-600"
          style={{ fontFamily: 'LTSipText-Regular' }}
        >
          Hear from farmers and buyers who have transformed their agricultural
          business with Soko Yetu.
        </p>

        {/* Carousel */}
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }} // Start off-screen
              whileInView={{ opacity: 1, y: 0 }} // Fade in and slide up
              transition={{ duration: 0.5 }} // Smooth 0.5s transition
              viewport={{ once: true }} // Animate only once when in view
            >
              <div
                className="bg-white rounded-lg shadow-md p-6 mx-2"
                style={{ borderTop: '4px solid #278783' }} // Branding color border
              >
                {/* Star Rating */}
                <div className="flex justify-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-[#FFEBD0] text-xl">
                      ★
                    </span>
                  ))}
                </div>

                {/* Testimonial Message */}
                <p
                  className="text-gray-700 mb-4 italic"
                  style={{ fontFamily: 'Navara' }}
                >
                  &quot;{testimonial.message}&quot;
                </p>

                {/* Avatar and User Info */}
                <div className="flex items-center">
                  <LazyLoadImage
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    effect="blur" // Blur effect while loading
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4
                      className="font-bold text-[#278783]"
                      style={{ fontFamily: 'Leonetta Serif' }}
                    >
                      {testimonial.name}
                    </h4>
                    <p
                      className="text-sm text-gray-500"
                      style={{ fontFamily: 'LTSipText-Regular' }}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;