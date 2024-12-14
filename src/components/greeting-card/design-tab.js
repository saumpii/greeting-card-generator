"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, Upload, X } from 'lucide-react';

const getPexelsBackground = async (occasion, page = 1) => {
  const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${occasion}+celebration&per_page=6&page=${page}&orientation=landscape`,
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
  const [currentPage, setCurrentPage] = useState(1);

  const loadBackgroundSuggestions = async (nextPage = false) => {
    if (!formData.occasion) return;
    
    setLoading(true);
    try {
      const newPage = nextPage ? currentPage + 1 : currentPage;
      const pexelsImages = await getPexelsBackground(formData.occasion, newPage);
      
      if (pexelsImages.length > 0) {
        setSuggestedBackgrounds(pexelsImages);
        setCurrentPage(newPage);
        
        if (!isCustomImage && !formData.uploadedImage) {
          onUpdate('uploadedImage', pexelsImages[0].url);
        }
      } else {
        if (nextPage) {
          setCurrentPage(1);
          const firstPageImages = await getPexelsBackground(formData.occasion, 1);
          setSuggestedBackgrounds(firstPageImages);
        }
      }
    } catch (error) {
      console.error('Error loading backgrounds:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isCustomImage) {
      setCurrentPage(1);
      loadBackgroundSuggestions();
    }
  }, [formData.occasion, isCustomImage]);

  const handleGenerateNew = async () => {
    await loadBackgroundSuggestions(true);
  };

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
                  className="w-full h-48 object-cover rounded-lg mb-2"
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
            <div className="flex justify-between items-center">
              <Label>Auto-generated Backgrounds for {formData.occasion}</Label>
              <Button
                onClick={handleGenerateNew}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                New Options
              </Button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                <p className="mt-2 text-sm text-gray-500">Loading suggestions...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {suggestedBackgrounds.map((bg, index) => (
                  <button
                    key={index}
                    onClick={() => onUpdate('uploadedImage', bg.url)}
                    className={`relative h-48 w-full rounded-lg overflow-hidden border-2 transition-all
                      ${formData.uploadedImage === bg.url 
                        ? 'border-blue-500 shadow-lg' 
                        : 'border-transparent hover:border-blue-300 hover:shadow-md'}`}
                  >
                    <img 
                      src={bg.url} 
                      alt={`Background option ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white px-2 py-1.5 text-sm">
                      Photo by: {bg.credit}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DesignTab;