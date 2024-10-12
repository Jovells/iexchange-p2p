// src/app/inProgress.tsx

import { Construction, LucideConstruction } from "lucide-react";
import React from "react";
import { SiConstruct3 } from "react-icons/si";

const InProgress: React.FC = () => {
  return (
    <div className="flex text-gray-500  items-center justify-center min-h-screen">
      <div className="text-center">
        <div className=" flex justify-center">
          <LucideConstruction size={200} />
        </div>
        <h1 className="text-4xl font-bold mb-4">Page Under Construction</h1>
        <p className=" text-gray-600 mb-8">We're working hard to bring you this page. Stay tuned!</p>
      </div>
    </div>
  );
};

export default InProgress;
