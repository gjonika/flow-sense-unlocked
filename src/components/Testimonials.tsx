
import React from 'react';
import TestimonialCard from './TestimonialCard';

const Testimonials = () => {
  const testimonials = [
    {
      content: "FlowSense helped us reduce our water consumption by 30% in the first month. The detailed analytics made it easy to identify waste areas.",
      author: "Alex Johnson",
      role: "Facility Manager",
      company: "GreenTech Solutions"
    },
    {
      content: "The utility guides provided clear steps for optimizing our energy usage. We've already seen a significant reduction in our monthly bills.",
      author: "Maria Rodriguez",
      role: "Sustainability Director",
      company: "Echo Industries"
    },
    {
      content: "As a property manager, I need to monitor utilities across multiple buildings. FlowSense makes this process seamless and efficient.",
      author: "David Chen",
      role: "Property Manager",
      company: "Urban Living Properties"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Don't take our word for it - hear from the people using FlowSense to transform their utility management.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
