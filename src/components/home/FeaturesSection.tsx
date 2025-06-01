import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Award, Truck } from 'lucide-react';

const features = [
  {
    icon: <ShieldCheck size={24} />,
    title: 'Authentic Guarantee',
    description: 'Every timepiece comes with a certificate of authenticity and a 5-year international warranty.'
  },
  {
    icon: <Truck size={24} />,
    title: 'Free Shipping',
    description: 'Enjoy complimentary shipping on all orders over $1000, delivered with care and security.'
  },
  {
    icon: <Award size={24} />,
    title: 'Expert Craftsmanship',
    description: 'Our watches are crafted by master watchmakers with decades of experience in horology.'
  },
  {
    icon: <Clock size={24} />,
    title: 'Precision Engineering',
    description: 'Each movement is rigorously tested to ensure exceptional accuracy and reliability.'
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;