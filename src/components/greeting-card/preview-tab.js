"use client";

import React, { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, RefreshCw, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

const cardDimensions = {
    landscape: {
      width: 'w-[480px]',
      height: 'h-[360px]',
      textSize: 'text-lg',
      padding: 'p-8',
      messageLength: 200  // Maximum characters for landscape
    },
    portrait: {
      width: 'w-[360px]',
      height: 'h-[640px]',
      textSize: 'text-xl',
      padding: 'p-10',
      messageLength: 300  // Maximum characters for portrait
    }
  };

const getStyledHeading = (occasion) => {
  const occasionStyles = {
    Birthday: {
      text: "Happy Birthday!",
      className: "text-purple-600 font-extrabold text-4xl tracking-wide mb-6"
    },
    Wedding: {
      text: "Happy Wedding Day!",
      className: "text-emerald-600 font-extrabold text-4xl tracking-wide mb-6"
    },
    Graduation: {
      text: "Congratulations Graduate!",
      className: "bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent font-extrabold text-4xl tracking-wide"
    },
    Anniversary: {
      text: "Happy Anniversary!",
      className: "bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent font-extrabold text-4xl tracking-wide"
    },
    "New Job": {
      text: "Congratulations!",
      className: "bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent font-extrabold text-4xl tracking-wide"
    },
    "Get Well Soon": {
      text: "Get Well Soon!",
      className: "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-extrabold text-4xl tracking-wide"
    }
  };

  return occasionStyles[occasion] || {
    text: occasion,
    className: "text-gray-800 font-extrabold text-4xl tracking-wide mb-6"
  };
};

const PreviewTab = ({ formData, currentMessage, isLoading, onRegenerate }) => {
  const cardRef = useRef(null);
  const heading = getStyledHeading(formData.occasion);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      // Show loading state while generating image
      const tempButton = document.createElement('button');
      tempButton.innerHTML = 'Generating image...';
      
      const scale = 2; // Increase for better quality
      const canvas = await html2canvas(cardRef.current, {
        scale: scale,
        useCORS: true,
        logging: false,
        backgroundColor: null,
        windowWidth: cardRef.current.offsetWidth * scale,
        windowHeight: cardRef.current.offsetHeight * scale,
        onclone: (clonedDoc) => {
          // Fix gradient text rendering in the downloaded image
          const gradientTexts = clonedDoc.querySelectorAll('.bg-gradient-to-r');
          gradientTexts.forEach(text => {
            text.style.webkitBackgroundClip = 'text';
            text.style.backgroundClip = 'text';
          });
        }
      });

      // Create download link
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

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRegenerate}
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
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
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
                  <h2 className={`mb-8 ${heading.className}`}>
                    {heading.text}
                  </h2>
                  <div className={`${cardDimensions[formData.format].textSize} mb-6 leading-relaxed space-y-4`}>
                    <p>{currentMessage}</p>
                    {formData.additionalNote && (
                      <p className="text-sm italic mt-4 border-t pt-4">
                        {formData.additionalNote}
                      </p>
                    )}
                  </div>
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
  );
};

export default PreviewTab;