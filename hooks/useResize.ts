import { useState, useCallback, useEffect, useRef } from "react";

interface UseResizeReturn {
    sidebarWidth: number;
    editorWidth: number;
    inputHeight: number;
    isButtonTransition: boolean;
    isDragging: string | null;
    isClient: boolean;
    sidebarRef: React.RefObject<HTMLDivElement | null>;
    editorRef: React.RefObject<HTMLDivElement | null>;
    inputRef: React.RefObject<HTMLDivElement | null>;
    setSidebarWidth: (width: number) => void;
    setEditorWidth: (width: number) => void;
    setInputHeight: (height: number) => void;
    handleSidebarResize: (e: React.MouseEvent) => void;
    handleEditorResize: (e: React.MouseEvent) => void;
    handleInputResize: (e: React.MouseEvent) => void;
    applyPreset: (preset: any) => void;
    toggleEditor: () => void;
    togglePreview: () => void;
    toggleInput: () => void;
    toggleSidebar: () => void;
    resetLayout: () => void;
    transitionStyle: string;
    isEditorHidden: boolean;
    isPreviewHidden: boolean;
    isInputHidden: boolean;
    isInputMaximized: boolean;
    isEditorResizeHandleHidden: boolean;
}

export const useResize = (): UseResizeReturn => {
    const [sidebarWidth, setSidebarWidth] = useState(15);
    const [editorWidth, setEditorWidth] = useState(50);
    const [inputHeight, setInputHeight] = useState(30);
    const [isButtonTransition, setIsButtonTransition] = useState(false);
    const [isDragging, setIsDragging] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    const sidebarRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Computed values
    const isEditorHidden = editorWidth <= 0 && !isButtonTransition;
    const isPreviewHidden = editorWidth >= 100 && !isButtonTransition;
    const isInputHidden = inputHeight <= 0 && !isButtonTransition;
    const isInputMaximized = inputHeight >= 100 && !isButtonTransition;
    const isEditorResizeHandleHidden =
        (editorWidth >= 100 || editorWidth <= 0) && !isButtonTransition;

    const transitionStyle =
        isButtonTransition && !isDragging
            ? "width 0.3s ease, height 0.3s ease"
            : "none";

    const resetDragState = useCallback(() => {
        setIsDragging(null);
        if (typeof document !== 'undefined') {
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }
    }, []);

    useEffect(() => {
        if (!isClient) return;

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
                    finalPercentage = 30;
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

    const applyPreset = (preset: any) => {
        setIsButtonTransition(true);
        setSidebarWidth(preset.state.sidebarWidth ?? sidebarWidth);
        setEditorWidth(preset.state.editorWidth ?? editorWidth);
        setInputHeight(preset.state.inputHeight ?? inputHeight);
        setTimeout(() => setIsButtonTransition(false), 300);
    };

    const toggleEditor = () => {
        setIsButtonTransition(true);
        if (editorWidth <= 0) {
            setEditorWidth(50);
            if (inputHeight > 30) {
                setInputHeight(30);
            }
        } else if (editorWidth >= 100) {
            setEditorWidth(50);
        } else {
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
            setEditorWidth(50);
            if (inputHeight > 30) {
                setInputHeight(30);
            }
        } else if (editorWidth <= 0) {
            setEditorWidth(50);
        } else {
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
            setInputHeight(30);
        } else if (inputHeight >= 90) {
            setInputHeight(0);
        } else {
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

    return {
        sidebarWidth,
        editorWidth,
        inputHeight,
        isButtonTransition,
        isDragging,
        isClient,
        sidebarRef,
        editorRef,
        inputRef,
        setSidebarWidth,
        setEditorWidth,
        setInputHeight,
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
    };
};
