import React from 'react';

const HeroSection = () => {
  return (
    <div className="text-center mb-16 z-10">
      <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-wide">
        ฝึกพิมพ์สัมผัส <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-200">E & T</span>
      </h1>
      <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
        โหมดฝึกฝนเพื่อพัฒนาทักษะ หรือเลื่อนไปทางขวาเพื่อทดสอบความเร็ว
      </p>
    </div>
  );
};

export default HeroSection;