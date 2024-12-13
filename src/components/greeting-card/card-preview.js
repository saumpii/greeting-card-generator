"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, RefreshCw, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ContentTab from './content-tab';
import DesignTab from './design-tab';

const cardDimensions = {
  landscape: {
    width: 'w-[480px]',
    height: 'h-[360px]',
    textSize: 'text-base',
    padding: 'p-8'
  },
  portrait: {
    width: 'w-[360px]',
    height: 'h-[640px]',
    textSize: 'text-lg',
    padding: 'p-10'
  }
};

const getStyledHeading = (occasion) => {
  const occasionStyles = {
    Birthday: {
      text: "Happy Birthday!",
      className: "text-purple-600 font-extrabold text-4xl tracking-wide mb-6"
    },
    "New Job": {
      text: "Congratulations!",
      className: "text-emerald-600 font-extrabold text-4xl tracking-wide mb-6"
    },
    Wedding: {
      text: "Happy Wedding Day!",
      className: "text-rose-600 font-extrabold text-4xl tracking-wide mb-6"
    },
    Graduation: {
      text: "Congratulations Graduate!",
      className: "text-blue-600 font-extrabold text-4xl tracking-wide mb-6"
    }
  };

  return occasionStyles[occasion] || {
    text: occasion,
    className: "text-gray-800 font-extrabold text-4xl tracking-wide mb-6"
  };
};

const GreetingCardGenerator = () => {
  const [formData, setFormData] = useState({
    relationship: '',
    occasion: '',
    recipientName: '',
    isGeneric: false,
    memories: '',
    additionalNote: '',
    senderName: '',
    includeName: false,
    uploadedImage: null,
    template: 'modern',
    colorScheme: 'blue',
    format: 'landscape'
  });

  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef(null);

  const generateMessage = async () => {
    if (!formData.occasion || !formData.relationship) {
      return null;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/greeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          occasion: formData.occasion,
          relationship: formData.relationship,
          recipientName: formData.recipientName,
          isGeneric: formData.isGeneric,
          context: {
            memories: formData.memories,
            additionalNote: formData.additionalNote
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate message');
      }

      const data = await response.json();
      setCurrentMessage(data.message);
      return data.message;
    } catch (error) {
      console.error('Error:', error);
      return `Happy ${formData.occasion}! Wishing you all the best! 🎉`;
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const generateInitialMessage = async () => {
      if (!currentMessage && formData.occasion && formData.relationship) {
        await generateMessage();
      }
    };
    
    generateInitialMessage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.occasion, formData.relationship]);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const scale = 2;
      const canvas = await html2canvas(cardRef.current, {
        scale: scale,
        useCORS: true,
        logging: false,
        backgroundColor: null,
        windowWidth: cardRef.current.offsetWidth * scale,
        windowHeight: cardRef.current.offsetHeight * scale
      });

      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `${formData.occasion}-card-${timestamp}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download card. Please try again.');
    }
  };

  const handleFormUpdate = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <ContentTab formData={formData} onUpdate={handleFormUpdate} />
        </TabsContent>

        <TabsContent value="design">
          <DesignTab formData={formData} onUpdate={handleFormUpdate} fileInputRef={cardRef} />
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={generateMessage}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? 'Generating...' : 'New Message'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownload}
                    disabled={!currentMessage}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Card
                  </Button>
                </div>
              </div>

              <div className="flex justify-center items-center min-h-[600px] bg-gray-50 rounded-lg p-4">
                {currentMessage ? (
                  <div 
                    ref={cardRef}
                    className={`relative 
                      ${cardDimensions[formData.format].width}
                      ${cardDimensions[formData.format].height}
                      ${formData.template} 
                      rounded-lg shadow-lg overflow-hidden`}
                  >
                    {formData.uploadedImage && (
                      <div 
                        className="absolute inset-0 w-full h-full"
                        style={{
                          backgroundImage: `url(${formData.uploadedImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          opacity: 0.3
                        }}
                      />
                    )}
                    <div className={`relative h-full flex flex-col justify-between ${cardDimensions[formData.format].padding}`}>
                      <div className="text-center">
                        <h2 className={getStyledHeading(formData.occasion).className}>
                          {getStyledHeading(formData.occasion).text}
                        </h2>
                        <p className={`${cardDimensions[formData.format].textSize} mb-6 leading-relaxed`}>
                          {currentMessage}
                        </p>
                        {formData.additionalNote && (
                          <p className="text-sm italic mt-4 border-t pt-4">
                            {formData.additionalNote}
                          </p>
                        )}
                      </div>
                      {formData.includeName && formData.senderName && (
                        <div className="text-right">
                          <p className="font-medium">From: {formData.senderName}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    Fill in the content to generate your card
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GreetingCardGenerator;