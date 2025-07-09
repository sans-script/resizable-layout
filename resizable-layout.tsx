"use client";

declare global {
  interface Window {
    setSidebarWidth?: (v: number) => void;
    setEditorWidth?: (v: number) => void;
    setInputHeight?: (v: number) => void;
  }
}

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Folder,
  FileText,
  Eye,
  Terminal,
  Settings,
  Monitor,
  Code,
  Palette,
  Command,
  LayoutGrid,
} from "lucide-react";
import "./styles/github-markdown.css";

const LAYOUT_PRESETS = [
  {
    name: "Editor Focus",
    state: { editorWidth: 70, inputHeight: 0 },
  },
  {
    name: "Preview Focus",
    state: { editorWidth: 30 },
  },
  {
    name: "Large Terminal",
    state: { inputHeight: 60 },
  },
  {
    name: "No Sidebar",
    state: { sidebarWidth: 0 },
  },
  {
    name: "Full Editor",
    state: { sidebarWidth: 0, editorWidth: 100, inputHeight: 0 },
  },
  {
    name: "Full Preview",
    state: { sidebarWidth: 0, editorWidth: 0, inputHeight: 0 },
  },
  {
    name: "Minimal",
    state: { sidebarWidth: 10, editorWidth: 40, inputHeight: 10 },
  },
  {
    name: "Wide Terminal",
    state: { sidebarWidth: 0, inputHeight: 40 },
  },
  {
    name: "Sidebar Only",
    state: { sidebarWidth: 30, editorWidth: 0, inputHeight: 0 },
  },
];

export default function ResizableLayout() {
  const [sidebarWidth, setSidebarWidth] = useState(15);
  const [editorWidth, setEditorWidth] = useState(50);
  const [inputHeight, setInputHeight] = useState(30);
  const [isButtonTransition, setIsButtonTransition] = useState(false);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [isTypingEffectEnabled, setIsTypingEffectEnabled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Correct logic to hide elements - only hides if not in transition
  const isEditorHidden = editorWidth <= 0 && !isButtonTransition;
  const isPreviewHidden = editorWidth >= 100 && !isButtonTransition;
  const isInputHidden = inputHeight <= 0 && !isButtonTransition;
  const isInputMaximized = inputHeight >= 100 && !isButtonTransition;
  const isEditorResizeHandleHidden =
    (editorWidth >= 100 || editorWidth <= 0) && !isButtonTransition;

  // Simple cleanup
  const resetDragState = useCallback(() => {
    setIsDragging(null);
    if (typeof document !== 'undefined') {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Global cleanup for emergencies
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        resetDragState();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDragging) {
        resetDragState();
      }
    };

    const handleBlur = () => {
      if (isDragging) {
        resetDragState();
      }
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("blur", handleBlur);

    // Set global setters
    if (typeof window !== 'undefined') {
      window.setSidebarWidth = setSidebarWidth;
      window.setEditorWidth = setEditorWidth;
      window.setInputHeight = setInputHeight;
    }

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("blur", handleBlur);

      if (typeof window !== 'undefined') {
        window.setSidebarWidth = undefined;
        window.setEditorWidth = undefined;
        window.setInputHeight = undefined;
      }
    };
  }, [isDragging, resetDragState, isClient]);

  const handleSidebarResize = useCallback(
    (e: React.MouseEvent) => {
      if (!isClient) return;
      e.preventDefault();
      e.stopPropagation();

      if (isDragging) return;

      setIsDragging("sidebar");
      const startX = e.clientX;
      const startWidth = sidebarRef.current?.offsetWidth || 0;

      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";

      const onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        document.body.style.cursor = "ew-resize";
        const newWidth = startWidth + (e.clientX - startX);
        const percentage = (newWidth / window.innerWidth) * 100;
        if (percentage >= 10 && percentage <= 30) {
          setSidebarWidth(percentage);
        }
      };

      const onMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        resetDragState();
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [isDragging, resetDragState, isClient]
  );

  const handleEditorResize = useCallback(
    (e: React.MouseEvent) => {
      if (!isClient) return;
      e.preventDefault();
      e.stopPropagation();

      if (isDragging) return;

      setIsDragging("editor");
      const startX = e.clientX;
      const startWidth = editorRef.current?.offsetWidth || 0;
      const sidebarWidthPx = (sidebarWidth / 100) * window.innerWidth;

      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";

      const onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        document.body.style.cursor = "ew-resize";
        const newWidth = startWidth + (e.clientX - startX);
        const percentage =
          (newWidth / (window.innerWidth - sidebarWidthPx)) * 100;

        let finalPercentage = percentage;
        if (percentage < 1) {
          finalPercentage = 0;
        } else if (percentage > 99) {
          finalPercentage = 100;
        } else if (percentage >= 0 && percentage <= 100) {
          finalPercentage = percentage;
        }

        setEditorWidth(finalPercentage);
      };

      const onMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        resetDragState();
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [sidebarWidth, isDragging, resetDragState, isClient]
  );

  const handleInputResize = useCallback(
    (e: React.MouseEvent) => {
      if (!isClient) return;
      e.preventDefault();
      e.stopPropagation();

      if (isDragging) return;

      setIsDragging("input");
      const startY = e.clientY;
      const startHeight = inputRef.current?.offsetHeight || 0;
      const menuHeight = 32;

      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";

      const onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        document.body.style.cursor = "ns-resize";
        const newHeight = startHeight + (startY - e.clientY);
        const availableHeight = window.innerHeight - menuHeight;
        const percentage = (newHeight / availableHeight) * 100;

        let finalPercentage = percentage;
        if (percentage < 30) {
          finalPercentage = 30; // Minimum 30% when dragging manually
        } else if (percentage > 99) {
          finalPercentage = 100;
        } else if (percentage >= 30 && percentage <= 100) {
          finalPercentage = percentage;
        }

        setInputHeight(finalPercentage);
      };

      const onMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        resetDragState();
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [isDragging, resetDragState, isClient]
  );

  const applyPreset = (preset: (typeof LAYOUT_PRESETS)[0]) => {
    setIsButtonTransition(true);
    setSidebarWidth(preset.state.sidebarWidth ?? sidebarWidth);
    setEditorWidth(preset.state.editorWidth ?? editorWidth);
    setInputHeight(preset.state.inputHeight ?? inputHeight);
    setTimeout(() => setIsButtonTransition(false), 300);
  };

  const toggleEditor = () => {
    setIsButtonTransition(true);
    if (editorWidth <= 0) {
      // If editor is hidden, restore to 50%
      setEditorWidth(50);
      if (inputHeight > 30) {
        setInputHeight(30);
      }
    } else if (editorWidth >= 100) {
      // If editor is maximized, restore to 50%
      setEditorWidth(50);
    } else {
      // If editor is visible but not maximized, maximize
      setEditorWidth(100);
      if (inputHeight > 30) {
        setInputHeight(30);
      }
    }
    setTimeout(() => setIsButtonTransition(false), 300);
  };

  const togglePreview = () => {
    setIsButtonTransition(true);
    if (editorWidth >= 100) {
      // If preview is hidden (editor maximized), restore to 50%
      setEditorWidth(50);
      if (inputHeight > 30) {
        setInputHeight(30);
      }
    } else if (editorWidth <= 0) {
      // If preview is maximized (editor hidden), restore to 50%
      setEditorWidth(50);
    } else {
      // If preview is visible but not maximized, maximize (hide editor)
      setEditorWidth(0);
      if (inputHeight > 30) {
        setInputHeight(30);
      }
    }
    setTimeout(() => setIsButtonTransition(false), 300);
  };

  const toggleInput = () => {
    setIsButtonTransition(true);
    if (inputHeight <= 0) {
      // If input is hidden, show with 30%
      setInputHeight(30);
    } else if (inputHeight >= 90) {
      // If input is large, hide completely
      setInputHeight(0);
    } else {
      // If input is normal, maximize
      setInputHeight(100);
    }
    setTimeout(() => setIsButtonTransition(false), 300);
  };

  const toggleSidebar = () => {
    setIsButtonTransition(true);
    if (sidebarWidth <= 3) {
      setSidebarWidth(30);
    } else {
      setSidebarWidth(0);
    }
    setTimeout(() => setIsButtonTransition(false), 300);
  };

  const resetLayout = () => {
    setIsButtonTransition(true);
    setSidebarWidth(15);
    setEditorWidth(50);
    setInputHeight(30);
    setTimeout(() => setIsButtonTransition(false), 300);
  };

  const openMarkdownFile = () => {
    // Logic to open Markdown file
  };

  const saveAsMarkdown = () => {
    // Logic to save as Markdown file
  };

  // Apply transition only when not dragging and it's a button action
  const transitionStyle =
    isButtonTransition && !isDragging
      ? "width 0.3s ease, height 0.3s ease"
      : "none";

  // Calculate heights for display
  const menuHeight = 32;
  const availableHeight = isClient ? 100 - (menuHeight / window.innerHeight) * 100 : 100;
  const editorHeight = availableHeight - inputHeight;
  const previewHeight = editorHeight;

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return null;
  }

  return (
    <div className="markdown-body  h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Top Menu */}
      <div className="h-6 w-full border-b border-[#2D2F34] px-[10px] py-[5px] flex gap-[20px] items-center select-none text-xs bg-transparent">
        {/* <span
          className="text-[12px] cursor-pointer transition-colors duration-500 hover:text-[#007bff]"
          onClick={openMarkdownFile}
        >
          Open
        </span>
        <span
          className="text-[12px] cursor-pointer transition-colors duration-500 hover:text-[#007bff]"
          onClick={saveAsMarkdown}
        >
          Save
        </span> */}
        <span
          className="text-[12px] cursor-pointer transition-colors duration-300 hover:text-[#007bff]"
          onClick={toggleEditor}
        >
          Editor
        </span>
        <span
          className="text-[12px] cursor-pointer transition-colors duration-300 hover:text-[#007bff]"
          onClick={togglePreview}
        >
          Preview
        </span>
        <span
          className="text-[12px] cursor-pointer transition-colors duration-500 hover:text-[#007bff]"
          onClick={toggleInput}
        >
          Input
        </span>
        <span
          className="text-[12px] cursor-pointer transition-colors duration-300 hover:text-[#007bff]"
          onClick={toggleSidebar}
        >
          Sidebar
        </span>
        {/* <span
          className="text-[12px] cursor-pointer transition-colors duration-300 hover:text-[#007bff]"
          onClick={() => setIsTypingEffectEnabled((v) => !v)}
        >
          {isTypingEffectEnabled ? "Disable" : "Enable"} Typing Effect
        </span> */}
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
              {LAYOUT_PRESETS.map((preset, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-2 cursor-pointer group"
                  style={{
                    color: "white",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  {/* {preset.icon} */}
                  <span className="group-hover:text-[#007bff] transition-colors duration-200">
                    {preset.name}
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={resetLayout}
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

      {/* Main Layout */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className="flex flex-col relative"
          style={{
            width: `${sidebarWidth}%`,
            transition: transitionStyle,
          }}
        >
          <div className="border-r border-[#2D2F34] flex-1 p-4 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium">File Panel</p>
              <p className="text-sm mt-2 opacity-80">
                Width: {sidebarWidth.toFixed(1)}%
              </p>
              <p className="text-sm opacity-80">Height: 100%</p>
            </div>
          </div>
          {/* Resize Handle */}
          <div
            className={`absolute top-0 -right-[0.8px] bottom-0 w-[3px] cursor-col-resize transition-colors z-50 ${
              isDragging === "sidebar" ? "bg-[#4D4F54]" : "bg-transparent hover:bg-[#4D4F54]"
            }`}
            style={{
              cursor:
                isDragging === "sidebar"
                  ? "ew-resize !important"
                  : "col-resize",
                  
                  
            }}
            onMouseDown={handleSidebarResize}
          />
        </div>
        {/* Main Area */}
        <div className="flex-1 flex relative">
          {/* Editor */}
          <div
            ref={editorRef}
            className="bg-[#0d1117] flex flex-col relative overflow-hidden border-r border-[#2D2F34] "
            style={{
              width: `${editorWidth}%`,
              height:
                inputHeight <= 0
                  ? "100%"
                  : inputHeight >= 100
                  ? "0%"
                  : `${100 - inputHeight}%`,
              transition: transitionStyle,
              display:
                editorWidth <= 0 && !isButtonTransition ? "none" : "flex",
            }}
          >
            <div className="flex-1 p-4 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl font-medium">Editor</p>
                <p className="text-sm mt-2 opacity-80">
                  Width: {editorWidth.toFixed(1)}%
                </p>
                <p className="text-sm opacity-80">
                  Height: {editorHeight.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Resize Handle - only appears when both are visible */}
          {!isEditorResizeHandleHidden && (
            <div
              className={`absolute top-0 bottom-0 cursor-col-resize transition-colors z-50 ${
                isDragging === "editor" ? "bg-[#4D4F54]" : "bg-transparent hover:bg-[#4D4F54]"
              }`}
              style={{
                cursor:
                  isDragging === "editor"
                    ? "ew-resize !important"
                    : "col-resize",
                left: `${editorWidth}%`,
                height: inputHeight <= 0 ? "100%" : `${100 - inputHeight}%`,
                marginLeft: "-2.1px",
                width: "3px"
              }}
              onMouseDown={handleEditorResize}
            />
          )}

          {/* Preview */}
          <div
            className="bg-[#0d1117] flex flex-col overflow-hidden"
            style={{
              width: `${100 - editorWidth}%`,
              height:
                inputHeight <= 0
                  ? "100%"
                  : inputHeight >= 100
                  ? "0%"
                  : `${100 - inputHeight}%`,
              transition: transitionStyle,
              display:
                editorWidth >= 100 && !isButtonTransition ? "none" : "flex",
            }}
          >
            <div className="flex-1 p-4 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl font-medium">Preview</p>
                <p className="text-sm mt-2 opacity-80">
                  Width: {(100 - editorWidth).toFixed(1)}%
                </p>
                <p className="text-sm opacity-80">
                  Height: {previewHeight.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Prompt Input */}
          <div
            ref={inputRef}
            className="bg-[#1a1d23] border-t border-[#2D2F34]  flex flex-col absolute bottom-0 left-0 right-0"
            style={{
              height: `${inputHeight}%`,
              transition: transitionStyle,
              display:
                inputHeight <= 0 && !isButtonTransition ? "none" : "flex",
            }}
          >
            {/* Resize Handle */}
            <div
              className={`h-[3px] cursor-row-resize transition-colors absolute top-[-2.1px] left-0 right-0 z-50 ${
                isDragging === "input" ? "bg-[#4D4F54]" : "bg-transparent hover:bg-[#4D4F54]"
              }`}
              style={{
                cursor:
                  isDragging === "input"
                    ? "ns-resize !important"
                    : "row-resize",
              }}
              onMouseDown={handleInputResize}
              title="Drag to resize the input (drag down to minimize)"
            />
            <div className="flex-1 p-4 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl font-medium">Prompt Input</p>
                <p className="text-sm mt-2 opacity-80">Width: 100%</p>
                <p className="text-sm opacity-80">
                  Height: {inputHeight.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}