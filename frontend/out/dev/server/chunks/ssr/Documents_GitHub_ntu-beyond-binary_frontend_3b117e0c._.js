module.exports = [
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/adaptive-engine.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModePageLayout",
    ()=>ModePageLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-ssr] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/button.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function ModePageLayout({ title, description, icon, color, children, helpContent }) {
    const [showHelp, setShowHelp] = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-4xl mx-auto space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            className: "border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all font-bold",
                            "aria-label": "Back to dashboard",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-2 rounded-xl border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${color || 'bg-primary'}`,
                                        children: icon
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx",
                                        lineNumber: 37,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    helpContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        size: "sm",
                        onClick: ()=>setShowHelp(!showHelp),
                        className: "border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all font-bold",
                        "aria-label": "Show help",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
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
            showHelp && helpContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-card border-4 border-border rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('rounded-lg border bg-card text-card-foreground shadow-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx",
        lineNumber: 9,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
Card.displayName = 'Card';
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex flex-col space-y-1.5 p-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardHeader.displayName = 'CardHeader';
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-2xl font-semibold leading-none tracking-tight', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx",
        lineNumber: 36,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardTitle.displayName = 'CardTitle';
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-sm text-muted-foreground', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx",
        lineNumber: 51,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardDescription.displayName = 'CardDescription';
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('p-6 pt-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx",
        lineNumber: 63,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardContent.displayName = 'CardContent';
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex items-center p-6 pt-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx",
        lineNumber: 71,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardFooter.displayName = 'CardFooter';
;
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HapticPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/fluent-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$adaptive$2d$engine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/adaptive-engine.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$mode$2d$page$2d$layout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/mode-page-layout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hand$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/hand.js [app-ssr] (ecmascript) <export default as Hand>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-ssr] (ecmascript) <export default as Settings2>");
'use client';
;
;
;
;
;
;
;
;
const DEFAULT_PATTERNS = {
    'S-S': 'Yes',
    'L-L': 'No',
    'S-S-S': 'Help',
    'L-S': 'Next',
    'S-L': 'Back',
    'S-S-L': 'Enter',
    'L-L-S': 'Delete',
    'S-S-S-S': 'Emergency',
    'L-L-L': 'Call',
    'S-L-S-L': 'Police'
};
function HapticPage() {
    const { appendOutput } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFluentContext"])();
    const [patterns, setPatterns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_PATTERNS);
    const [currentPattern, setCurrentPattern] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recognizedText, setRecognizedText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [tapStartTime, setTapStartTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [shortThreshold, setShortThreshold] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(200) // ms
    ;
    const [patternTimeout, setPatternTimeout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(2000) // ms
    ;
    const [lastTapTime, setLastTapTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showCustomDialog, setShowCustomDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newPattern, setNewPattern] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [newMeaning, setNewMeaning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [combinedWords, setCombinedWords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [longPauseTimeout, setLongPauseTimeout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const timeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Reset pattern after timeout
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (currentPattern.length > 0) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(()=>{
                recognizeAndExecute(currentPattern);
                setCurrentPattern([]);
            }, patternTimeout);
        }
        return ()=>{
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [
        currentPattern,
        patternTimeout
    ]);
    const recognizeAndExecute = (pattern)=>{
        const patternStr = pattern.join('-');
        const meaning = patterns[patternStr];
        if (meaning) {
            setRecognizedText(meaning);
            // Add to combined words
            setCombinedWords((prev)=>[
                    ...prev,
                    meaning
                ]);
            // Start long pause detection (5+ seconds to finalize)
            if (longPauseTimeout) clearTimeout(longPauseTimeout);
            const timeout = setTimeout(()=>{
                // After 5 seconds, combine all words
                if (combinedWords.length > 0 || meaning) {
                    const allWords = [
                        ...combinedWords,
                        meaning
                    ];
                    const combined = allWords.join(' ');
                    appendOutput(combined + ' ');
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$adaptive$2d$engine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["recordInput"])('haptic', true, 500, combined);
                    setCombinedWords([]);
                }
            }, 5000);
            setLongPauseTimeout(timeout);
        } else {
            setRecognizedText(`Unknown pattern: ${patternStr}`);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$adaptive$2d$engine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["recordInput"])('haptic', false, 500);
        }
    };
    const handleKeyDown = (e)=>{
        if (e.repeat) return; // Ignore key repeats
        if (e.code !== 'Space' && e.code !== 'Enter') return;
        e.preventDefault();
        const now = Date.now();
        setTapStartTime(now);
        setLastTapTime(now);
    };
    const handleKeyUp = (e)=>{
        if (e.code !== 'Space' && e.code !== 'Enter') return;
        e.preventDefault();
        if (!tapStartTime) return;
        const duration = Date.now() - tapStartTime;
        const tapType = duration < shortThreshold ? 'S' : 'L';
        setCurrentPattern((prev)=>[
                ...prev,
                tapType
            ]);
        setTapStartTime(null);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return ()=>{
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [
        tapStartTime,
        shortThreshold
    ]);
    const addCustomPattern = ()=>{
        if (newPattern && newMeaning) {
            setPatterns((prev)=>({
                    ...prev,
                    [newPattern]: newMeaning
                }));
            setNewPattern('');
            setNewMeaning('');
            setShowCustomDialog(false);
        }
    };
    const currentPatternStr = currentPattern.join('-') || '(none)';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$mode$2d$page$2d$layout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ModePageLayout"], {
        title: "Haptic Input",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hand$3e$__["Hand"], {
            className: "h-6 w-6 text-white"
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
            lineNumber: 138,
            columnNumber: 13
        }, void 0),
        color: "bg-purple-500",
        helpContent: "Press and hold Space or Enter to create tap patterns. Short tap = S (< 200ms), Long tap = L (> 200ms). Combine taps to create patterns like S-S for Yes or L-L for No.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid gap-6 lg:grid-cols-[1fr_320px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                            className: "p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-h-[300px] flex flex-col justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-bold text-muted-foreground mb-2",
                                                children: "Current Pattern"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                lineNumber: 148,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-center gap-2 min-h-[60px] items-center",
                                                children: currentPattern.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-muted-foreground text-sm",
                                                    children: "Press Space or Enter to start"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 151,
                                                    columnNumber: 21
                                                }, this) : currentPattern.map((tap, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `px-4 py-2 rounded-lg border-2 border-border font-black text-lg ${tap === 'S' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'}`,
                                                        children: tap
                                                    }, i, false, {
                                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                        lineNumber: 154,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                lineNumber: 149,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-bold mt-2",
                                                children: currentPatternStr
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                lineNumber: 165,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this),
                                    recognizedText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 bg-primary/10 border-2 border-primary rounded-xl",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-bold text-muted-foreground mb-1",
                                                children: "Recognized:"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                lineNumber: 170,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-black text-lg",
                                                children: recognizedText
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                lineNumber: 171,
                                                columnNumber: 19
                                            }, this),
                                            combinedWords.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-3 pt-3 border-t-2 border-primary/20",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs font-bold text-muted-foreground mb-1",
                                                        children: "Building phrase (pause 5s to send):"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                        lineNumber: 175,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-bold text-sm text-primary",
                                                        children: [
                                                            ...combinedWords,
                                                            recognizedText
                                                        ].join(' ')
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                        lineNumber: 178,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                lineNumber: 174,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                        lineNumber: 169,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                            lineNumber: 145,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                            className: "p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-black text-sm",
                                            children: "Pattern Library"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                            lineNumber: 191,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            size: "sm",
                                            onClick: ()=>setShowCustomDialog(true),
                                            className: "gap-2 font-bold border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                    className: "h-3 w-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 17
                                                }, this),
                                                " Add Pattern"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                            lineNumber: 192,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-2",
                                    children: Object.entries(patterns).map(([pattern, meaning])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-3 bg-muted border-2 border-border rounded-lg text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-black text-muted-foreground",
                                                    children: pattern
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 207,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-bold text-sm",
                                                    children: meaning
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 208,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, pattern, true, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                            lineNumber: 203,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                            lineNumber: 189,
                            columnNumber: 21
                        }, this),
                        showCustomDialog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                            className: "p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-background",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-black text-sm mb-4",
                                    children: "Add Custom Pattern"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                    lineNumber: 217,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-bold mb-1 block",
                                                    children: "Pattern (e.g., S-L-S)"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 220,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: newPattern,
                                                    onChange: (e)=>setNewPattern(e.target.value),
                                                    className: "w-full px-3 py-2 border-2 border-border rounded-lg font-bold bg-input",
                                                    placeholder: "S-L-S"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 221,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                            lineNumber: 219,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-bold mb-1 block",
                                                    children: "Meaning"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: newMeaning,
                                                    onChange: (e)=>setNewMeaning(e.target.value),
                                                    className: "w-full px-3 py-2 border-2 border-border rounded-lg font-bold bg-input",
                                                    placeholder: "Save"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 231,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                            lineNumber: 229,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    onClick: addCustomPattern,
                                                    className: "flex-1 font-bold border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                                                    children: "Add"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 240,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "outline",
                                                    onClick: ()=>setShowCustomDialog(false),
                                                    className: "flex-1 font-bold border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                                                    children: "Cancel"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 246,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                            lineNumber: 239,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                    lineNumber: 218,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                            lineNumber: 216,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                    lineNumber: 143,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                            className: "p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-black text-sm mb-3 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__["Settings2"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                            lineNumber: 263,
                                            columnNumber: 15
                                        }, this),
                                        " Settings"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                    lineNumber: 262,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-bold mb-1 block",
                                                    children: [
                                                        "Short Tap Threshold: ",
                                                        shortThreshold,
                                                        "ms"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: 50,
                                                    max: 500,
                                                    step: 10,
                                                    value: shortThreshold,
                                                    onChange: (e)=>setShortThreshold(Number(e.target.value)),
                                                    className: "w-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between text-xs text-muted-foreground font-bold mt-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Faster"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                            lineNumber: 281,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Slower"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                            lineNumber: 282,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 280,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                            lineNumber: 267,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-bold mb-1 block",
                                                    children: [
                                                        "Pattern Timeout: ",
                                                        patternTimeout,
                                                        "ms"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 287,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: 1000,
                                                    max: 5000,
                                                    step: 100,
                                                    value: patternTimeout,
                                                    onChange: (e)=>setPatternTimeout(Number(e.target.value)),
                                                    className: "w-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 290,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between text-xs text-muted-foreground font-bold mt-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "1s"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                            lineNumber: 300,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "5s"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                            lineNumber: 301,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                                    lineNumber: 299,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                            lineNumber: 286,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                    lineNumber: 266,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                            lineNumber: 261,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                            className: "p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-black text-sm mb-2",
                                    children: "Instructions"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                    lineNumber: 308,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2 text-xs font-medium text-muted-foreground",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "• Press and hold Space or Enter"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                            lineNumber: 310,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "• Short tap (S) = quick press"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                            lineNumber: 311,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "• Long tap (L) = hold longer"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                            lineNumber: 312,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "• Pattern completes after pause"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                            lineNumber: 313,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "• Adjust thresholds for comfort"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                            lineNumber: 314,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                                    lineNumber: 309,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                            lineNumber: 307,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
                    lineNumber: 260,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
            lineNumber: 142,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/input/haptic/page.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
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
const ArrowLeft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("arrow-left", __iconNode);
;
 //# sourceMappingURL=arrow-left.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArrowLeft",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
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
const CircleQuestionMark = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("circle-question-mark", __iconNode);
;
 //# sourceMappingURL=circle-question-mark.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-ssr] (ecmascript) <export default as HelpCircle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HelpCircle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-ssr] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Plus
]);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M5 12h14",
            key: "1ays0h"
        }
    ],
    [
        "path",
        {
            d: "M12 5v14",
            key: "s699le"
        }
    ]
];
const Plus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("plus", __iconNode);
;
 //# sourceMappingURL=plus.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Plus",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
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
const Settings2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("settings-2", __iconNode);
;
 //# sourceMappingURL=settings-2.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-ssr] (ecmascript) <export default as Settings2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Settings2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=Documents_GitHub_ntu-beyond-binary_frontend_3b117e0c._.js.map