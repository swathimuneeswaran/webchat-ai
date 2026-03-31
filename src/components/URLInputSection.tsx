import React from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";

interface URLInputSectionProps {
  url: string;
  onChange: (value: string) => void;
  onFetch: () => void;
  disabled?: boolean;
}

const URLInputSection: React.FC<URLInputSectionProps> = ({
  url,
  onChange,
  onFetch,
  disabled,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-9">
      {/* Left column - 3/5 width on medium+ screens */}
      <div className="md:col-span-3 space-y-6">
        <p className="text-5xl font-medium" style={{ color: "#24528e" }}>
          Chat with Any Website
        </p>
        <p className="text-gray-500">
          Enter a website URL and ask any question!
        </p>
        <div className="flex gap-2.5 py-7">
          <div className="w-3/5">
            <Input
              className="w-full"
              placeholder="Enter website URL here..."
              value={url}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="w-2/5">
            <Button onClick={onFetch} disabled={disabled} isLoading={disabled}>
              Fetch & Analyze
            </Button>
          </div>
        </div>
      </div>

      {/* Right column - 2/5 width on medium+ screens */}
      <div className="md:col-span-2 flex items-center justify-center">
        <img
          src="/images/img4.png"
          alt="Robot assistant"
          className="w-full h-auto max-w-xl object-contain"
        />
      </div>
    </div>
  );
};

export default URLInputSection;