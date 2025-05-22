
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MessageSquare, Home, LogOut, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout, username } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-askedout-olive rounded-full p-2">
              <MessageSquare size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-askedout-olive">AskedOut</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-askedout-olive flex items-center">
                  <Home size={20} className="mr-1" />
                  <span className="hidden sm:inline">Hey Anon!</span>
                </Link>
                <Link to={`/profile/${username}`} className="text-gray-600 hover:text-askedout-olive flex items-center">
                  <User size={20} className="mr-1" />
                  <span className="hidden sm:inline">{username}</span>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="text-gray-600 hover:text-askedout-olive"
                >
                  <LogOut size={20} className="mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" className="bg-askedout-olive hover:bg-askedout-olive/90">Register</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-10">
        {children}
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} AskedOut. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
