import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutGrid } from "lucide-react";

interface TopMenuProps {
  onToggleEditor: () => void;
  onTogglePreview: () => void;
  onToggleInput: () => void;
  onToggleSidebar: () => void;
  onApplyPreset: (preset: any) => void;
  onResetLayout: () => void;
  layoutPresets: any[];
}

export const TopMenu: React.FC<TopMenuProps> = ({
  onToggleEditor,
  onTogglePreview,
  onToggleInput,
  onToggleSidebar,
  onApplyPreset,
  onResetLayout,
  layoutPresets,
}) => {
  return (
    <div className="h-6 w-full border-b border-[#2D2F34] px-[10px] py-[5px] flex gap-[20px] items-center select-none text-xs bg-transparent">
      <span
        className="text-[12px] cursor-pointer transition-colors duration-300 hover:text-[#007bff]"
        onClick={onToggleEditor}
      >
        Editor
      </span>
      <span
        className="text-[12px] cursor-pointer transition-colors duration-300 hover:text-[#007bff]"
        onClick={onTogglePreview}
      >
        Preview
      </span>
      <span
        className="text-[12px] cursor-pointer transition-colors duration-500 hover:text-[#007bff]"
        onClick={onToggleInput}
      >
        Input
      </span>
      <span
        className="text-[12px] cursor-pointer transition-colors duration-300 hover:text-[#007bff]"
        onClick={onToggleSidebar}
      >
        Sidebar
      </span>
      
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-white h-6 px-2 text-xs bg-transparent border-none shadow-none focus:ring-0 focus:outline-none hover:bg-[#2D2F3] active:bg-[#2D2F3] cursor-pointer"
              style={{
                background: "transparent",
                border: "none",
                boxShadow: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              <LayoutGrid
                className="w-4 h-4 border-none text-white"
                style={{ color: "white" }}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48"
            style={{
              backgroundColor: "#0d1117",
              color: "white",
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.6), 0 0 0 1px #23262c",
              border: "none",
            }}
          >
            {layoutPresets.map((preset, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => onApplyPreset(preset)}
                className="flex items-center gap-2 cursor-pointer group"
                style={{
                  color: "white",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                <span className="group-hover:text-[#007bff] transition-colors duration-200">
                  {preset.name}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onResetLayout}
              className="flex items-center gap-2 cursor-pointer group"
              style={{
                color: "white",
                background: "none",
                cursor: "pointer",
              }}
            >
              <span className="group-hover:text-[#007bff] transition-colors duration-200">
                Reset
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
