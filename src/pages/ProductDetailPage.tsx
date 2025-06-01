import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Share2, Check, Minus, Plus, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { getProductById } from '../data/products';
import { useCart } from '../context/CartContext';
import { Product } from '..';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  
  useEffect(() => {
    if (id) {
      const productData = getProductById(parseInt(id));
      if (productData) {
        setProduct(productData);
        document.title = `${productData.name} | Eclypse`;
      }
      setLoading(false);
    }
    
    window.scrollTo(0, 0);
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity
      });
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  if (loading) {
    return (
      <div className="container py-24 flex justify-center items-center h-[50vh]">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-8">The product you are looking for does not exist.</p>
        <Button onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }
  
  return (
    <div className="py-24">
      <div className="container">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center mb-8 text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </motion.button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white rounded-lg overflow-hidden mb-4">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveImage(index)}
                  className={`border rounded-md overflow-hidden ${
                    activeImage === index ? 'ring-2 ring-accent' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={image} alt={`${product.name} - view ${index + 1}`} className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
          
          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl text-accent font-semibold mb-6">${product.price.toLocaleString()}</p>
            
            <div className="prose prose-lg mb-8">
              <p>{product.description}</p>
            </div>
            
            {/* Features */}
            {product.features && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={18} className="text-accent mr-2 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center">
                <button 
                  onClick={decrementQuantity}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300">
                  {quantity}
                </div>
                <button 
                  onClick={incrementQuantity}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            {/* Add to Cart */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Button 
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                icon={<ShoppingBag size={18} />}
                disabled={!product.inStock}
                className="flex-grow"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                icon={<Heart size={18} />}
                className="w-12 p-0"
                aria-label="Add to Wishlist"
              />
              
              <Button 
                variant="outline"
                size="lg"
                icon={<Share2 size={18} />}
                className="w-12 p-0"
                aria-label="Share Product"
              />
            </div>
            
            {/* Success Message */}
            {addedToCart && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-success-light text-white p-4 rounded-md flex items-center"
              >
                <Check size={18} className="mr-2" />
                Added to cart successfully!
              </motion.div>
            )}
            
            {/* Additional Info */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span className="mr-2 font-medium">Category:</span>
                <span className="capitalize">{product.category}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2 font-medium">Availability:</span>
                <span className={product.inStock ? 'text-success' : 'text-error'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;