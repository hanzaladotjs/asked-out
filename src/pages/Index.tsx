
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import Layout from '@/components/Layout';

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="animate-bounce-slow mb-6">
          <div className="bg-duolingo-purple rounded-full p-4 inline-block">
            <MessageCircle size={48} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-duolingo-purple mb-6">
          Anonymous Questions, <br/>Real Answers
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl">
          Create your profile, share your link, and let people ask you anything anonymously!
        </p>
        
        <div className="space-x-4">
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-duolingo-purple hover:bg-duolingo-purple/90 text-lg px-6"
            >
              Get Started
            </Button>
          </Link>
          
          <Link to="/login">
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-6 border-duolingo-purple text-duolingo-purple hover:bg-duolingo-soft-purple"
            >
              Login
            </Button>
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="bg-white rounded-lg p-6 shadow-md border-2 border-duolingo-light-purple">
            <div className="bg-duolingo-yellow rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="font-bold text-lg">1</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Create your profile</h3>
            <p className="text-gray-600">Sign up with just a username and password to get started.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border-2 border-duolingo-light-purple">
            <div className="bg-duolingo-yellow rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="font-bold text-lg">2</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Share your link</h3>
            <p className="text-gray-600">Share your unique profile link on social media or with friends.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border-2 border-duolingo-light-purple">
            <div className="bg-duolingo-yellow rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="font-bold text-lg">3</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Get anonymous questions</h3>
            <p className="text-gray-600">Receive and answer questions completely anonymously.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
