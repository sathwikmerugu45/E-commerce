import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          <span className={isScrolled ? 'text-primary' : 'text-black'}>Eclypse</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`${
              isScrolled ? 'text-gray-700 hover:text-primary' : 'text-black '
            } font-medium transition-colors`}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={`${
              isScrolled ? 'text-gray-700 hover:text-primary' : 'text-black '
            } font-medium transition-colors`}
          >
            Shop
          </Link>
          <Link 
            to="/about" 
            className={`${
              isScrolled ? 'text-gray-700 hover:text-primary' : 'text-black '
            } font-medium transition-colors`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`${
              isScrolled ? 'text-gray-700 hover:text-primary' : 'text-black '
            } font-medium transition-colors`}
          >
            Contact
          </Link>
        </nav>
        
        {/* Cart and Mobile Menu Buttons */}
        <div className="flex items-center space-x-4">
          <button 
            className={`p-2 rounded-full ${
              isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-black hover:bg-white/10'
            }`}
          >
            <Search size={20} />
          </button>
          
          <Link 
            to="/cart" 
            className={`p-2 rounded-full relative ${
              isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-black hover:bg-white/10'
            }`}
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-full md:hidden ${
              isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
          >
            <nav className="container py-4 flex flex-col space-y-4">
              <Link 
                to="/" 
                className="py-2 px-4 text-gray-800 hover:bg-gray-100 rounded-md font-medium"
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="py-2 px-4 text-gray-800 hover:bg-gray-100 rounded-md font-medium"
              >
                Shop
              </Link>
              <Link 
                to="/about" 
                className="py-2 px-4 text-gray-800 hover:bg-gray-100 rounded-md font-medium"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="py-2 px-4 text-gray-800 hover:bg-gray-100 rounded-md font-medium"
              >
                Contact
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;