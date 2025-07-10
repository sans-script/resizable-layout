import React, { useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  height?: string;
  className?: string;
  inputHeight?: number; // Height of the input panel in percentage
}

const signedDarkProTheme = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    // Basic text
    { token: "", foreground: "FFFFFF" },

    // Markdown headings
    { token: "markup.heading.1", foreground: "6943FF", fontStyle: "bold" },
    { token: "markup.heading.2", foreground: "0080FF", fontStyle: "bold" },
    { token: "markup.heading.3", foreground: "3AD900", fontStyle: "bold" },
    { token: "markup.heading.4", foreground: "FFE604", fontStyle: "bold" },
    { token: "markup.heading.5", foreground: "FF2C70", fontStyle: "bold" },
    { token: "markup.heading.6", foreground: "80FCFF", fontStyle: "bold" },

    // Markdown bold and italic
    { token: "markup.bold", foreground: "FFFFFF", fontStyle: "bold" },
    { token: "markup.italic", foreground: "FFFFFF", fontStyle: "italic" },

    // Markdown links
    { token: "markup.underline.link", foreground: "0080FF" },
    { token: "string.other.link.title", foreground: "0080FF" },

    // Markdown quotes
    { token: "markup.quote", foreground: "888888", fontStyle: "italic" },

    // Markdown code
    { token: "markup.fenced_code", foreground: "FFE604" },
    { token: "markup.inline.raw", foreground: "FFE604" },

    // Markdown lists
    { token: "markup.list.unnumbered", foreground: "6943FF" },
    { token: "markup.list.numbered", foreground: "6943FF" },

    // Markdown separators
    { token: "meta.separator", foreground: "555555" },

    // HTML tags in markdown
    { token: "meta.tag", foreground: "6943FF" },
    { token: "entity.name.tag", foreground: "6943FF" },
    { token: "entity.other.attribute-name", foreground: "0080FF" },

    // Emphasis markers
    { token: "punctuation.definition.bold", foreground: "999999" },
    { token: "punctuation.definition.italic", foreground: "999999" },
    { token: "punctuation.definition.heading", foreground: "999999" },
    { token: "punctuation.definition.list", foreground: "999999" },
    { token: "punctuation.definition.quote", foreground: "999999" },
    { token: "punctuation.definition.raw", foreground: "999999" },
    { token: "punctuation.definition.link", foreground: "999999" },
  ],
  colors: {
    // Editor background
    "editor.background": "#000000",
    "editor.foreground": "#FFFFFF",

    // Line numbers
    "editorLineNumber.foreground": "#555555",
    "editorLineNumber.activeForeground": "#FFFFFF",

    // Cursor
    "editorCursor.foreground": "#0040FF",
    "editorCursor.background": "#FFFFFF",

    // Selection
    "editor.selectionBackground": "#0040FF55",
    "editor.inactiveSelectionBackground": "#0040FF44",
    "editor.selectionHighlightBackground": "#0080FF55",

    // Line highlight (disabled)
    "editor.lineHighlightBackground": "#000000",
    "editor.lineHighlightBorder": "#000000",

    // Word highlight (disabled)
    "editor.wordHighlightBackground": "#000000",
    "editor.wordHighlightBorder": "#000000",
    "editor.wordHighlightStrongBackground": "#000000",
    "editor.wordHighlightStrongBorder": "#000000",

    // Find matches
    "editor.findMatchBackground": "#0050A4",
    "editor.findMatchHighlightBackground": "#0080FF44",
    "editor.findMatchBorder": "#0050A4",
    "editor.findMatchHighlightBorder": "#0080FF44",

    // Brackets (disabled)
    "editorBracketMatch.background": "#000000",
    "editorBracketMatch.border": "#000000",

    // Indentation guides (disabled)
    "editorIndentGuide.background": "#000000",
    "editorIndentGuide.activeBackground": "#000000",

    // Whitespace (disabled)
    "editorWhitespace.foreground": "#000000",

    // Gutter
    "editorGutter.background": "#000000",

    // Scrollbar
    "scrollbarSlider.background": "#222222",
    "scrollbarSlider.hoverBackground": "#333333",
    "scrollbarSlider.activeBackground": "#252525",

    // Error/warning/info (disabled for markdown)
    "editorError.foreground": "#000000",
    "editorWarning.foreground": "#000000",
    "editorInfo.foreground": "#000000",
    "editorHint.foreground": "#000000",

    // Minimap
    "minimap.background": "#000000",
    "minimap.selectionHighlight": "#0080FF",
    "minimap.findMatchHighlight": "#0080FF66",
    "minimap.errorHighlight": "#000000",
    "minimap.warningHighlight": "#000000",
    "minimapSlider.background": "#22222233",
    "minimapSlider.hoverBackground": "#33333355",
    "minimapSlider.activeBackground": "#25252555",
    "minimapGutter.addedBackground": "#000000",
    "minimapGutter.modifiedBackground": "#000000",
    "minimapGutter.deletedBackground": "#000000",

    // Widget (hover, suggestions, etc.)
    "editorWidget.background": "#000000",
    "editorWidget.border": "#333333",
    "editorWidget.foreground": "#FFFFFF",
    "editorWidget.resizeBorder": "#333333",
    "editorSuggestWidget.background": "#000000",
    "editorSuggestWidget.border": "#333333",
    "editorSuggestWidget.foreground": "#FFFFFF",
    "editorSuggestWidget.selectedBackground": "#222222",
    "editorSuggestWidget.highlightForeground": "#0080FF",

    // Context Menu
    "menu.background": "#000000",
    "menu.foreground": "#FFFFFF",
    "menu.selectionBackground": "#222222",
    "menu.selectionForeground": "#FFFFFF",
    "menu.selectionBorder": "#333333",
    "menu.separatorBackground": "#333333",
    "menu.border": "#333333",

    // Quick input (Command Palette)
    "quickInput.background": "#000000",
    "quickInput.foreground": "#FFFFFF",
    "quickInputTitle.background": "#000000",
    "quickInputList.focusBackground": "#222222",
    "quickInputList.focusForeground": "#FFFFFF",

    // Overview ruler
    "editorOverviewRuler.border": "#080808",
    "editorOverviewRuler.selectionHighlightForeground": "#0080FF",
    "editorOverviewRuler.findMatchForeground": "#0080FF",

    // Focus border
    focusBorder: "#333333",

    // Scrollbar
    "scrollbar.shadow": "#000000",

    // Selection
    "selection.background": "#0040FF",

    // Icon
    "icon.foreground": "#FFFFFF",

    // Widget shadow
    "widget.shadow": "#00000066",

    // Remove any blue borders
    "widget.border": "#333333",
  },
};

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language = "markdown",
  height = "100%",
  className = "",
  inputHeight = 0,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // Calculate the actual height for the editor
  const calculateEditorHeight = () => {
    if (inputHeight <= 0) {
      return "100%";
    } else if (inputHeight >= 100) {
      return "0%";
    } else {
      return `${100 - inputHeight}%`;
    }
  };

  const editorHeight = calculateEditorHeight();

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;

    // Define the custom theme
    monaco.editor.defineTheme("signed-dark-pro", signedDarkProTheme);
    monaco.editor.setTheme("signed-dark-pro");

    // Configure editor options for markdown
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Consolas, Monaco, "Courier New", monospace',
      lineHeight: 1.5,
      cursorStyle: "line",
      cursorWidth: 2,
      cursorBlinking: "smooth",
      wordWrap: "on",
      wordWrapColumn: 120,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      renderWhitespace: "none",
      renderLineHighlight: "none",
      selectionHighlight: false,
      occurrencesHighlight: "off",
      folding: false,
      showFoldingControls: "never",
      bracketPairColorization: {
        enabled: false,
      },
      guides: {
        bracketPairs: false,
        bracketPairsHorizontal: false,
        highlightActiveBracketPair: false,
        indentation: false,
        highlightActiveIndentation: false,
      },
      suggest: {
        showKeywords: false,
        showSnippets: false,
      },
      quickSuggestions: false,
      parameterHints: {
        enabled: false,
      },
      acceptSuggestionOnEnter: "off",
      acceptSuggestionOnCommitCharacter: false,
      formatOnPaste: false,
      formatOnType: false,
      autoClosingBrackets: "always",
      autoClosingQuotes: "always",
      autoSurround: "never",
      colorDecorators: false,
      links: true,
      contextmenu: true,
      mouseWheelZoom: true,
      multiCursorModifier: "ctrlCmd",
      find: {
        seedSearchStringFromSelection: "always",
        autoFindInSelection: "never",
        addExtraSpaceOnTop: true,
      },
      hover: {
        enabled: false,
      },
      smoothScrolling: true,
      scrollbar: {
        verticalScrollbarSize: 14,
        horizontalScrollbarSize: 14,
        useShadows: true,
        verticalSliderSize: 14,
        horizontalSliderSize: 14,
        scrollByPage: false,
      },
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value);
  };

  return (
    <div
      className={`monaco-editor-container  ${className}`}
      style={{
        width: "100%",
        height: editorHeight,
        position: "relative",
        top: "2px",
      }}
    >
      <Editor
        height={editorHeight}
        language={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="signed-dark-pro"
        loading={
          <div className="flex items-center justify-center h-full text-primary-white">
            Loading editor...
          </div>
        }
      />
    </div>
  );
};

export default MonacoEditor;
