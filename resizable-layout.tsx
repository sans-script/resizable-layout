"use client";

declare global {
  interface Window {
    setSidebarWidth?: (v: number) => void;
    setEditorWidth?: (v: number) => void;
    setInputHeight?: (v: number) => void;
  }
}

import React from "react";
import { useResize } from "./hooks/useResize";
import { TopMenu } from "./components/TopMenu";
import { Panel } from "./components/Panel";
import { ResizeHandle } from "./components/ResizeHandle";
import { LAYOUT_PRESETS } from "./constants/layout";

export default function ResizableLayout() {
  const {
    sidebarWidth,
    editorWidth,
    inputHeight,
    isButtonTransition,
    isDragging,
    isClient,
    sidebarRef,
    editorRef,
    inputRef,
    handleSidebarResize,
    handleEditorResize,
    handleInputResize,
    applyPreset,
    toggleEditor,
    togglePreview,
    toggleInput,
    toggleSidebar,
    resetLayout,
    transitionStyle,
    isEditorHidden,
    isPreviewHidden,
    isInputHidden,
    isInputMaximized,
    isEditorResizeHandleHidden,
  } = useResize();

  // Calculate heights for display
  const menuHeight = 32;
  const availableHeight = isClient
    ? 100 - (menuHeight / window.innerHeight) * 100
    : 100;
  const editorHeight = availableHeight - inputHeight;
  const previewHeight = editorHeight;

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-primary-black text-primary-white overflow-hidden">
      {/* Top Menu */}
      <TopMenu
        onToggleEditor={toggleEditor}
        onTogglePreview={togglePreview}
        onToggleInput={toggleInput}
        onToggleSidebar={toggleSidebar}
        onApplyPreset={applyPreset}
        onResetLayout={resetLayout}
        layoutPresets={LAYOUT_PRESETS}
      />

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
          <Panel
            title="File Panel"
            width={sidebarWidth}
            height={100}
            className="border-r border-primary-border flex-1 bg-primary-black text-primary-gray"
          />

          {/* Sidebar Resize Handle */}
          <ResizeHandle
            direction="horizontal"
            isDragging={isDragging === "sidebar"}
            onMouseDown={handleSidebarResize}
            style={{
              top: 0,
              right: "-0.8px",
              bottom: 0,
            }}
          />
        </div>

        {/* Main Area */}
        <div className="flex-1 flex relative">
          {/* Editor */}
          <div
            ref={editorRef}
            className="bg-primary-black flex flex-col relative overflow-hidden border-r border-primary-border"
            style={{
              width: `${editorWidth}%`,
              height:
                inputHeight <= 0
                  ? "100%"
                  : inputHeight >= 100
                  ? "0%"
                  : `${100 - inputHeight}%`,
              transition: transitionStyle,
              display: isEditorHidden ? "none" : "flex",
            }}
          >
            <Panel
              title="Editor"
              width={editorWidth}
              height={editorHeight}
              className="flex-1 bg-primary-black text-primary-white"
            />
          </div>

          {/* Editor Resize Handle - only appears when both are visible */}
          {!isEditorResizeHandleHidden && (
            <ResizeHandle
              direction="horizontal"
              isDragging={isDragging === "editor"}
              onMouseDown={handleEditorResize}
              style={{
                left: `${editorWidth}%`,
                height: inputHeight <= 0 ? "100%" : `${100 - inputHeight}%`,
                marginLeft: "-2.1px",
                top: 0,
                bottom: 0,
              }}
            />
          )}

          {/* Preview */}
          <div
            className="bg-primary-black flex flex-col overflow-hidden"
            style={{
              width: `${100 - editorWidth}%`,
              height:
                inputHeight <= 0
                  ? "100%"
                  : inputHeight >= 100
                  ? "0%"
                  : `${100 - inputHeight}%`,
              transition: transitionStyle,
              display: isPreviewHidden ? "none" : "flex",
            }}
          >
            <Panel
              title="Preview"
              width={100 - editorWidth}
              height={previewHeight}
              className="flex-1 bg-primary-black text-primary-white"
            />
          </div>

          {/* Prompt Input */}
          <div
            ref={inputRef}
            className="bg-primary-black border-t border-primary-border flex flex-col absolute bottom-0 left-0 right-0"
            style={{
              height: `${inputHeight}%`,
              transition: transitionStyle,
              display: isInputHidden ? "none" : "flex",
            }}
          >
            {/* Input Resize Handle */}
            <ResizeHandle
              direction="vertical"
              isDragging={isDragging === "input"}
              onMouseDown={handleInputResize}
              title="Drag to resize the input (drag down to minimize)"
              style={{
                top: "-2px",
                left: 0,
                right: 0,
              }}
            />

            <Panel
              title="Prompt Input"
              width={100}
              height={inputHeight}
              className="flex-1 bg-primary-black text-primary-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
