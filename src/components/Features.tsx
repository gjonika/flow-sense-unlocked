
import React from 'react';
import FeatureCard from './FeatureCard';
import { BarChart, Smartphone, Settings, Info } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: 'Resource Analytics',
      description: 'Track and analyze your utility consumption patterns with detailed visual reports.',
      icon: BarChart
    },
    {
      title: 'Mobile Monitoring',
      description: 'Access your utility data anywhere, anytime with our responsive mobile interface.',
      icon: Smartphone
    },
    {
      title: 'Optimization Tools',
      description: 'Get recommendations for improving efficiency and reducing waste in your systems.',
      icon: Settings
    },
    {
      title: 'Educational Resources',
      description: 'Learn best practices and industry standards for utility management.',
      icon: Info
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Features
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Discover how FlowSense can help you manage your utilities more efficiently
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
