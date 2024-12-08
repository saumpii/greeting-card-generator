"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const relationships = [
  'Close Friend',
  'Friend',
  'Parent',
  'Sibling',
  'Child',
  'Partner'
];

const occasions = [
  'Birthday',
  'Wedding',
  'Graduation',
  'New Job'
];

const ContentTab = ({ formData, onUpdate, onGenerate }) => {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
        <div className="flex items-center space-x-2">
            <Checkbox
              id="useGenericMessage"
              checked={formData.isGeneric}
              onCheckedChange={(checked) => {
                onUpdate('isGeneric', checked);
                if (checked) {
                  onUpdate('recipientName', '');
                }
              }}
            />
            <Label htmlFor="useGenericMessage">Keep message generic</Label>
          </div>
          
          {!formData.isGeneric && (
            <div className="space-y-2 mt-2">
              <Label>Recipient's Name</Label>
              <Input
                value={formData.recipientName}
                onChange={(e) => onUpdate('recipientName', e.target.value)}
                placeholder="Enter recipient's name"
              />
            </div>
          )}
          <Label>Relationship</Label>
          <Select 
            value={formData.relationship}
            onValueChange={(value) => onUpdate('relationship', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Relationship" />
            </SelectTrigger>
            <SelectContent>
              {relationships.map(rel => (
                <SelectItem key={rel} value={rel}>{rel}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Occasion</Label>
          <Select
            value={formData.occasion}
            onValueChange={(value) => onUpdate('occasion', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Occasion" />
            </SelectTrigger>
            <SelectContent>
              {occasions.map(occ => (
                <SelectItem key={occ} value={occ}>{occ}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium text-sm text-gray-700">Message Context</h3>
          
          <div className="space-y-2">
            <Label>Special Memories/Moments</Label>
            <Textarea
              value={formData.memories}
              onChange={(e) => onUpdate('memories', e.target.value)}
              placeholder="Share some special memories or moments you'd like to reference in the message..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Future Wishes/Plans</Label>
            <Textarea
              value={formData.futureWishes}
              onChange={(e) => onUpdate('futureWishes', e.target.value)}
              placeholder="Any specific wishes or future plans you'd like to mention..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Additional Note (Will appear as separate line)</Label>
            <Textarea
              value={formData.additionalNote}
              onChange={(e) => onUpdate('additionalNote', e.target.value)}
              placeholder="This will appear as a separate line at the bottom of the message..."
              className="min-h-[80px]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Additional Message (Optional)</Label>
          <Textarea
            value={formData.additionalText}
            onChange={(e) => onUpdate('additionalText', e.target.value)}
            placeholder="Add your personal message..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeName"
            checked={formData.includeName}
            onCheckedChange={(checked) => onUpdate('includeName', checked)}
          />
          <Label htmlFor="includeName">Include sender's name</Label>
        </div>

        {formData.includeName && (
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input
              value={formData.senderName}
              onChange={(e) => onUpdate('senderName', e.target.value)}
              placeholder="Enter your name"
            />
          </div>
        )}


      </CardContent>
    </Card>
  );
};

export default ContentTab;