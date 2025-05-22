
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, Question, User } from '@/lib/api';
import Layout from '@/components/Layout';
import QuestionCard from '@/components/QuestionCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const QuestionView = () => {
  const { username, questionId } = useParams<{ username: string; questionId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchQuestionDetails();
  }, [username, questionId]);
  
  const fetchQuestionDetails = async () => {
    if (!username || !questionId) return;
    
    setLoading(true);
    try {
      const fetchedUser = await api.getUserByUsername(username);
      
      if (fetchedUser) {
        setUser(fetchedUser);
        const fetchedQuestion = await api.getQuestionById(fetchedUser.id, questionId);
        
        if (fetchedQuestion && fetchedQuestion.answer) {
          setQuestion(fetchedQuestion);
        } else {
          setQuestion(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load question details",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <p>Loading question...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <h1 className="text-3xl font-bold mb-4 text-duolingo-purple">User not found</h1>
          <p className="text-gray-600">The username '{username}' doesn't exist.</p>
          <Link to="/" className="mt-4">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (!question) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <h1 className="text-3xl font-bold mb-4 text-duolingo-purple">Question not found</h1>
          <p className="text-gray-600">This question may not exist or hasn't been answered yet.</p>
          <Link to={`/profile/${username}`} className="mt-4">
            <Button variant="outline">Back to {username}'s Profile</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Link to={`/profile/${username}`} className="inline-flex items-center text-duolingo-purple hover:underline mb-6">
          <ArrowLeft size={16} className="mr-1" />
          Back to {username}'s Profile
        </Link>
        
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-duolingo-purple mb-2">@{username}'s Answer</h1>
          <p className="text-gray-600">See what they had to say to this anonymous question.</p>
        </div>
        
        <QuestionCard
          question={question}
          showShareOptions={true}
          shareUrl={window.location.href}
          className="shadow-md"
        />
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Want to ask your own question?</p>
          <Link to={`/profile/${username}`}>
            <Button className="bg-duolingo-purple hover:bg-duolingo-purple/90">
              Ask @{username} Anonymously
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default QuestionView;
