(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/adaptive-engine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Adaptive Intelligence Engine — tracks usage patterns and suggests optimal modes
__turbopack_context__.s([
    "getFrequentPhrases",
    ()=>getFrequentPhrases,
    "getModeStats",
    ()=>getModeStats,
    "getSuggestion",
    ()=>getSuggestion,
    "recordInput",
    ()=>recordInput,
    "resetAdaptive",
    ()=>resetAdaptive
]);
const STORAGE_KEY = 'fluent-adaptive';
function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch  {}
    return {
        modeStats: {},
        frequentPhrases: [],
        frustrationLevel: 0,
        sessionStartTime: Date.now(),
        totalInputsThisSession: 0
    };
}
function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch  {}
}
function recordInput(mode, success, durationMs, outputText) {
    const state = loadState();
    // Update mode stats
    if (!state.modeStats[mode]) {
        state.modeStats[mode] = {
            mode,
            totalInputs: 0,
            successfulInputs: 0,
            avgSpeed: 0,
            lastUsed: 0,
            recentErrors: 0,
            trend: 'stable'
        };
    }
    const stats = state.modeStats[mode];
    stats.totalInputs++;
    if (success) stats.successfulInputs++;
    else stats.recentErrors++;
    // Rolling average speed
    stats.avgSpeed = stats.avgSpeed === 0 ? durationMs : stats.avgSpeed * 0.8 + durationMs * 0.2;
    stats.lastUsed = Date.now();
    // Trend detection
    const accuracy = stats.successfulInputs / stats.totalInputs;
    if (accuracy > 0.85) stats.trend = 'improving';
    else if (accuracy > 0.6) stats.trend = 'stable';
    else stats.trend = 'declining';
    // Frustration: consecutive failures increase it
    if (!success) state.frustrationLevel = Math.min(100, state.frustrationLevel + 25);
    else state.frustrationLevel = Math.max(0, state.frustrationLevel - 10);
    // Track phrases
    if (outputText && outputText.length > 3) {
        const existing = state.frequentPhrases.find((p)=>p.text === outputText);
        if (existing) existing.count++;
        else state.frequentPhrases.push({
            text: outputText,
            count: 1
        });
        state.frequentPhrases.sort((a, b)=>b.count - a.count);
        state.frequentPhrases = state.frequentPhrases.slice(0, 20); // keep top 20
    }
    state.totalInputsThisSession++;
    saveState(state);
}
function getSuggestion() {
    const state = loadState();
    // Check frustration
    if (state.frustrationLevel >= 75) {
        // Find best performing mode
        const modes = Object.values(state.modeStats);
        const best = modes.sort((a, b)=>{
            const accA = a.successfulInputs / (a.totalInputs || 1);
            const accB = b.successfulInputs / (b.totalInputs || 1);
            return accB - accA;
        })[0];
        if (best) {
            return {
                type: 'switch_mode',
                message: `Having trouble? Try switching to ${best.mode} — your accuracy is ${Math.round(best.successfulInputs / best.totalInputs * 100)}% there.`,
                suggestedMode: best.mode
            };
        }
        return {
            type: 'take_break',
            message: 'It seems like things are tricky right now. Take a short break?'
        };
    }
    // Check session fatigue
    const sessionMinutes = (Date.now() - state.sessionStartTime) / 60000;
    if (sessionMinutes > 45 && state.totalInputsThisSession > 50) {
        return {
            type: 'take_break',
            message: 'You\'ve been working for a while. A short break can help!'
        };
    }
    return {
        type: 'none',
        message: ''
    };
}
function getFrequentPhrases() {
    const state = loadState();
    return state.frequentPhrases.slice(0, 8).map((p)=>p.text);
}
function getModeStats() {
    const state = loadState();
    return Object.values(state.modeStats).sort((a, b)=>b.lastUsed - a.lastUsed);
}
function resetAdaptive() {
    localStorage.removeItem(STORAGE_KEY);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModePageLayout",
    ()=>ModePageLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-client] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function ModePageLayout({ title, description, icon, color, children, helpContent }) {
    _s();
    const [showHelp, setShowHelp] = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-4xl mx-auto space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            className: "border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all font-bold",
                            "aria-label": "Back to dashboard",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx",
                                lineNumber: 31,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx",
                            lineNumber: 25,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx",
                        lineNumber: 24,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-2 rounded-xl border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${color || 'bg-primary'}`,
                                        children: icon
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx",
                                        lineNumber: 37,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-2xl md:text-3xl font-black text-foreground",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx",
                                        lineNumber: 40,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx",
                                lineNumber: 36,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-muted-foreground",
                                children: description
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx",
                                lineNumber: 42,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx",
                        lineNumber: 35,
                        columnNumber: 17
                    }, this),
                    helpContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        size: "sm",
                        onClick: ()=>setShowHelp(!showHelp),
                        className: "border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all font-bold",
                        "aria-label": "Show help",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx",
                            lineNumber: 53,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx",
                        lineNumber: 46,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx",
                lineNumber: 23,
                columnNumber: 13
            }, this),
            showHelp && helpContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-card border-4 border-border rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm font-medium",
                    children: helpContent
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx",
                    lineNumber: 61,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx",
                lineNumber: 60,
                columnNumber: 17
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx",
        lineNumber: 21,
        columnNumber: 9
    }, this);
}
_s(ModePageLayout, "wYMdefTmvEYZthPPLsoVGi/6W5g=");
_c = ModePageLayout;
var _c;
__turbopack_context__.k.register(_c, "ModePageLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/on-screen-keyboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OnScreenKeyboard",
    ()=>OnScreenKeyboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$delete$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Delete$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/delete.js [app-client] (ecmascript) <export default as Delete>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$corner$2d$down$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CornerDownLeft$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/corner-down-left.js [app-client] (ecmascript) <export default as CornerDownLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$space$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Space$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/space.js [app-client] (ecmascript) <export default as Space>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const QWERTY_ROWS = [
    [
        'Q',
        'W',
        'E',
        'R',
        'T',
        'Y',
        'U',
        'I',
        'O',
        'P'
    ],
    [
        'A',
        'S',
        'D',
        'F',
        'G',
        'H',
        'J',
        'K',
        'L'
    ],
    [
        'Z',
        'X',
        'C',
        'V',
        'B',
        'N',
        'M'
    ]
];
const ALPHA_ROWS = [
    [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G'
    ],
    [
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N'
    ],
    [
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U'
    ],
    [
        'V',
        'W',
        'X',
        'Y',
        'Z'
    ]
];
function OnScreenKeyboard({ onKeyPress, mode = 'click', dwellTime = 1200, scanSpeed = 1500, layout = 'qwerty', className = '' }) {
    _s();
    const rows = layout === 'qwerty' ? QWERTY_ROWS : ALPHA_ROWS;
    const [hoveredKey, setHoveredKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dwellProgress, setDwellProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [scanIndex, setScanIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const dwellTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dwellStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const allKeys = rows.flat().concat([
        'SPACE',
        'BACKSPACE',
        'ENTER'
    ]);
    // Dwell-click mode
    const handleMouseEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OnScreenKeyboard.useCallback[handleMouseEnter]": (key)=>{
            if (mode !== 'dwell') return;
            setHoveredKey(key);
            dwellStart.current = Date.now();
            setDwellProgress(0);
            const tick = {
                "OnScreenKeyboard.useCallback[handleMouseEnter].tick": ()=>{
                    const elapsed = Date.now() - dwellStart.current;
                    const progress = Math.min(elapsed / dwellTime, 1);
                    setDwellProgress(progress);
                    if (progress >= 1) {
                        onKeyPress(key === 'SPACE' ? ' ' : key === 'BACKSPACE' ? '\b' : key === 'ENTER' ? '\n' : key);
                        setDwellProgress(0);
                        dwellStart.current = Date.now();
                    } else {
                        dwellTimer.current = setTimeout(tick, 50);
                    }
                }
            }["OnScreenKeyboard.useCallback[handleMouseEnter].tick"];
            dwellTimer.current = setTimeout(tick, 50);
        }
    }["OnScreenKeyboard.useCallback[handleMouseEnter]"], [
        mode,
        dwellTime,
        onKeyPress
    ]);
    const handleMouseLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OnScreenKeyboard.useCallback[handleMouseLeave]": ()=>{
            if (dwellTimer.current) clearTimeout(dwellTimer.current);
            setHoveredKey(null);
            setDwellProgress(0);
        }
    }["OnScreenKeyboard.useCallback[handleMouseLeave]"], []);
    // Switch scanning mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OnScreenKeyboard.useEffect": ()=>{
            if (mode !== 'scan') return;
            const interval = setInterval({
                "OnScreenKeyboard.useEffect.interval": ()=>{
                    setScanIndex({
                        "OnScreenKeyboard.useEffect.interval": (prev)=>(prev + 1) % allKeys.length
                    }["OnScreenKeyboard.useEffect.interval"]);
                }
            }["OnScreenKeyboard.useEffect.interval"], scanSpeed);
            return ({
                "OnScreenKeyboard.useEffect": ()=>clearInterval(interval)
            })["OnScreenKeyboard.useEffect"];
        }
    }["OnScreenKeyboard.useEffect"], [
        mode,
        scanSpeed,
        allKeys.length
    ]);
    // Spacebar selects in scan mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OnScreenKeyboard.useEffect": ()=>{
            if (mode !== 'scan') return;
            const handler = {
                "OnScreenKeyboard.useEffect.handler": (e)=>{
                    if (e.code === 'Space' || e.code === 'Enter') {
                        e.preventDefault();
                        const key = allKeys[scanIndex];
                        onKeyPress(key === 'SPACE' ? ' ' : key === 'BACKSPACE' ? '\b' : key === 'ENTER' ? '\n' : key);
                    }
                }
            }["OnScreenKeyboard.useEffect.handler"];
            window.addEventListener('keydown', handler);
            return ({
                "OnScreenKeyboard.useEffect": ()=>window.removeEventListener('keydown', handler)
            })["OnScreenKeyboard.useEffect"];
        }
    }["OnScreenKeyboard.useEffect"], [
        mode,
        scanIndex,
        allKeys,
        onKeyPress
    ]);
    const handleClick = (key)=>{
        if (mode !== 'click') return;
        onKeyPress(key === 'SPACE' ? ' ' : key === 'BACKSPACE' ? '\b' : key === 'ENTER' ? '\n' : key);
    };
    const flatIndex = (key)=>allKeys.indexOf(key);
    const keyStyle = (key)=>{
        const isScanned = mode === 'scan' && flatIndex(key) === scanIndex;
        const isDwelling = mode === 'dwell' && hoveredKey === key;
        return `relative font-bold text-sm border-2 border-border rounded-lg transition-all
      ${isScanned ? 'bg-primary text-primary-foreground scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-card hover:bg-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}
      ${isDwelling ? 'ring-2 ring-primary' : ''}
      min-w-[40px] min-h-[40px] p-2 flex items-center justify-center cursor-pointer
      hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `space-y-2 ${className}`,
        role: "group",
        "aria-label": "On-screen keyboard",
        children: [
            rows.map((row, ri)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center gap-1.5",
                    children: row.map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: keyStyle(key),
                            onClick: ()=>handleClick(key),
                            onMouseEnter: ()=>handleMouseEnter(key),
                            onMouseLeave: handleMouseLeave,
                            "aria-label": key,
                            children: [
                                key,
                                mode === 'dwell' && hoveredKey === key && dwellProgress > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-0 left-0 h-1 bg-primary rounded-b-lg transition-all",
                                    style: {
                                        width: `${dwellProgress * 100}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/on-screen-keyboard.tsx",
                                    lineNumber: 123,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, key, true, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/on-screen-keyboard.tsx",
                            lineNumber: 113,
                            columnNumber: 25
                        }, this))
                }, ri, false, {
                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/on-screen-keyboard.tsx",
                    lineNumber: 111,
                    columnNumber: 17
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `${keyStyle('BACKSPACE')} px-4`,
                        onClick: ()=>handleClick('BACKSPACE'),
                        onMouseEnter: ()=>handleMouseEnter('BACKSPACE'),
                        onMouseLeave: handleMouseLeave,
                        "aria-label": "Backspace",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$delete$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Delete$3e$__["Delete"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/on-screen-keyboard.tsx",
                            lineNumber: 141,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/on-screen-keyboard.tsx",
                        lineNumber: 134,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `${keyStyle('SPACE')} flex-1 max-w-[200px]`,
                        onClick: ()=>handleClick('SPACE'),
                        onMouseEnter: ()=>handleMouseEnter('SPACE'),
                        onMouseLeave: handleMouseLeave,
                        "aria-label": "Space",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$space$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Space$3e$__["Space"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/on-screen-keyboard.tsx",
                            lineNumber: 150,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/on-screen-keyboard.tsx",
                        lineNumber: 143,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `${keyStyle('ENTER')} px-4`,
                        onClick: ()=>handleClick('ENTER'),
                        onMouseEnter: ()=>handleMouseEnter('ENTER'),
                        onMouseLeave: handleMouseLeave,
                        "aria-label": "Enter",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$corner$2d$down$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CornerDownLeft$3e$__["CornerDownLeft"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/on-screen-keyboard.tsx",
                            lineNumber: 159,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/on-screen-keyboard.tsx",
                        lineNumber: 152,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/on-screen-keyboard.tsx",
                lineNumber: 133,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/on-screen-keyboard.tsx",
        lineNumber: 109,
        columnNumber: 9
    }, this);
}
_s(OnScreenKeyboard, "vQDtSu4K2XZsquN3gdY8APESR0A=");
_c = OnScreenKeyboard;
var _c;
__turbopack_context__.k.register(_c, "OnScreenKeyboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('rounded-lg border bg-card text-card-foreground shadow-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx",
        lineNumber: 9,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = 'Card';
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col space-y-1.5 p-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = 'CardHeader';
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-2xl font-semibold leading-none tracking-tight', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx",
        lineNumber: 36,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = 'CardTitle';
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sm text-muted-foreground', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx",
        lineNumber: 51,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardDescription;
CardDescription.displayName = 'CardDescription';
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('p-6 pt-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx",
        lineNumber: 63,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardContent;
CardContent.displayName = 'CardContent';
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center p-6 pt-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx",
        lineNumber: 71,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CardFooter;
CardFooter.displayName = 'CardFooter';
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EyeGazePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/fluent-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$adaptive$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/adaptive-engine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$mode$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$on$2d$screen$2d$keyboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/on-screen-keyboard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-client] (ecmascript) <export default as Settings2>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function EyeGazePage() {
    _s();
    const { appendOutput, settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFluentContext"])();
    const [typedText, setTypedText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [dwellTime, setDwellTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(settings.dwellTime);
    const [layout, setLayout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('qwerty');
    const handleKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EyeGazePage.useCallback[handleKey]": (key)=>{
            if (key === '\b') {
                setTypedText({
                    "EyeGazePage.useCallback[handleKey]": (prev)=>prev.slice(0, -1)
                }["EyeGazePage.useCallback[handleKey]"]);
            } else if (key === '\n') {
                appendOutput(typedText + ' ');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$adaptive$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recordInput"])('eye-gaze', true, typedText.length * dwellTime, typedText);
                setTypedText('');
            } else {
                setTypedText({
                    "EyeGazePage.useCallback[handleKey]": (prev)=>prev + key
                }["EyeGazePage.useCallback[handleKey]"]);
            }
        }
    }["EyeGazePage.useCallback[handleKey]"], [
        appendOutput,
        typedText,
        dwellTime
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$mode$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ModePageLayout"], {
        title: "Eye Gaze",
        description: "Look at keys to type. Dwell on a key to select it. Mocked with mouse hover.",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
            className: "h-6 w-6 text-white"
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
            lineNumber: 33,
            columnNumber: 19
        }, void 0),
        color: "bg-cyan-500",
        helpContent: "Hover over a key and hold still. After the dwell time, the key will be selected. Adjust dwell time below. In production, this uses webcam-based eye tracking.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__["Settings2"], {
                                        className: "h-4 w-4 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                                        lineNumber: 42,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs font-bold",
                                        children: "Dwell Time:"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                                        lineNumber: 43,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: 400,
                                        max: 3000,
                                        step: 100,
                                        value: dwellTime,
                                        onChange: (e)=>setDwellTime(Number(e.target.value)),
                                        className: "w-32",
                                        "aria-label": "Dwell time"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                                        lineNumber: 44,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold text-muted-foreground",
                                        children: [
                                            dwellTime,
                                            "ms"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                                        lineNumber: 50,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                                lineNumber: 41,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs font-bold",
                                        children: "Layout:"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                                        lineNumber: 53,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: layout,
                                        onChange: (e)=>setLayout(e.target.value),
                                        className: "bg-input border-2 border-border rounded-lg px-2 py-1 font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "qwerty",
                                                children: "QWERTY"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                                                lineNumber: 59,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "alphabetical",
                                                children: "A-Z"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                                                lineNumber: 60,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                                        lineNumber: 54,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                                lineNumber: 52,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                        lineNumber: 40,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                    lineNumber: 39,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-bold text-muted-foreground mb-1",
                            children: "Preview:"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                            lineNumber: 68,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-lg font-medium min-h-[28px]",
                            children: [
                                typedText || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-muted-foreground",
                                    children: "Hover over keys to type..."
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                                    lineNumber: 70,
                                    columnNumber: 39
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "animate-pulse",
                                    children: "|"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                                    lineNumber: 71,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                            lineNumber: 69,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                    lineNumber: 67,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$on$2d$screen$2d$keyboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OnScreenKeyboard"], {
                        onKeyPress: handleKey,
                        mode: "dwell",
                        dwellTime: dwellTime,
                        layout: layout
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                        lineNumber: 77,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                    lineNumber: 76,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs font-medium text-center text-muted-foreground",
                    children: "💡 In this demo, mouse hover simulates eye gaze. In production, webcam-based eye tracking is used."
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
                    lineNumber: 85,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
            lineNumber: 37,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/eye-gaze/page.tsx",
        lineNumber: 30,
        columnNumber: 9
    }, this);
}
_s(EyeGazePage, "KRtm2DEKyI4y7V2abeS7Hvq3DQ4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFluentContext"]
    ];
});
_c = EyeGazePage;
var _c;
__turbopack_context__.k.register(_c, "EyeGazePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ArrowLeft
]);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m12 19-7-7 7-7",
            key: "1l729n"
        }
    ],
    [
        "path",
        {
            d: "M19 12H5",
            key: "x3x0zl"
        }
    ]
];
const ArrowLeft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("arrow-left", __iconNode);
;
 //# sourceMappingURL=arrow-left.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArrowLeft",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>CircleQuestionMark
]);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ],
    [
        "path",
        {
            d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
            key: "1u773s"
        }
    ],
    [
        "path",
        {
            d: "M12 17h.01",
            key: "p32p05"
        }
    ]
];
const CircleQuestionMark = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("circle-question-mark", __iconNode);
;
 //# sourceMappingURL=circle-question-mark.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-client] (ecmascript) <export default as HelpCircle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HelpCircle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-client] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/delete.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Delete
]);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z",
            key: "1yo7s0"
        }
    ],
    [
        "path",
        {
            d: "m12 9 6 6",
            key: "anjzzh"
        }
    ],
    [
        "path",
        {
            d: "m18 9-6 6",
            key: "1fp51s"
        }
    ]
];
const Delete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("delete", __iconNode);
;
 //# sourceMappingURL=delete.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/delete.js [app-client] (ecmascript) <export default as Delete>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Delete",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$delete$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$delete$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/delete.js [app-client] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/corner-down-left.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>CornerDownLeft
]);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 4v7a4 4 0 0 1-4 4H4",
            key: "6o5b7l"
        }
    ],
    [
        "path",
        {
            d: "m9 10-5 5 5 5",
            key: "1kshq7"
        }
    ]
];
const CornerDownLeft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("corner-down-left", __iconNode);
;
 //# sourceMappingURL=corner-down-left.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/corner-down-left.js [app-client] (ecmascript) <export default as CornerDownLeft>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CornerDownLeft",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$corner$2d$down$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$corner$2d$down$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/corner-down-left.js [app-client] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/space.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Space
]);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1",
            key: "lt2kga"
        }
    ]
];
const Space = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("space", __iconNode);
;
 //# sourceMappingURL=space.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/space.js [app-client] (ecmascript) <export default as Space>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Space",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$space$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$space$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/space.js [app-client] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Settings2
]);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M14 17H5",
            key: "gfn3mx"
        }
    ],
    [
        "path",
        {
            d: "M19 7h-9",
            key: "6i9tg"
        }
    ],
    [
        "circle",
        {
            cx: "17",
            cy: "17",
            r: "3",
            key: "18b49y"
        }
    ],
    [
        "circle",
        {
            cx: "7",
            cy: "7",
            r: "3",
            key: "dfmy0x"
        }
    ]
];
const Settings2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("settings-2", __iconNode);
;
 //# sourceMappingURL=settings-2.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-client] (ecmascript) <export default as Settings2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Settings2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=Documents_GitHub_ntu-beyond-binary_frontend_9f7e26fd._.js.map