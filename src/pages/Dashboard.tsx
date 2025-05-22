
import React, { useEffect, useState } from 'react';
import { api, Question } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import QuestionCard from '@/components/QuestionCard';
import ProfileShareLink from '@/components/ProfileShareLink';
import { useToast } from '@/components/ui/use-toast';
import { Clipboard } from 'lucide-react';

const Dashboard = () => {
  const { username } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchQuestions();
  }, []);
  
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
        await fetchQuestions(); // Refresh the questions list
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
      throw error;
    }
  };

  const unansweredQuestions = questions.filter(q => !q.answer);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <p>Loading your questions...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Card className="border-none shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Clipboard className="h-6 w-6 text-askedout-olive" />
                <span>Your Questions</span>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Unanswered Questions Section - Full Width */}
        <div className="w-full mb-8">
          <Card className="border-none shadow-none mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Unanswered Questions</CardTitle>
            </CardHeader>
          </Card>
          
          {unansweredQuestions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">You don't have any unanswered questions yet.</p>
                <p className="text-gray-500 mt-1">Share your profile to get questions!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {unansweredQuestions.map(question => (
                <QuestionCard 
                  key={question.id}
                  question={question}
                  onAnswer={(answer) => handleAnswerQuestion(question.id, answer)}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Share Your Profile Section - Full Width */}
        <div className="w-full mb-8">
          {username && <ProfileShareLink username={username} />}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
