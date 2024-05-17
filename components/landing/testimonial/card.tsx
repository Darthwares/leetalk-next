import { testimonials } from "@/constants/default";
import React from "react";

const Testimonials: React.FC = () => {
  return (
    <div className="bg-white text-gray-800 md:py-20 py-12">
      <h2 className="text-center text-3xl font-bold mb-8 py-4 sm:text-4xl">
        Discover why users <span className="text-gray-600">love LeetTalk</span>
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-gray-800 text-white p-6 rounded-lg text-center shadow-lg py-12"
          >
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover"
            />
            <p className="text-lg font-semibold mb-2">{`"${testimonial.quote}"`}</p>
            <p className="text-sm text-gray-50 mb-4">{`"${testimonial.feedback}"`}</p>
            <p className="text-base font-bold text-gray-50">
              {testimonial.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
