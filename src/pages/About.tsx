
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-flowsense-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">About FlowSense</h1>
            <p className="mt-4 text-xl text-flowsense-100 max-w-3xl mx-auto">
              We're on a mission to help businesses and individuals optimize their resource usage, 
              reduce waste, and save money through intelligent utility management.
            </p>
          </div>
        </div>
        
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">Our Story</h2>
                <p className="mt-4 text-lg text-gray-600">
                  FlowSense began in 2020 when a group of engineers and sustainability experts 
                  recognized a gap in the market for user-friendly utility management tools. 
                  Frustrated by complex systems that required specialized knowledge, we set out 
                  to create intuitive solutions that anyone could use to make smarter decisions 
                  about their resource consumption.
                </p>
                <p className="mt-4 text-lg text-gray-600">
                  Today, FlowSense serves thousands of clients across industries, from small businesses 
                  to large corporations, all working toward more efficient and sustainable operations.
                </p>
              </div>
              <div className="mt-10 lg:mt-0">
                <div className="bg-gradient-to-br from-flowsense-500 to-utility-500 rounded-lg aspect-w-16 aspect-h-9 overflow-hidden">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-white text-center p-8">
                      <div className="text-5xl font-bold mb-4">40%</div>
                      <div className="text-xl">Average utility savings for our customers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-md bg-flowsense-100 text-flowsense-600 flex items-center justify-center text-2xl font-bold mx-auto">1</div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Sustainability</h3>
                      <p className="mt-2 text-base text-gray-600">
                        We believe in creating a more sustainable future through responsible resource management.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-md bg-flowsense-100 text-flowsense-600 flex items-center justify-center text-2xl font-bold mx-auto">2</div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Innovation</h3>
                      <p className="mt-2 text-base text-gray-600">
                        We continuously seek new ways to solve resource management challenges through technology.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-md bg-flowsense-100 text-flowsense-600 flex items-center justify-center text-2xl font-bold mx-auto">3</div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Accessibility</h3>
                      <p className="mt-2 text-base text-gray-600">
                        We make complex utility management simple and accessible to everyone, regardless of technical expertise.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">Join Our Team</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                We're always looking for passionate individuals who want to make a difference in how 
                the world uses resources. Check out our open positions!
              </p>
              <div className="mt-8">
                <Button className="bg-flowsense-600 hover:bg-flowsense-700">
                  View Careers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
