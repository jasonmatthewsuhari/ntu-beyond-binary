(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/fluent-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FluentProvider",
    ()=>FluentProvider,
    "useFluentContext",
    ()=>useFluentContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
// ── Defaults ────────────────────────────────────────────
const DEFAULT_SETTINGS = {
    theme: 'light',
    fontSize: 16,
    fontFamily: 'inter',
    lineHeight: 1.6,
    letterSpacing: 0,
    reducedMotion: false,
    cursorSize: 'normal',
    dwellTime: 1200,
    scanSpeed: 1500,
    tremorFilter: 0,
    morseThresholds: {
        dot: 200,
        dash: 400,
        letterGap: 1000,
        wordGap: 2000
    },
    ttsVoice: '',
    ttsSpeed: 1.0,
    ttsPitch: 1.0,
    sosEnabled: true,
    sosTrigger: 'taps',
    sosContacts: []
};
const DEFAULT_OUTPUT = {
    text: '',
    history: [
        ''
    ],
    historyIndex: 0
};
const FluentContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function useFluentContext() {
    _s();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(FluentContext);
    if (!ctx) throw new Error('useFluentContext must be inside FluentProvider');
    return ctx;
}
_s(useFluentContext, "/dMy7t63NXD4eYACoT93CePwGrg=");
function FluentProvider({ children }) {
    _s1();
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_SETTINGS);
    const [output, setOutputState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_OUTPUT);
    const [isSpeaking, setIsSpeaking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Load settings from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FluentProvider.useEffect": ()=>{
            try {
                const saved = localStorage.getItem('fluent-settings');
                if (saved) setSettings({
                    ...DEFAULT_SETTINGS,
                    ...JSON.parse(saved)
                });
            } catch  {}
        }
    }["FluentProvider.useEffect"], []);
    // Persist settings
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FluentProvider.useEffect": ()=>{
            try {
                localStorage.setItem('fluent-settings', JSON.stringify(settings));
            } catch  {}
        }
    }["FluentProvider.useEffect"], [
        settings
    ]);
    // Apply theme class + CSS variables
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FluentProvider.useEffect": ()=>{
            const root = document.documentElement;
            root.setAttribute('data-theme', settings.theme);
            root.style.setProperty('--user-font-size', `${settings.fontSize}px`);
            root.style.setProperty('--user-line-height', `${settings.lineHeight}`);
            root.style.setProperty('--user-letter-spacing', `${settings.letterSpacing}px`);
            if (settings.reducedMotion) root.classList.add('reduce-motion');
            else root.classList.remove('reduce-motion');
            if (settings.fontFamily === 'opendyslexic') root.classList.add('font-dyslexic');
            else root.classList.remove('font-dyslexic');
        }
    }["FluentProvider.useEffect"], [
        settings
    ]);
    const updateSetting = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FluentProvider.useCallback[updateSetting]": (key, value)=>{
            setSettings({
                "FluentProvider.useCallback[updateSetting]": (prev)=>({
                        ...prev,
                        [key]: value
                    })
            }["FluentProvider.useCallback[updateSetting]"]);
        }
    }["FluentProvider.useCallback[updateSetting]"], []);
    const resetSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FluentProvider.useCallback[resetSettings]": ()=>setSettings(DEFAULT_SETTINGS)
    }["FluentProvider.useCallback[resetSettings]"], []);
    // ── Output management ─────────────────────────────────
    const appendOutput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FluentProvider.useCallback[appendOutput]": (t)=>{
            setOutputState({
                "FluentProvider.useCallback[appendOutput]": (prev)=>{
                    const newText = prev.text + t;
                    const newHistory = [
                        ...prev.history.slice(0, prev.historyIndex + 1),
                        newText
                    ];
                    return {
                        text: newText,
                        history: newHistory,
                        historyIndex: newHistory.length - 1
                    };
                }
            }["FluentProvider.useCallback[appendOutput]"]);
        }
    }["FluentProvider.useCallback[appendOutput]"], []);
    const setOutputText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FluentProvider.useCallback[setOutputText]": (t)=>{
            setOutputState({
                "FluentProvider.useCallback[setOutputText]": (prev)=>{
                    const newHistory = [
                        ...prev.history.slice(0, prev.historyIndex + 1),
                        t
                    ];
                    return {
                        text: t,
                        history: newHistory,
                        historyIndex: newHistory.length - 1
                    };
                }
            }["FluentProvider.useCallback[setOutputText]"]);
        }
    }["FluentProvider.useCallback[setOutputText]"], []);
    const clearOutput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FluentProvider.useCallback[clearOutput]": ()=>{
            setOutputState({
                "FluentProvider.useCallback[clearOutput]": (prev)=>{
                    const newHistory = [
                        ...prev.history.slice(0, prev.historyIndex + 1),
                        ''
                    ];
                    return {
                        text: '',
                        history: newHistory,
                        historyIndex: newHistory.length - 1
                    };
                }
            }["FluentProvider.useCallback[clearOutput]"]);
        }
    }["FluentProvider.useCallback[clearOutput]"], []);
    const undoOutput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FluentProvider.useCallback[undoOutput]": ()=>{
            setOutputState({
                "FluentProvider.useCallback[undoOutput]": (prev)=>{
                    if (prev.historyIndex <= 0) return prev;
                    const idx = prev.historyIndex - 1;
                    return {
                        ...prev,
                        text: prev.history[idx],
                        historyIndex: idx
                    };
                }
            }["FluentProvider.useCallback[undoOutput]"]);
        }
    }["FluentProvider.useCallback[undoOutput]"], []);
    const redoOutput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FluentProvider.useCallback[redoOutput]": ()=>{
            setOutputState({
                "FluentProvider.useCallback[redoOutput]": (prev)=>{
                    if (prev.historyIndex >= prev.history.length - 1) return prev;
                    const idx = prev.historyIndex + 1;
                    return {
                        ...prev,
                        text: prev.history[idx],
                        historyIndex: idx
                    };
                }
            }["FluentProvider.useCallback[redoOutput]"]);
        }
    }["FluentProvider.useCallback[redoOutput]"], []);
    // ── TTS ───────────────────────────────────────────────
    const speak = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FluentProvider.useCallback[speak]": (text)=>{
            const t = text || output.text;
            if (!t || ("TURBOPACK compile-time value", "object") === 'undefined') return;
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(t);
            u.rate = settings.ttsSpeed;
            u.pitch = settings.ttsPitch;
            if (settings.ttsVoice) {
                const voice = window.speechSynthesis.getVoices().find({
                    "FluentProvider.useCallback[speak].voice": (v)=>v.name === settings.ttsVoice
                }["FluentProvider.useCallback[speak].voice"]);
                if (voice) u.voice = voice;
            }
            u.onend = ({
                "FluentProvider.useCallback[speak]": ()=>setIsSpeaking(false)
            })["FluentProvider.useCallback[speak]"];
            u.onerror = ({
                "FluentProvider.useCallback[speak]": ()=>setIsSpeaking(false)
            })["FluentProvider.useCallback[speak]"];
            setIsSpeaking(true);
            window.speechSynthesis.speak(u);
        }
    }["FluentProvider.useCallback[speak]"], [
        output.text,
        settings.ttsSpeed,
        settings.ttsPitch,
        settings.ttsVoice
    ]);
    const stopSpeaking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FluentProvider.useCallback[stopSpeaking]": ()=>{
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }["FluentProvider.useCallback[stopSpeaking]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FluentContext.Provider, {
        value: {
            settings,
            updateSetting,
            resetSettings,
            output,
            appendOutput,
            setOutput: setOutputText,
            clearOutput,
            undoOutput,
            redoOutput,
            speak,
            stopSpeaking,
            isSpeaking,
            sidebarOpen,
            setSidebarOpen
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/fluent-context.tsx",
        lineNumber: 186,
        columnNumber: 9
    }, this);
}
_s1(FluentProvider, "XT2JRLu2oj0+GZY0XQd9n+FDQHc=");
_c = FluentProvider;
var _c;
__turbopack_context__.k.register(_c, "FluentProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/use-electron.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "executeOnDesktop",
    ()=>executeOnDesktop,
    "triggerElectronSOS",
    ()=>triggerElectronSOS,
    "useElectron",
    ()=>useElectron,
    "useElectronShortcuts",
    ()=>useElectronShortcuts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useElectron() {
    const isElectron = ("TURBOPACK compile-time value", "object") !== 'undefined' && window.isElectron;
    return {
        isElectron,
        electron: isElectron ? window.electron : null
    };
}
function useElectronShortcuts(callbacks) {
    _s();
    const { isElectron, electron } = useElectron();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useElectronShortcuts.useEffect": ()=>{
            if (!isElectron || !electron) return;
            if (callbacks.onSOS) {
                electron.onTriggerSOS(callbacks.onSOS);
            }
            if (callbacks.onToggleSidebar) {
                electron.onToggleSidebar(callbacks.onToggleSidebar);
            }
            if (callbacks.onFocusOutput) {
                electron.onFocusOutput(callbacks.onFocusOutput);
            }
            if (callbacks.onSpeakOutput) {
                electron.onSpeakOutput(callbacks.onSpeakOutput);
            }
            return ({
                "useElectronShortcuts.useEffect": ()=>{
                    electron.removeAllListeners('trigger-sos');
                    electron.removeAllListeners('toggle-sidebar');
                    electron.removeAllListeners('focus-output');
                    electron.removeAllListeners('speak-output');
                }
            })["useElectronShortcuts.useEffect"];
        }
    }["useElectronShortcuts.useEffect"], [
        isElectron,
        electron,
        callbacks
    ]);
}
_s(useElectronShortcuts, "lZeXcY3VXtDyHgi96OXVFXC1Guo=", false, function() {
    return [
        useElectron
    ];
});
async function executeOnDesktop(command) {
    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.electron) {
        return await window.electron.executeOnDesktop(command);
    }
    console.warn('Not running in Electron - desktop execution not available');
    return {
        success: false,
        message: 'Not running in Electron'
    };
}
async function triggerElectronSOS(data) {
    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.electron) {
        return await window.electron.triggerSOS(data);
    }
    return {
        success: false
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0', {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-10 px-4 py-2',
            sm: 'h-9 rounded-md px-3',
            lg: 'h-11 rounded-md px-8',
            icon: 'h-10 w-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/button.tsx",
        lineNumber: 47,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = 'Button';
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OutputPanel",
    ()=>OutputPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/fluent-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$use$2d$electron$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/use-electron.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-client] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/volume-x.js [app-client] (ecmascript) <export default as VolumeX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/undo-2.js [app-client] (ecmascript) <export default as Undo2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Redo2$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/redo-2.js [app-client] (ecmascript) <export default as Redo2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/terminal.js [app-client] (ecmascript) <export default as Terminal>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function OutputPanel() {
    _s();
    const { output, clearOutput, undoOutput, redoOutput, speak, stopSpeaking, isSpeaking } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFluentContext"])();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const wordCount = output.text.trim() ? output.text.trim().split(/\s+/).length : 0;
    const charCount = output.text.length;
    const copyToClipboard = async ()=>{
        if (!output.text) return;
        try {
            await navigator.clipboard.writeText(output.text);
        } catch  {}
    };
    const handleExecute = async ()=>{
        if (!output.text) return;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$use$2d$electron$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["executeOnDesktop"])(output.text);
        console.log('Desktop execution result:', result);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border-t-4 border-border bg-card flex-shrink-0",
        role: "region",
        "aria-label": "Output panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setExpanded(!expanded),
                className: "w-full flex items-center justify-between px-4 py-2 hover:bg-muted transition-colors",
                "aria-expanded": expanded,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"], {
                                className: "h-4 w-4 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                lineNumber: 41,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-bold text-sm",
                                children: "Output"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                lineNumber: 42,
                                columnNumber: 21
                            }, this),
                            output.text && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-muted-foreground",
                                children: [
                                    wordCount,
                                    " words · ",
                                    charCount,
                                    " chars"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                lineNumber: 44,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                        lineNumber: 40,
                        columnNumber: 17
                    }, this),
                    expanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                        lineNumber: 49,
                        columnNumber: 29
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                        lineNumber: 49,
                        columnNumber: 67
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                lineNumber: 35,
                columnNumber: 13
            }, this),
            expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-3 space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-h-[60px] max-h-[150px] overflow-y-auto rounded-lg border-2 border-border bg-input p-3 text-sm font-medium",
                        children: output.text || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-muted-foreground italic",
                            children: "No text yet — use an input mode to start"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                            lineNumber: 57,
                            columnNumber: 41
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                        lineNumber: 56,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                onClick: ()=>isSpeaking ? stopSpeaking() : speak(),
                                disabled: !output.text,
                                className: "gap-1.5 font-bold text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all",
                                "aria-label": isSpeaking ? 'Stop speaking' : 'Speak text aloud',
                                children: [
                                    isSpeaking ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__["VolumeX"], {
                                        className: "h-3.5 w-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                        lineNumber: 69,
                                        columnNumber: 43
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                                        className: "h-3.5 w-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                        lineNumber: 69,
                                        columnNumber: 81
                                    }, this),
                                    isSpeaking ? 'Stop' : 'Speak'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                lineNumber: 62,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                variant: "outline",
                                onClick: copyToClipboard,
                                disabled: !output.text,
                                className: "gap-1.5 font-bold text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all",
                                "aria-label": "Copy text to clipboard",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                        className: "h-3.5 w-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                        lineNumber: 80,
                                        columnNumber: 29
                                    }, this),
                                    " Copy"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                lineNumber: 73,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                variant: "outline",
                                onClick: undoOutput,
                                disabled: output.historyIndex <= 0,
                                className: "gap-1.5 font-bold text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all",
                                "aria-label": "Undo",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__["Undo2"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                    lineNumber: 90,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                lineNumber: 83,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                variant: "outline",
                                onClick: redoOutput,
                                disabled: output.historyIndex >= output.history.length - 1,
                                className: "gap-1.5 font-bold text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all",
                                "aria-label": "Redo",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Redo2$3e$__["Redo2"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                    lineNumber: 100,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                lineNumber: 93,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                lineNumber: 103,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                variant: "outline",
                                onClick: handleExecute,
                                disabled: !output.text,
                                className: "gap-1.5 font-bold text-xs border-2 border-border bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all",
                                "aria-label": "Execute on desktop",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                        className: "h-3.5 w-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                        lineNumber: 112,
                                        columnNumber: 29
                                    }, this),
                                    " Execute"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                lineNumber: 105,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                variant: "outline",
                                onClick: clearOutput,
                                disabled: !output.text,
                                className: "gap-1.5 font-bold text-xs border-2 border-border text-destructive shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all",
                                "aria-label": "Clear all text",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        className: "h-3.5 w-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                        lineNumber: 122,
                                        columnNumber: 29
                                    }, this),
                                    " Clear"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                                lineNumber: 115,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                        lineNumber: 61,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
                lineNumber: 54,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx",
        lineNumber: 33,
        columnNumber: 9
    }, this);
}
_s(OutputPanel, "Uhg9R85H109ZjH3BDR+GIX848Yk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFluentContext"]
    ];
});
_c = OutputPanel;
var _c;
__turbopack_context__.k.register(_c, "OutputPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/sos-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SOSButton",
    ()=>SOSButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/shield-alert.js [app-client] (ecmascript) <export default as ShieldAlert>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function SOSButton({ compact }) {
    _s();
    const [triggered, setTriggered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [confirmOpen, setConfirmOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const triggerSOS = ()=>{
        setConfirmOpen(true);
    };
    const confirmSOS = ()=>{
        setTriggered(true);
        setConfirmOpen(false);
        // In production: send emergency message to contacts
        // For now, show alert and vibrate if available
        if (navigator.vibrate) navigator.vibrate([
            200,
            100,
            200,
            100,
            200
        ]);
        setTimeout(()=>setTriggered(false), 5000);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: triggerSOS,
                className: `flex items-center gap-2 w-full px-3 py-2.5 rounded-lg font-black text-sm transition-all ${triggered ? 'bg-destructive text-destructive-foreground animate-pulse' : 'bg-destructive/90 text-destructive-foreground hover:bg-destructive shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]'}`,
                "aria-label": "Emergency SOS",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                        className: "h-5 w-5 flex-shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/sos-button.tsx",
                        lineNumber: 37,
                        columnNumber: 17
                    }, this),
                    !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: triggered ? 'SOS SENT' : 'SOS'
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/sos-button.tsx",
                        lineNumber: 38,
                        columnNumber: 30
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/sos-button.tsx",
                lineNumber: 29,
                columnNumber: 13
            }, this),
            confirmOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-full left-0 right-0 mb-2 p-3 bg-card border-4 border-destructive rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-bold mb-2",
                        children: "Send emergency alert?"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/sos-button.tsx",
                        lineNumber: 44,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: confirmSOS,
                                className: "flex-1 py-1.5 bg-destructive text-destructive-foreground rounded-lg font-bold text-xs border-2 border-border",
                                children: "Send SOS"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/sos-button.tsx",
                                lineNumber: 46,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setConfirmOpen(false),
                                className: "flex-1 py-1.5 bg-muted text-foreground rounded-lg font-bold text-xs border-2 border-border",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/sos-button.tsx",
                                lineNumber: 52,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/sos-button.tsx",
                        lineNumber: 45,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/sos-button.tsx",
                lineNumber: 43,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/sos-button.tsx",
        lineNumber: 28,
        columnNumber: 9
    }, this);
}
_s(SOSButton, "s7jnPdquR+pFRntvLc4kcrn1IAw=");
_c = SOSButton;
var _c;
__turbopack_context__.k.register(_c, "SOSButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppShell",
    ()=>AppShell,
    "INPUT_MODES",
    ()=>INPUT_MODES
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/fluent-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$output$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/output-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$sos$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/sos-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/mic.js [app-client] (ecmascript) <export default as Mic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hand$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hand$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/hand.js [app-client] (ecmascript) <export default as Hand>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/keyboard.js [app-client] (ecmascript) <export default as Keyboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$accessibility$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Accessibility$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/accessibility.js [app-client] (ecmascript) <export default as Accessibility>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Move$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/move.js [app-client] (ecmascript) <export default as Move>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smile$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smile$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/smile.js [app-client] (ecmascript) <export default as Smile>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/wind.js [app-client] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleLeft$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/toggle-left.js [app-client] (ecmascript) <export default as ToggleLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-client] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftClose$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/panel-left-close.js [app-client] (ecmascript) <export default as PanelLeftClose>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeft$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/panel-left.js [app-client] (ecmascript) <export default as PanelLeft>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const INPUT_MODES = [
    {
        id: 'voice',
        label: 'Voice',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"],
        href: '/input/voice',
        color: 'bg-blue-500'
    },
    {
        id: 'draw',
        label: 'Draw',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"],
        href: '/input/draw',
        color: 'bg-orange-500'
    },
    {
        id: 'haptic',
        label: 'Haptic',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hand$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hand$3e$__["Hand"],
        href: '/input/haptic',
        color: 'bg-purple-500'
    },
    {
        id: 'type',
        label: 'Type',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__["Keyboard"],
        href: '/input/type',
        color: 'bg-green-500'
    },
    {
        id: 'sign',
        label: 'Sign',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$accessibility$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Accessibility$3e$__["Accessibility"],
        href: '/input/sign',
        color: 'bg-pink-500'
    },
    {
        id: 'eye-gaze',
        label: 'Eye Gaze',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"],
        href: '/input/eye-gaze',
        color: 'bg-cyan-500'
    },
    {
        id: 'head-motion',
        label: 'Head',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Move$3e$__["Move"],
        href: '/input/head-motion',
        color: 'bg-amber-500'
    },
    {
        id: 'facial',
        label: 'Facial',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smile$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smile$3e$__["Smile"],
        href: '/input/facial',
        color: 'bg-rose-500'
    },
    {
        id: 'sip-puff',
        label: 'Sip/Puff',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"],
        href: '/input/sip-puff',
        color: 'bg-teal-500'
    },
    {
        id: 'switch',
        label: 'Switch',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleLeft$3e$__["ToggleLeft"],
        href: '/input/switch',
        color: 'bg-indigo-500'
    },
    {
        id: 'board',
        label: 'Board',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"],
        href: '/input/communication-board',
        color: 'bg-yellow-600'
    },
    {
        id: 'custom',
        label: 'Custom',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
        href: '/input/custom',
        color: 'bg-violet-500'
    }
];
function AppShell({ children }) {
    _s();
    const { sidebarOpen, setSidebarOpen } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFluentContext"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: `flex flex-col border-r-4 border-border bg-[hsl(var(--sidebar-bg))] transition-all duration-200 flex-shrink-0 ${sidebarOpen ? 'w-56' : 'w-16'}`,
                role: "navigation",
                "aria-label": "Main navigation",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between p-3 border-b-4 border-border",
                        children: [
                            sidebarOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "font-black text-lg text-foreground tracking-tight",
                                children: "Fluent"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                                lineNumber: 46,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSidebarOpen(!sidebarOpen),
                                className: "p-2 rounded-lg hover:bg-muted transition-colors",
                                "aria-label": sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar',
                                children: sidebarOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftClose$3e$__["PanelLeftClose"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                                    lineNumber: 55,
                                    columnNumber: 40
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeft$3e$__["PanelLeft"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                                    lineNumber: 55,
                                    columnNumber: 81
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                                lineNumber: 50,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                        lineNumber: 44,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: `flex items-center gap-3 px-3 py-2.5 mx-2 mt-2 rounded-lg font-bold text-sm transition-all ${pathname === '/' ? 'bg-primary text-primary-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'hover:bg-muted text-foreground'}`,
                        "aria-current": pathname === '/' ? 'page' : undefined,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                className: "h-5 w-5 flex-shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                                lineNumber: 68,
                                columnNumber: 21
                            }, this),
                            sidebarOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                                lineNumber: 69,
                                columnNumber: 37
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                        lineNumber: 60,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto px-2 py-2 space-y-0.5",
                        role: "list",
                        "aria-label": "Input modes",
                        children: INPUT_MODES.map((mode)=>{
                            const Icon = mode.icon;
                            const isActive = pathname.startsWith(mode.href);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: mode.href,
                                role: "listitem",
                                className: `flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${isActive ? 'bg-primary text-primary-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'hover:bg-muted text-foreground'}`,
                                "aria-current": isActive ? 'page' : undefined,
                                title: mode.label,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        className: "h-4 w-4 flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                                        lineNumber: 89,
                                        columnNumber: 33
                                    }, this),
                                    sidebarOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: mode.label
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                                        lineNumber: 90,
                                        columnNumber: 49
                                    }, this)
                                ]
                            }, mode.id, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                                lineNumber: 78,
                                columnNumber: 29
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                        lineNumber: 73,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-t-4 border-border p-2 space-y-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/settings",
                                className: `flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${pathname === '/settings' ? 'bg-primary text-primary-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'hover:bg-muted text-foreground'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                        className: "h-4 w-4 flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                                        lineNumber: 105,
                                        columnNumber: 25
                                    }, this),
                                    sidebarOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Settings"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                                        lineNumber: 106,
                                        columnNumber: 41
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                                lineNumber: 98,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$sos$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOSButton"], {
                                compact: !sidebarOpen
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                                lineNumber: 108,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                        lineNumber: 97,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                lineNumber: 37,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 overflow-y-auto p-6",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                        lineNumber: 114,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$output$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OutputPanel"], {}, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                        lineNumber: 115,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
                lineNumber: 113,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx",
        lineNumber: 35,
        columnNumber: 9
    }, this);
}
_s(AppShell, "Q9DHZSOO5Wa7jgRb07jxvQPoyoc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFluentContext"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AppShell;
;
var _c;
__turbopack_context__.k.register(_c, "AppShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/client-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientLayout",
    ()=>ClientLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/fluent-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$app$2d$shell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function ClientLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FluentProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$app$2d$shell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppShell"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/client-layout.tsx",
            lineNumber: 10,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/client-layout.tsx",
        lineNumber: 9,
        columnNumber: 9
    }, this);
}
_c = ClientLayout;
var _c;
__turbopack_context__.k.register(_c, "ClientLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_GitHub_ntu-beyond-binary_frontend_84f12571._.js.map