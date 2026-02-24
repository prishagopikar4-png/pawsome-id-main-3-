import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dog, LogOut, Menu, X, Search, User, Shield } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="gov-header">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-accent rounded">
            <Dog className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">PetChip Registry</h1>
            <p className="text-xs opacity-80">National Dog Microchip System</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/lookup" className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity">
            <Search className="w-4 h-4" />
            Chip Lookup
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity">
                <Shield className="w-4 h-4" />
                Dashboard
              </Link>
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-primary-foreground/30">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs opacity-80 capitalize">{user?.role}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="secondary" size="sm" className="gap-1.5">
                <User className="w-4 h-4" />
                Login / Register
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 hover:bg-primary-foreground/10 rounded"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden container py-4 space-y-2 border-t border-primary-foreground/20 mt-3">
          <Link 
            to="/lookup" 
            className="flex items-center gap-2 py-2 hover:opacity-80"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Search className="w-4 h-4" />
            Chip Lookup
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 py-2 hover:opacity-80"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="w-4 h-4" />
                Dashboard
              </Link>
              <button 
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 py-2 hover:opacity-80 w-full"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/auth" 
              className="flex items-center gap-2 py-2 hover:opacity-80"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="w-4 h-4" />
              Login / Register
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
