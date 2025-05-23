
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface QuestionFormProps {
  username: string;
  onSubmit: (question: string) => Promise<void>;
  id?: string;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ username, onSubmit, id }) => {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Question cannot be empty",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(question);
      setQuestion('');
      
      toast({
        title: "Question submitted",
        description: "Your anonymous question has been sent!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit question. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card id={id} className="border-2 border-askedout-light-olive">
      <div className="h-2 bg-gradient-to-r from-askedout-olive to-askedout-light-olive" />
      
      <CardHeader>
        <CardTitle className="text-xl text-center">Ask @{username} Anonymously</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Type your anonymous question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[100px]"
          />
          
          <Button 
            type="submit" 
            className="w-full bg-askedout-olive hover:bg-askedout-olive/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Anonymous Question'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuestionForm;
