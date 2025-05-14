import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-primary-500 dark:text-primary-400">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-secondary-800 dark:text-secondary-100">
        Page Not Found
      </h2>
      <p className="mt-2 text-secondary-600 dark:text-secondary-400 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/"
        className="mt-8 btn btn-primary flex items-center"
      >
        <Home size={18} className="mr-2" />
        Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;