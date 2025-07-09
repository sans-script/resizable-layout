import React from "react";

interface PanelProps {
  title: string;
  width?: number;
  height?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showDimensions?: boolean;
}

export const Panel: React.FC<PanelProps> = ({
  title,
  width,
  height,
  children,
  className = "",
  style,
  showDimensions = true,
}) => {
  return (
    <div className={`flex flex-col ${className}`} style={style}>
      <div className="flex-1 p-4 flex items-center justify-center">
        {children || (
          <div className="text-center">
            <p className="text-xl font-medium">{title}</p>
            {showDimensions && (
              <>
                {width !== undefined && (
                  <p className="text-sm mt-2 opacity-80">
                    Width: {width.toFixed(1)}%
                  </p>
                )}
                {height !== undefined && (
                  <p className="text-sm opacity-80">
                    Height: {height.toFixed(1)}%
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
