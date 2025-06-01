import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative h-[90vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg" 
          alt="Luxury watch" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-xl">
          <motion.h5
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-accent font-medium mb-4"
          >
            The Art of Timekeeping
          </motion.h5>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
          >
            Exceptional Timepieces for Extraordinary People
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-200 text-lg mb-8"
          >
            Discover our collection of luxury watches, crafted with precision and designed to last a lifetime.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link 
              to="/products" 
              className="btn btn-accent flex items-center"
            >
              Explore Collection
              <ArrowRight size={18} className="ml-2" />
            </Link>
            
            <Link 
              to="/about" 
              className="btn btn-outline bg-transparent text-white border-white hover:bg-white hover:text-primary"
            >
              Our Story
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;