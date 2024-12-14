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

const occasionsData = {
  "Religious Festivals": [
    { value: 'diwali', label: 'Diwali - Festival of Lights' },
    { value: 'holi', label: 'Holi - Festival of Colors' },
    { value: 'raksha-bandhan', label: 'Raksha Bandhan' },
    { value: 'ganesh-chaturthi', label: 'Ganesh Chaturthi' },
    { value: 'navratri', label: 'Navratri' },
    { value: 'dussehra', label: 'Dussehra' },
    { value: 'janmashtami', label: 'Krishna Janmashtami' },
    { value: 'maha-shivratri', label: 'Maha Shivratri' },
    { value: 'ram-navami', label: 'Ram Navami' },
    { value: 'guru-purnima', label: 'Guru Purnima' },
    { value: 'karwa-chauth', label: 'Karwa Chauth' },
    { value: 'bhai-dooj', label: 'Bhai Dooj' },
    { value: 'eid', label: 'Eid' },
    { value: 'christmas', label: 'Christmas' },
    { value: 'easter', label: 'Easter' },
    { value: 'guru-nanak-jayanti', label: 'Guru Nanak Jayanti' }
  ],
  "Regional Festivals": [
    { value: 'pongal', label: 'Pongal' },
    { value: 'onam', label: 'Onam' },
    { value: 'bihu', label: 'Bihu' },
    { value: 'baisakhi', label: 'Baisakhi' },
    { value: 'durga-puja', label: 'Durga Puja' },
    { value: 'gudi-padwa', label: 'Gudi Padwa' },
    { value: 'lohri', label: 'Lohri' },
    { value: 'makar-sankranti', label: 'Makar Sankranti' },
    { value: 'chhath-puja', label: 'Chhath Puja' },
    { value: 'ugadi', label: 'Ugadi' },
    { value: 'vishu', label: 'Vishu' },
    { value: 'gangaur', label: 'Gangaur' }
  ],
  "Personal Celebrations": [
    { value: 'birthday', label: 'Birthday' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'baby-shower', label: 'Baby Shower' },
    { value: 'house-warming', label: 'House Warming' },
    { value: 'graduation', label: 'Graduation' },
    { value: 'retirement', label: 'Retirement' }
  ],
  "Professional Milestones": [
    { value: 'new-job', label: 'New Job' },
    { value: 'promotion', label: 'Promotion' },
    { value: 'work-anniversary', label: 'Work Anniversary' },
    { value: 'business-launch', label: 'Business Launch' }
  ],
  "Other Occasions": [
    { value: 'thank-you', label: 'Thank You' },
    { value: 'congratulations', label: 'Congratulations' },
    { value: 'get-well-soon', label: 'Get Well Soon' },
    { value: 'farewell', label: 'Farewell' },
    { value: 'welcome', label: 'Welcome' },
    { value: 'missing-you', label: 'Missing You' }
  ]
};

const occasions = Object.values(occasionsData).flat();

const ContentTab = ({ formData, onUpdate }) => {
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
              <Label>Recipient&apos;s Name</Label>
              <Input
                value={formData.recipientName}
                onChange={(e) => onUpdate('recipientName', e.target.value)}
                placeholder="Enter recipient&apos;s name"
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
                <SelectItem key={occ.value} value={occ.value}>{occ.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium text-sm text-gray-700">Message Context</h3>
          
          <div className="space-y-2">
            <Label>Some additional input/context for personalized message</Label>
            <Textarea
              value={formData.memories}
              onChange={(e) => onUpdate('memories', e.target.value)}
              placeholder="Share some special memories or moments you&apos;d like to reference..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Additional Note (Will appear as separate line)</Label>
            <Textarea
              value={formData.additionalNote}
              onChange={(e) => onUpdate('additionalNote', e.target.value)}
              placeholder="Any specific wishes or plans you&apos;d like to mention..."
              className="min-h-[80px]"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeName"
            checked={formData.includeName}
            onCheckedChange={(checked) => onUpdate('includeName', checked)}
          />
          <Label htmlFor="includeName">Include sender&apos;s name</Label>
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