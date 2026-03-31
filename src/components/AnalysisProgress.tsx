import React from "react";
import { Loader } from "lucide-react";

const AnalysisProgress: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-8">
      {/* Left column - 60% - centered content */}
      <div className="md:col-span-3 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl mx-auto">
          {/* Header */}
          <h2
            className="text-4xl font-semibold text-center mb-4"
            style={{ color: "#355b8e" }}
          >
            Analyzing Website Content...
          </h2>

          {/* Progress bar with sliding gradient animation */}
          <div className="w-full max-w-md mx-auto h-4 bg-gray-200 rounded-full overflow-hidden mb-4 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-gradient-slide"
              style={{
                width: "60%",
                backgroundSize: "200% 100%", // Make gradient twice as wide
              }}
            ></div>
          </div>

          {/* Progress steps with enhanced pulsing dots */}
          <div className="space-y-4 py-3 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping opacity-75 absolute"></div>
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full relative"></div>
              </div>
              <span className="text-gray-700 text-lg">
                Fetching and indexing content...
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping opacity-75 absolute"></div>
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full relative"></div>
              </div>
              <span className="text-gray-700 text-lg">Processing...</span>
            </div>
          </div>

          {/* Subtle helper text */}
          <p className="text-center text-gray-400 text-sm mt-4">
            This may take a few seconds
          </p>

          {/* Loader at bottom */}
          <div className="flex justify-center mt-6">
            <Loader className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        </div>
      </div>

      {/* Right column - robot illustration */}
      <div className="md:col-span-2 flex items-center justify-center">
        <img
          src="/images/img1.png"
          alt="Robot assistant"
          className="w-full h-auto max-w-lg object-contain drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default AnalysisProgress;