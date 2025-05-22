
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api, Question } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import QuestionCard from '@/components/QuestionCard';
import ProfileShareCard from '@/components/ProfileShareCard';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { isAuthenticated, username } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchQuestions();
  }, [isAuthenticated, navigate]);
  
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const fetchedQuestions = await api.getQuestions();
      setQuestions(fetchedQuestions);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load questions",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnswerQuestion = async (questionId: string, answer: string) => {
    try {
      const result = await api.answerQuestion(questionId, answer);
      
      if (result.success) {
        // Refresh questions after answering
        fetchQuestions();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to submit answer",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  };
  
  const profileUrl = window.location.origin + `/profile/${username}`;
  
  const answeredQuestions = questions.filter(q => q.answer);
  const unansweredQuestions = questions.filter(q => !q.answer);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-duolingo-purple mb-2">Welcome, {username}!</h1>
          <p className="text-gray-600">Manage your questions and profile</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-2 border-duolingo-light-purple">
              <div className="h-2 bg-gradient-to-r from-duolingo-purple to-duolingo-light-purple" />
              
              <CardHeader>
                <CardTitle>
                  Unanswered Questions{' '}
                  <span className="inline-flex items-center justify-center bg-duolingo-purple text-white rounded-full h-6 w-6 text-sm">
                    {unansweredQuestions.length}
                  </span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {loading ? (
                  <p className="text-center py-4">Loading questions...</p>
                ) : (
                  <>
                    {unansweredQuestions.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No unanswered questions yet.</p>
                        <p className="text-gray-500 mt-1">Share your profile to get questions!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {unansweredQuestions.map(question => (
                          <QuestionCard
                            key={question.id}
                            question={question}
                            onAnswer={(answer) => handleAnswerQuestion(question.id, answer)}
                            showShareOptions={true}
                            shareUrl={`${profileUrl}/question/${question.id}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
            
            {answeredQuestions.length > 0 && (
              <Card className="border-2 border-duolingo-light-purple">
                <div className="h-2 bg-gradient-to-r from-duolingo-purple to-duolingo-light-purple" />
                
                <CardHeader>
                  <CardTitle>
                    Answered Questions{' '}
                    <span className="inline-flex items-center justify-center bg-duolingo-green text-white rounded-full h-6 w-6 text-sm">
                      {answeredQuestions.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {answeredQuestions.map(question => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        showShareOptions={true}
                        shareUrl={`${profileUrl}/question/${question.id}`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            <ProfileShareCard 
              username={username || ''} 
              profileUrl={profileUrl}
            />
            
            <Card className="border-2 border-duolingo-light-purple">
              <div className="h-2 bg-gradient-to-r from-duolingo-purple to-duolingo-light-purple" />
              
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-duolingo-soft-purple">
                    <p className="text-2xl font-bold text-duolingo-purple">{questions.length}</p>
                    <p className="text-sm text-gray-600">Total Questions</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-duolingo-soft-purple">
                    <p className="text-2xl font-bold text-duolingo-purple">
                      {answeredQuestions.length}
                    </p>
                    <p className="text-sm text-gray-600">Answers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
