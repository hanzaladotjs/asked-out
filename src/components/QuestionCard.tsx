
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  FacebookShareButton, TwitterShareButton, WhatsappShareButton,
  FacebookIcon, TwitterIcon, WhatsappIcon 
} from 'react-share';
import { Question } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface QuestionCardProps {
  question: Question;
  onAnswer?: (answer: string) => Promise<void>;
  showShareOptions?: boolean;
  className?: string;
  shareUrl?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onAnswer,
  showShareOptions = false,
  className = '',
  shareUrl 
}) => {
  const [answer, setAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Answer cannot be empty",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onAnswer) {
        await onAnswer(answer);
        setIsAnswering(false);
        setAnswer('');
        
        toast({
          title: "Answer submitted",
          description: "Your answer has been posted successfully!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit answer. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className={`overflow-hidden border-2 border-askedout-light-olive ${className}`}>
      <div className="h-2 bg-gradient-to-r from-askedout-olive to-askedout-light-olive" />
      
      <CardHeader className="pb-2">
        <p className="text-sm text-muted-foreground">
          Asked on {formattedDate(question.createdAt)}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-askedout-soft-olive">
          <p className="font-medium">{question.content}</p>
        </div>
        
        {question.answer && (
          <div>
            <p className="text-sm font-semibold text-askedout-olive mb-2">Answer:</p>
            <div className="p-4 rounded-lg bg-gray-50">
              <p>{question.answer}</p>
              {question.answeredAt && (
                <p className="text-xs text-muted-foreground mt-2">
                  Answered on {formattedDate(question.answeredAt)}
                </p>
              )}
            </div>
          </div>
        )}
        
        {!question.answer && onAnswer && !isAnswering && (
          <Button 
            onClick={() => setIsAnswering(true)}
            className="bg-askedout-olive hover:bg-askedout-olive/90"
          >
            Answer this question
          </Button>
        )}
        
        {!question.answer && onAnswer && isAnswering && (
          <div className="space-y-4">
            <Textarea
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[100px]"
            />
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleSubmitAnswer}
                disabled={isSubmitting}
                className="bg-askedout-olive hover:bg-askedout-olive/90"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAnswering(false);
                  setAnswer('');
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      {showShareOptions && shareUrl && (
        <CardFooter className="border-t pt-4 flex justify-center space-x-4">
          <FacebookShareButton url={shareUrl} quote={`Check out this question: ${question.content}`}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          
          <TwitterShareButton url={shareUrl} title={`Check out this question: ${question.content}`}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          
          <WhatsappShareButton url={shareUrl} title={`Check out this question: ${question.content}`}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </CardFooter>
      )}
    </Card>
  );
};

export default QuestionCard;
