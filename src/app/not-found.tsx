import React from "react";
import Link from "next/link";
import { HOME_PAGE } from "@/common/page-links";

const Custom404: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-8">Page Not Found</p>
        <Link className="text-blue-500 hover:underline" href={HOME_PAGE}>
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
