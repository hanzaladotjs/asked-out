
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { api, Question, User } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import QuestionForm from '@/components/QuestionForm';
import QuestionCard from '@/components/QuestionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();
  const isAskMode = location.search.includes('ask=true');
  
  useEffect(() => {
    fetchUserProfile();
  }, [username]);
  
  const fetchUserProfile = async () => {
    if (!username) return;
    
    setLoading(true);
    try {
      const fetchedUser = await api.getUserByUsername(username);
      
      if (fetchedUser) {
        setUser(fetchedUser);
        // If we want to show answered questions in the public profile:
        const userQuestions = await api.getQuestions();
        const answeredQuestions = userQuestions.filter(q => q.answer);
        setQuestions(answeredQuestions);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmitQuestion = async (content: string) => {
    if (!username) return;
    
    try {
      const result = await api.submitAnonymousQuestion(username, content);
      
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to submit question",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <h1 className="text-3xl font-bold mb-4 text-askedout-olive">User not found</h1>
          <p className="text-gray-600">The username '{username}' doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  // If ask mode is active, scroll to the question form
  useEffect(() => {
    if (isAskMode) {
      const questionFormElement = document.getElementById('question-form');
      if (questionFormElement) {
        setTimeout(() => {
          questionFormElement.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
  }, [isAskMode, loading]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-askedout-olive rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-askedout-olive">@{user.username}</h1>
        </div>
        
        <div className="space-y-8">
          <QuestionForm 
            id="question-form"
            username={user.username} 
            onSubmit={handleSubmitQuestion} 
          />
          
          <Tabs defaultValue="answered" className="w-full">
            <TabsList className="grid w-full grid-cols-1 bg-askedout-soft-olive">
              <TabsTrigger value="answered" className="text-center data-[state=active]:bg-askedout-light-olive data-[state=active]:text-white">
                Answered Questions ({questions.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="answered" className="mt-4">
              {questions.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500">No questions answered yet.</p>
                    <p className="text-gray-500 mt-1">Be the first to ask!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {questions.map(question => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      showShareOptions={true}
                      shareUrl={`${window.location.origin}/profile/${username}/question/${question.id}`}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
