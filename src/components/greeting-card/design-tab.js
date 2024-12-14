"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, Upload, X } from 'lucide-react';

const getPexelsBackground = async (occasion) => {
  const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${occasion}+celebration&per_page=4&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      }
    );
    const data = await response.json();
    return data.photos.map(photo => ({
      type: 'photo',
      url: photo.src.large,
      credit: photo.photographer
    }));
  } catch (error) {
    console.error('Error fetching Pexels images:', error);
    return [];
  }
};

const DesignTab = ({ formData, onUpdate }) => {
  const [suggestedBackgrounds, setSuggestedBackgrounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCustomImage, setIsCustomImage] = useState(false);

  const loadBackgroundSuggestions = async () => {
    if (!formData.occasion) return;
    
    setLoading(true);
    try {
      const pexelsImages = await getPexelsBackground(formData.occasion);
      setSuggestedBackgrounds(pexelsImages);
      
      // If no custom image is uploaded, use the first suggested background
      if (!isCustomImage && pexelsImages.length > 0) {
        onUpdate('uploadedImage', pexelsImages[0].url);
      }
    } catch (error) {
      console.error('Error loading backgrounds:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isCustomImage) {
      loadBackgroundSuggestions();
    }
  }, [formData.occasion, isCustomImage]);

  const handleImageUpload = (event) => {
    const file = event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setIsCustomImage(true);
        onUpdate('uploadedImage', e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCustomImage = () => {
    setIsCustomImage(false);
    onUpdate('uploadedImage', suggestedBackgrounds[0]?.url || null);
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label>Upload Custom Background</Label>
          <div className="border-2 border-dashed rounded-lg p-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-2"
            />
            {isCustomImage && formData.uploadedImage && (
              <div className="mt-2">
                <img 
                  src={formData.uploadedImage} 
                  alt="Custom background" 
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <Button 
                  variant="destructive" 
                  onClick={removeCustomImage}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove Custom Image
                </Button>
              </div>
            )}
          </div>
        </div>

        {!isCustomImage && (
          <div className="space-y-2">
            <Label>Auto-generated Backgrounds for {formData.occasion}</Label>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                <p className="mt-2 text-sm text-gray-500">Loading suggestions...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {suggestedBackgrounds.map((bg, index) => (
                    <button
                      key={index}
                      onClick={() => onUpdate('uploadedImage', bg.url)}
                      className={`relative h-32 w-full rounded-lg overflow-hidden border-2 transition-all
                        ${formData.uploadedImage === bg.url ? 'border-blue-500' : 'border-transparent hover:border-blue-300'}`}
                    >
                      <img 
                        src={bg.url} 
                        alt={`Background option ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
                        Photo by: {bg.credit}
                      </div>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={loadBackgroundSuggestions}
                  variant="outline"
                  className="w-full mt-4"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Generate New Options
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DesignTab;