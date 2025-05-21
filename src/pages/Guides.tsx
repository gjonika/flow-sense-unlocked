
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const Guides = () => {
  const guideCategories = [
    {
      title: 'Water Management',
      guides: [
        { title: 'Reducing Water Consumption', difficulty: 'Beginner' },
        { title: 'Water Recycling Systems', difficulty: 'Intermediate' },
        { title: 'Advanced Water Monitoring', difficulty: 'Advanced' },
      ]
    },
    {
      title: 'Energy Efficiency',
      guides: [
        { title: 'Basic Energy Saving Tips', difficulty: 'Beginner' },
        { title: 'Smart Energy Monitoring', difficulty: 'Intermediate' },
        { title: 'Building Energy Optimization', difficulty: 'Advanced' },
      ]
    },
    {
      title: 'Waste Reduction',
      guides: [
        { title: 'Starting a Recycling Program', difficulty: 'Beginner' },
        { title: 'Composting for Businesses', difficulty: 'Intermediate' },
        { title: 'Zero Waste Strategies', difficulty: 'Advanced' },
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-flowsense-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Utility Management Guides</h1>
          <p className="mt-4 text-xl text-flowsense-100">
            Comprehensive resources to help you optimize your utility usage and reduce costs.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {guideCategories.map((category, index) => (
            <div key={index} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.title}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {category.guides.map((guide, guideIndex) => (
                  <Card key={guideIndex} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{guide.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-flowsense-100 text-flowsense-800">
                          {guide.difficulty}
                        </span>
                        <Button variant="ghost" size="sm" className="text-flowsense-600 hover:text-flowsense-800">
                          Read <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Guides;
