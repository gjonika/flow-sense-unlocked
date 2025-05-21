
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TestimonialCardProps {
  content: string;
  author: string;
  role: string;
  company: string;
}

const TestimonialCard = ({ content, author, role, company }: TestimonialCardProps) => {
  return (
    <Card className="h-full border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex-1">
          <div className="mt-2 text-gray-600 italic">"{content}"</div>
          <div className="mt-6">
            <div className="font-medium text-gray-900">{author}</div>
            <div className="text-sm text-gray-500">{role}, {company}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
