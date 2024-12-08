"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentTab from './content-tab';
import DesignTab from './design-tab';
import PreviewTab from './preview-tab';

const GreetingCardGenerator = () => {

    
    const [formData, setFormData] = useState({
        relationship: '',
        occasion: '',
        additionalText: '',
        senderName: '',
        includeName: false,
        uploadedImage: null,
        template: 'modern',
        colorScheme: 'blue',
        format: 'landscape',
        isGeneric: false,
        recipientName: ''
      });

  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const generateMessage = async () => {
    if (!formData.occasion || !formData.relationship) {
      setError('Please select both occasion and relationship');
      return null;
    }
  
    // Add check for recipient name
    if (!formData.isGeneric && !formData.recipientName) {
      setError('Please enter recipient name or select generic message');
      return null;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch('/api/greeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: formData.occasion,
          relationship: formData.relationship,
          recipientName: formData.recipientName,
          additionalText: formData.additionalText,
          isGeneric: formData.isGeneric
        })
      });
  
      // Rest of your code...

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate message');
      }

      setCurrentMessage(data.message);
      return data.message;
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      return `Happy ${formData.occasion}! Wishing you all the best! 🎉`;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormUpdate = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInitialGeneration = async () => {
    if (!currentMessage && formData.occasion && formData.relationship) {
      await generateMessage();
    }
  };

  React.useEffect(() => {
    handleInitialGeneration();
  }, [formData.occasion, formData.relationship]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <ContentTab 
            formData={formData} 
            onUpdate={handleFormUpdate}
          />
        </TabsContent>

        <TabsContent value="design">
          <DesignTab 
            formData={formData} 
            onUpdate={handleFormUpdate}
            fileInputRef={fileInputRef}
          />
        </TabsContent>

        <TabsContent value="preview">
          <PreviewTab 
            formData={formData}
            currentMessage={currentMessage}
            isLoading={isLoading}
            onRegenerate={generateMessage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GreetingCardGenerator;