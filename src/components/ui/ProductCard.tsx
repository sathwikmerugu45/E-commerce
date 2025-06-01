import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../..';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="product-card"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden group">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="h-64 w-full object-cover"
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleAddToCart}
              className="bg-white text-primary rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform"
              aria-label="Add to cart"
            >
              <ShoppingBag size={20} />
            </button>
          </div>
          
          {!product.inStock && (
            <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs font-bold px-3 py-1">
              Out of Stock
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
          <p className="text-accent font-semibold">${product.price.toLocaleString()}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;