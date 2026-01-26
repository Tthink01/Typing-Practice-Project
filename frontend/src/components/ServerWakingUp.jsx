import React from 'react';
import { Loader2, Server } from 'lucide-react'; // อย่าลืมลง lucide-react หรือใช้ icon อื่น

const ServerWakingUp = () => {
  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-in">
      <div className="bg-stone-800 border border-orange-500/50 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm">
        <div className="relative">
          <Server className="text-orange-500" size={24} />
          <div className="absolute -top-1 -right-1">
             <span className="flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
             </span>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-orange-400 text-sm">กำลังปลุกเซิร์ฟเวอร์...</h4>
          <p className="text-xs text-stone-400 mt-1">
            เนื่องจากใช้โฮสต์ฟรี อาจใช้เวลาโหลด 30-60 วินาทีในครั้งแรก
          </p>
        </div>
        <Loader2 className="animate-spin text-stone-500" size={20} />
      </div>
    </div>
  );
};

export default ServerWakingUp;