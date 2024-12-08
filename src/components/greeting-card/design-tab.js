"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const templates = {
  modern: "Modern",
  classic: "Classic",
  minimal: "Minimal",
  festive: "Festive",
  elegant: "Elegant"
};

const colorSchemes = {
  blue: "Blue",
  red: "Red",
  green: "Green",
  purple: "Purple",
  gold: "Gold"
};

const DesignTab = ({ formData, onUpdate, fileInputRef }) => {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label>Card Format</Label>
          <RadioGroup
            value={formData.format}
            onValueChange={(value) => onUpdate('format', value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="landscape" id="landscape" />
              <Label htmlFor="landscape">Landscape (Standard Card)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="portrait" id="portrait" />
              <Label htmlFor="portrait">Portrait (Instagram Story)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Template</Label>
          <Select 
            value={formData.template}
            onValueChange={(value) => onUpdate('template', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Template" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(templates).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Color Scheme</Label>
          <Select 
            value={formData.colorScheme}
            onValueChange={(value) => onUpdate('colorScheme', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Color Scheme" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(colorSchemes).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Background Image (Optional)</Label>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  onUpdate('uploadedImage', event.target?.result);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="mb-2"
          />
          {formData.uploadedImage && (
            <button
              className="w-full px-4 py-2 text-sm border rounded hover:bg-gray-100"
              onClick={() => {
                onUpdate('uploadedImage', null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              Remove Background Image
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignTab;