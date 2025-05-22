
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { Facebook, Twitter, MessageCircle, LinkIcon } from 'lucide-react';

interface ProfileShareCardProps {
  username: string;
  profileUrl: string;
}

const ProfileShareCard: React.FC<ProfileShareCardProps> = ({ username, profileUrl }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy text: ', err));
  };

  return (
    <Card className="border-2 border-duolingo-light-purple text-center">
      <div className="h-2 bg-gradient-to-r from-duolingo-purple to-duolingo-light-purple" />
      
      <CardHeader>
        <CardTitle className="text-xl">Share Your Profile</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Share your profile link to receive anonymous questions!
        </p>
        
        <div className="flex space-x-2">
          <Input 
            value={profileUrl} 
            readOnly 
            className="bg-muted"
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleCopyLink}
            className={copied ? "bg-green-100 text-green-800 border-green-300" : ""}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-center space-x-4 pt-2">
          <FacebookShareButton 
            url={profileUrl} 
            quote={`Ask me anything anonymously on AskMe!`}
          >
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 text-blue-600 hover:text-blue-700">
              <Facebook className="h-5 w-5" />
            </Button>
          </FacebookShareButton>
          
          <TwitterShareButton 
            url={profileUrl} 
            title={`Ask me anything anonymously on AskMe!`}
          >
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 text-sky-500 hover:text-sky-600">
              <Twitter className="h-5 w-5" />
            </Button>
          </TwitterShareButton>
          
          <WhatsappShareButton 
            url={profileUrl} 
            title={`Ask me anything anonymously on AskMe!`}
          >
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 text-green-500 hover:text-green-600">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </WhatsappShareButton>
        </div>
        
        {copied && (
          <p className="text-sm text-green-600">Link copied to clipboard!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileShareCard;
