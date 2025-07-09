export const LAYOUT_PRESETS = [
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

export const DEFAULT_LAYOUT = {
    sidebarWidth: 15,
    editorWidth: 50,
    inputHeight: 30,
};

export const LAYOUT_CONSTRAINTS = {
    sidebar: {
        min: 10,
        max: 30,
    },
    editor: {
        min: 0,
        max: 100,
    },
    input: {
        min: 30,
        max: 100,
    },
};

export const MENU_HEIGHT = 32;
export const TRANSITION_DURATION = 300;
