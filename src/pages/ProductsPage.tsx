import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ui/ProductCard';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { Product } from '..';
import { Filter, ChevronDown } from 'lucide-react';

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortOption, setSortOption] = useState<string>('default');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    document.title = 'Shop | Eclypse';
    
    window.scrollTo(0, 0);
    
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location]);

  useEffect(() => {
    let result = [...products];
    
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, priceRange, sortOption]);

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Collection</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our exquisite range of timepieces, each a masterpiece of design and engineering.
          </p>
        </div>
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-6">
          <button 
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full py-3 px-4 bg-gray-100 rounded-md flex items-center justify-between"
          >
            <div className="flex items-center">
              <Filter size={18} className="mr-2" />
              <span>Filters</span>
            </div>
            <ChevronDown size={18} className={`transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <motion.aside 
            className={`md:w-1/4 ${isMobileFilterOpen ? 'block' : 'hidden'} md:block`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left py-1 ${selectedCategory === null ? 'text-accent font-medium' : 'text-gray-600'}`}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map(category => (
                    <li key={category.id}>
                      <button 
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`w-full text-left py-1 ${selectedCategory === category.slug ? 'text-accent font-medium' : 'text-gray-600'}`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">${priceRange[0].toLocaleString()}</span>
                  <span className="text-gray-600">${priceRange[1].toLocaleString()}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          </motion.aside>
          
          {/* Product Grid */}
          <motion.div 
            className="md:w-3/4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{filteredProducts.length} products</p>
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-gray-600">Sort by:</label>
                <select 
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-gray-300 rounded-md p-2"
                >
                  <option value="default">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
            
            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No products found matching your criteria.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;