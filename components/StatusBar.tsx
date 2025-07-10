import React from "react";

interface StatusBarProps {
  className?: string;
}

export function StatusBar({ className = "" }: StatusBarProps) {
  return (
    <div className={`status-bar ${className}`}>
      {/* Left side - Host information */}
      <div className="flex items-center space-x-4">
        <div className="status-item">
          <span>Mark Down</span>
        </div>
      </div>

      {/* Right side - Additional info (empty for now) */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Future status items can be added here */}
      </div>
    </div>
  );
}