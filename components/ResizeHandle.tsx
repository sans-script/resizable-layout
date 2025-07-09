import React from "react";

interface ResizeHandleProps {
  direction: "horizontal" | "vertical";
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  className?: string;
  title?: string;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  direction,
  isDragging,
  onMouseDown,
  style,
  className = "",
  title,
}) => {
  const isHorizontal = direction === "horizontal";
  
  const baseClasses = `absolute transition-colors z-50 ${
    isDragging ? "bg-[#4D4F54]" : "bg-transparent hover:bg-[#4D4F54]"
  }`;
  
  const directionClasses = isHorizontal 
    ? "top-0 bottom-0 w-[3px] cursor-col-resize" 
    : "left-0 right-0 h-[3px] cursor-row-resize";
  
  const cursorStyle = {
    cursor: isDragging 
      ? (isHorizontal ? "ew-resize !important" : "ns-resize !important")
      : (isHorizontal ? "col-resize" : "row-resize"),
  };

  return (
    <div
      className={`${baseClasses} ${directionClasses} ${className}`}
      style={{ ...cursorStyle, ...style }}
      onMouseDown={onMouseDown}
      title={title}
    />
  );
};
