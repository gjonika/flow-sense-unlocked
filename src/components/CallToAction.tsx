
import React from 'react';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <div className="bg-gradient-to-r from-flowsense-700 to-utility-700 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to optimize your utility management?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-flowsense-100">
            Join thousands of businesses that are saving resources and money with FlowSense.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Button className="px-5 py-3 text-base font-medium bg-white text-flowsense-600 hover:bg-gray-50">
                Get Started
              </Button>
            </div>
            <div className="ml-3 inline-flex">
              <Button variant="outline" className="px-5 py-3 text-base font-medium bg-transparent border-2 border-white text-white hover:bg-white/10">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
