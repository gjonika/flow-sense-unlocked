
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <div className="pt-16 sm:pt-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Optimize your</span>
                  <span className="block text-flowsense-600">utility management</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Comprehensive guides and tools to help you manage resources efficiently, save costs, and reduce environmental impact.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-start">
                  <div className="rounded-md shadow">
                    <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md bg-flowsense-600 hover:bg-flowsense-700 md:py-4 md:text-lg md:px-10">
                      Get Started
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md border-2 border-flowsense-600 text-flowsense-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full bg-gradient-to-br from-flowsense-500 to-utility-500 sm:h-72 lg:h-full rounded-bl-3xl lg:rounded-none">
          <div className="h-full w-full flex items-center justify-center">
            <div className="relative w-32 h-32 sm:w-48 sm:h-48">
              <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full bg-white/50"></div>
              <div className="absolute inset-4 rounded-full bg-white/70"></div>
              <div className="absolute inset-6 rounded-full bg-white/90 flex items-center justify-center">
                <div className="w-12 h-1 bg-flowsense-600 animate-flow"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
