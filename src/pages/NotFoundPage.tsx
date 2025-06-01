import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Page Not Found | Eclypse';
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-24">
      <div className="container text-center">
        <h1 className="text-6xl md:text-9xl font-bold text-primary">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mt-4 mb-6">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary inline-flex items-center">
          <ArrowLeft size={18} className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;