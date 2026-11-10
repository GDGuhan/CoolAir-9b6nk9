import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wind, Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 gradient-brand rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30">
          <Wind className="w-12 h-12 text-white" />
        </div>

        {/* Content */}
        <h1 className="text-7xl font-bold text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Oops! This page seems to have blown away. The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
          <button
            onClick={() => navigate("/products")}
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Browse Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
