
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ProfileShareLinkProps {
  username: string;
}

const ProfileShareLink: React.FC<ProfileShareLinkProps> = ({ username }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Create the direct ask link
  const askLink = `${window.location.origin}/profile/${username}?ask=true`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(askLink)
      .then(() => {
        setCopied(true);
        toast({
          title: "Link copied",
          description: "Ask me link copied to clipboard!",
        });
        
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy link to clipboard",
        });
      });
  };

  return (
    <Card className="border-2 border-askedout-light-olive">
      <div className="h-2 bg-gradient-to-r from-askedout-olive to-askedout-light-olive" />
      
      <CardHeader>
        <CardTitle className="text-xl text-center">Share Your "Ask Me" Link</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex space-x-2">
          <Input 
            readOnly
            value={askLink}
            onClick={(e) => (e.target as HTMLInputElement).select()}
            className="bg-gray-50"
          />
          
          <Button 
            onClick={handleCopy} 
            variant="outline" 
            size="icon"
            className="flex-shrink-0"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          Share this link so people can ask you anonymous questions directly
        </p>
      </CardContent>
    </Card>
  );
};

export default ProfileShareLink;
