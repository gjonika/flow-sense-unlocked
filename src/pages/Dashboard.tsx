
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  // Mock data for the dashboard
  const utilityData = {
    water: [42, 45, 39, 47, 35, 38, 41],
    electricity: [67, 72, 58, 63, 55, 61, 69],
    gas: [22, 25, 19, 21, 23, 20, 24]
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Utility Dashboard</h1>
              <p className="text-gray-500 mt-1">Monitor and analyze your utility consumption</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Tabs defaultValue="daily" className="w-[250px]">
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Water Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-flowsense-600">423 Gallons</div>
                <p className="text-sm text-green-500 flex items-center">-12% from last week</p>
                <div className="mt-4 h-16 flex items-end">
                  {utilityData.water.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-5 bg-flowsense-500" 
                        style={{ height: `${value}%`, maxHeight: '100%' }}
                      ></div>
                      <div className="text-xs mt-1 text-gray-500">{days[index]}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Electricity Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-utility-600">892 kWh</div>
                <p className="text-sm text-red-500 flex items-center">+8% from last week</p>
                <div className="mt-4 h-16 flex items-end">
                  {utilityData.electricity.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-5 bg-utility-500" 
                        style={{ height: `${value}%`, maxHeight: '100%' }}
                      ></div>
                      <div className="text-xs mt-1 text-gray-500">{days[index]}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Gas Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">156 Therms</div>
                <p className="text-sm text-green-500 flex items-center">-5% from last week</p>
                <div className="mt-4 h-16 flex items-end">
                  {utilityData.gas.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-5 bg-amber-500" 
                        style={{ height: `${value}%`, maxHeight: '100%' }}
                      ></div>
                      <div className="text-xs mt-1 text-gray-500">{days[index]}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Consumption Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md border border-green-100">
                  <h3 className="font-medium text-green-800">Water Savings Opportunity</h3>
                  <p className="text-green-700 mt-1">Detected unusual water usage between 2-4 AM. Possible leak detected.</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                  <h3 className="font-medium text-amber-800">Energy Usage Alert</h3>
                  <p className="text-amber-700 mt-1">HVAC systems running at high capacity during non-business hours.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h3 className="font-medium text-blue-800">Recommendation</h3>
                  <p className="text-blue-700 mt-1">Implementing scheduled lighting controls could save up to 15% on your electricity bill.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
