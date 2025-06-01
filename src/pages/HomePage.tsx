import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategorySection from '../components/home/CategorySection';
import FeaturesSection from '../components/home/FeaturesSection';

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Eclypse | Luxury Watches';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <CategorySection />
      <FeaturesSection />
    </div>
  );
};

export default HomePage;