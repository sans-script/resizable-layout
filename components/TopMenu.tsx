import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

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
    <div className="h-6 w-full border-b border-primary-border px-[10px] py-[5px] flex gap-[20px] items-center select-none text-xs bg-primary-black">
      <span
        className="text-[12px] cursor-pointer transition-colors duration-300 text-primary-white hover:text-accent-blue"
        onClick={onToggleEditor}
      >
        Editor
      </span>
      <span
        className="text-[12px] cursor-pointer transition-colors duration-300 text-primary-white hover:text-accent-blue"
        onClick={onTogglePreview}
      >
        Preview
      </span>
      <span
        className="text-[12px] cursor-pointer transition-colors duration-500 text-primary-white hover:text-accent-blue"
        onClick={onToggleInput}
      >
        Input
      </span>
      <span
        className="text-[12px] cursor-pointer transition-colors duration-300 text-primary-white hover:text-accent-blue"
        onClick={onToggleSidebar}
      >
        Sidebar
      </span>

      <div className="ml-auto flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-white h-5 px-2 text-xs bg-transparent !border-none !shadow-none !focus:ring-0 !focus:outline-none hover:bg-primary-gray active:bg-primary-gray cursor-pointer !focus:border-none !focus:ring-offset-0 flex items-center justify-center rounded-sm"
              style={{ outline: "none", border: "none", boxShadow: "none" }}
            >
              <Menu className="w-5 h-4 text-primary-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-primary-dark text-primary-white border-primary-border menu-item"
          >
            {layoutPresets.map((preset, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => onApplyPreset(preset)}
                className="flex items-center gap-2 cursor-pointer group text-primary-white !hover:bg-primary-gray !bg-transparent data-[highlighted]:!bg-primary-gray focus:!bg-primary-gray"
              >
                <span className="transition-colors duration-200">
                  {preset.name}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onResetLayout}
              className="flex items-center gap-2 cursor-pointer group text-primary-white !hover:bg-primary-gray !bg-transparent data-[highlighted]:!bg-primary-gray focus:!bg-primary-gray"
            >
              <span className="transition-colors duration-200">Reset</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
