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
    avatar: 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1739773924/users/kpbgeoowhpeutmmveldv.png',
  },
  {
    name: 'Sarah Wanjiku',
    role: 'Restaurant Owner, Nairobi',
    message:
      'As a restaurant owner, finding reliable suppliers was always a challenge. With Soko Yetu, I can source fresh vegetables directly from farmers near Nairobi. The quality assessment feature ensures I always get the best produce.',
    rating: 5,
    avatar: 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1739773924/users/kpbgeoowhpeutmmveldv.png',
  },
  {
    name: 'David Omondi',
    role: 'Tomato Farmer, Kiambu',
    message:
      'The AI price insights have been a game-changer for my tomato farm. I now know exactly when to sell for maximum profit. The platform has connected me with buyers I never had access to before, expanding my market reach significantly.',
    rating: 5,
    avatar: 'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1739773924/users/kpbgeoowhpeutmmveldv.png',
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
    <section className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#278783]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-[#FFEBD0]/30 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#278783]/8 rounded-full blur-xl"></div>
        
        {/* Floating quotes decoration */}
        <div className="absolute top-16 right-16 text-[#278783]/10 text-6xl font-serif">&quot;</div>
        <div className="absolute bottom-32 left-16 text-[#278783]/10 text-6xl font-serif rotate-180">&quot;</div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center justify-center p-2 bg-[#278783]/10 rounded-full mb-6">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#278783]/10">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#FFEBD0] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[#278783] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-[#FFEBD0] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-sm font-medium text-[#278783]">Success Stories</span>
            </div>
          </div>

          {/* Title */}
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-[#278783] via-[#278783] to-[#1a5e5a] bg-clip-text text-transparent"
            style={{ fontFamily: 'Leonetta Serif' }}
          >
            Transforming Lives Together
          </h2>
          
          {/* Subtitle */}
          <div className="max-w-3xl mx-auto">
            <p
              className="text-lg text-gray-600 leading-relaxed mb-8"
              style={{ fontFamily: 'LTSipText-Regular' }}
            >
              Hear inspiring stories from farmers and buyers who have revolutionized their agricultural 
              businesses and achieved remarkable success with Soko Yetu.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-500">1000+ Success Stories</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#278783] rounded-full"></div>
                <span className="text-gray-500">40% Average Income Increase</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#FFEBD0] rounded-full"></div>
                <span className="text-gray-500">5-Star Rated Platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Carousel with custom styling */}
        <div className="testimonials-carousel">
          <style jsx global>{`
            .testimonials-carousel .slick-dots {
              bottom: -50px;
            }
            .testimonials-carousel .slick-dots li button:before {
              color: #278783;
              font-size: 12px;
              opacity: 0.5;
            }
            .testimonials-carousel .slick-dots li.slick-active button:before {
              opacity: 1;
              color: #278783;
            }
            .testimonials-carousel .slick-arrow {
              z-index: 10;
            }
            .testimonials-carousel .slick-prev {
              left: -50px;
            }
            .testimonials-carousel .slick-next {
              right: -50px;
            }
            .testimonials-carousel .slick-prev:before,
            .testimonials-carousel .slick-next:before {
              color: #278783;
              font-size: 24px;
            }
          `}</style>
          
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="px-3">
                  <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50 overflow-hidden">
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#278783]/20 via-transparent to-[#FFEBD0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    
                    {/* Top accent bar */}
                    <div className="h-1 bg-gradient-to-r from-[#278783] to-[#FFEBD0]"></div>
                    
                    <div className="relative p-8">
                      {/* Quote icon */}
                      <div className="absolute top-4 right-6 text-4xl text-[#278783]/10 font-serif group-hover:text-[#278783]/20 transition-colors duration-300">
                        &quot;
                      </div>
                      
                      {/* Star Rating with enhanced styling */}
                      <div className="flex justify-center mb-6">
                        <div className="flex space-x-1 p-2 bg-gradient-to-r from-[#FFEBD0]/30 to-[#FFEBD0]/10 rounded-full">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <span 
                              key={i} 
                              className="text-[#FFEBD0] text-xl drop-shadow-sm hover:scale-110 transition-transform duration-200"
                              style={{ 
                                animationDelay: `${i * 0.1}s`,
                                filter: 'drop-shadow(0 0 2px rgba(255, 235, 208, 0.5))'
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Testimonial Message with enhanced typography */}
                      <div className="relative mb-8">
                        <p
                          className="text-gray-700 leading-relaxed text-center italic relative z-10"
                          style={{ fontFamily: 'Navara', fontSize: '1.1rem', lineHeight: '1.8' }}
                        >
                          &quot;{testimonial.message}&quot;
                        </p>
                        
                        {/* Subtle background highlight */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#278783]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                      </div>

                      {/* Enhanced Avatar and User Info */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center space-x-4 p-3 bg-gray-50/50 rounded-full group-hover:bg-[#278783]/5 transition-colors duration-300">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#278783] to-[#FFEBD0] rounded-full p-0.5 group-hover:animate-pulse">
                              <div className="bg-white rounded-full p-0.5">
                                <LazyLoadImage
                                  src={testimonial.avatar}
                                  alt={testimonial.name}
                                  effect="blur"
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <h4
                              className="font-bold text-[#278783] group-hover:text-[#1a5e5a] transition-colors duration-300"
                              style={{ fontFamily: 'Leonetta Serif' }}
                            >
                              {testimonial.name}
                            </h4>
                            <p
                              className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300"
                              style={{ fontFamily: 'LTSipText-Regular' }}
                            >
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom accent */}
                    <div className="h-px bg-gradient-to-r from-transparent via-[#278783]/20 to-transparent"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Slider>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-4 p-6 bg-gradient-to-r from-[#278783]/5 to-[#FFEBD0]/20 rounded-2xl border border-[#278783]/10 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#278783] rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-[#FFEBD0] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#278783]">Ready to write your success story?</p>
              <p className="text-xs text-gray-600">Join thousands of farmers and buyers transforming agriculture</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;