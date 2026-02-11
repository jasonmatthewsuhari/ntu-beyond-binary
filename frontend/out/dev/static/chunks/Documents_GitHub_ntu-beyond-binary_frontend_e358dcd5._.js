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
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/profile-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utility functions for user profile management
 */ __turbopack_context__.s([
    "INPUT_TYPE_TO_MODE_MAP",
    ()=>INPUT_TYPE_TO_MODE_MAP,
    "getCurrentProfile",
    ()=>getCurrentProfile,
    "getEnabledInputModes",
    ()=>getEnabledInputModes,
    "getPrimaryInputMode",
    ()=>getPrimaryInputMode,
    "isInputModeEnabled",
    ()=>isInputModeEnabled
]);
const INPUT_TYPE_TO_MODE_MAP = {
    'voice': [
        'voice'
    ],
    'motion': [
        'head-motion'
    ],
    'switch': [
        'switch'
    ],
    'blink': [
        'eye-gaze'
    ],
    'gaze': [
        'eye-gaze'
    ],
    'head': [
        'head-motion'
    ],
    'sign': [
        'sign'
    ],
    'facial': [
        'facial'
    ],
    'sip-puff': [
        'sip-puff'
    ],
    'none': []
};
function getCurrentProfile() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const profileStr = localStorage.getItem('fluent-current-profile');
    if (!profileStr) return null;
    try {
        return JSON.parse(profileStr);
    } catch  {
        return null;
    }
}
function getEnabledInputModes() {
    const profile = getCurrentProfile();
    // If no profile, allow all modes (user hasn't completed onboarding)
    if (!profile || !profile.availableInputs || profile.availableInputs.length === 0) {
        return [
            'voice',
            'draw',
            'haptic',
            'type',
            'sign',
            'eye-gaze',
            'head-motion',
            'facial',
            'sip-puff',
            'switch',
            'board',
            'custom'
        ];
    }
    // Map detected inputs to mode IDs
    const enabledModes = new Set();
    for (const inputType of profile.availableInputs){
        const modes = INPUT_TYPE_TO_MODE_MAP[inputType] || [];
        modes.forEach((mode)=>enabledModes.add(mode));
    }
    // Always enable these universal modes
    enabledModes.add('board'); // Communication board works for everyone
    enabledModes.add('custom'); // Custom input is always available
    enabledModes.add('type'); // Keyboard is universal
    enabledModes.add('draw'); // Drawing is universal
    return Array.from(enabledModes);
}
function isInputModeEnabled(modeId) {
    const enabledModes = getEnabledInputModes();
    return enabledModes.includes(modeId);
}
function getPrimaryInputMode() {
    const profile = getCurrentProfile();
    if (!profile) return null;
    const modes = INPUT_TYPE_TO_MODE_MAP[profile.primaryInput] || [];
    return modes[0] || null;
}
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
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Dashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/fluent-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$adaptive$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/adaptive-engine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$app$2d$shell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/app-shell.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$profile$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/profile-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-client] (ecmascript) <export default as TrendingDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smile$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smile$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/smile.js [app-client] (ecmascript) <export default as Smile>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$meh$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Meh$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/meh.js [app-client] (ecmascript) <export default as Meh>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$frown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Frown$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/frown.js [app-client] (ecmascript) <export default as Frown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
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
;
;
const MOODS = [
    {
        emoji: '😊',
        label: 'Good',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smile$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smile$3e$__["Smile"]
    },
    {
        emoji: '😐',
        label: 'Okay',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$meh$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Meh$3e$__["Meh"]
    },
    {
        emoji: '😟',
        label: 'Struggling',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$frown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Frown$3e$__["Frown"]
    },
    {
        emoji: '❤️',
        label: 'Great',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"]
    }
];
function Dashboard() {
    _s();
    const { appendOutput } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFluentContext"])();
    const [selectedMood, setSelectedMood] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [phrases, setPhrases] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [suggestion, setSuggestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        type: 'none',
        message: ''
    });
    const [enabledModes, setEnabledModes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            setPhrases((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$adaptive$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFrequentPhrases"])());
            setSuggestion((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$adaptive$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSuggestion"])());
            setEnabledModes((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$profile$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEnabledInputModes"])());
            setProfile((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$profile$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentProfile"])());
        }
    }["Dashboard.useEffect"], []);
    // Filter INPUT_MODES based on user's enabled inputs
    const filteredModes = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$app$2d$shell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INPUT_MODES"].filter((mode)=>enabledModes.includes(mode.id));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-5xl mx-auto space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl md:text-5xl font-black text-foreground tracking-tight",
                        children: [
                            "Welcome to ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-primary bg-accent px-2 py-0.5 border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] inline-block rotate-[-1deg]",
                                children: "Fluent"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                                lineNumber: 46,
                                columnNumber: 22
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-lg font-medium text-muted-foreground max-w-2xl",
                        children: "Your universal bridge between ability and technology. Choose an input mode to start communicating."
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    profile && profile.availableInputs && profile.availableInputs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 mt-3 text-sm font-medium",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                className: "h-4 w-4 text-primary"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-muted-foreground",
                                children: [
                                    "Optimized for: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold text-foreground",
                                        children: profile.availableInputs.map((input)=>input.charAt(0).toUpperCase() + input.slice(1)).join(', ')
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                                        lineNumber: 55,
                                        columnNumber: 30
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                lineNumber: 44,
                columnNumber: 13
            }, this),
            suggestion.type !== 'none' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 p-4 bg-accent/20 border-4 border-border rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                        className: "h-5 w-5 flex-shrink-0 text-foreground"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-bold flex-1",
                        children: suggestion.message
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this),
                    suggestion.suggestedMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/input/${suggestion.suggestedMode}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            size: "sm",
                            className: "font-bold border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                            children: "Try it"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                            lineNumber: 72,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                        lineNumber: 71,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                lineNumber: 67,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4",
                children: filteredModes.map((mode)=>{
                    const Icon = mode.icon;
                    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$adaptive$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModeStats"])().find((s)=>s.mode === mode.id);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: mode.href,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            className: "group p-4 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer h-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `w-12 h-12 rounded-xl border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${mode.color} flex items-center justify-center mb-3`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        className: "h-6 w-6 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                                        lineNumber: 89,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                                    lineNumber: 88,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-black text-base",
                                    children: mode.label
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                                    lineNumber: 91,
                                    columnNumber: 17
                                }, this),
                                stats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1 mt-1",
                                    children: [
                                        stats.trend === 'improving' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                            className: "h-3 w-3 text-green-600"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                                            lineNumber: 94,
                                            columnNumber: 53
                                        }, this),
                                        stats.trend === 'declining' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"], {
                                            className: "h-3 w-3 text-red-500"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                                            lineNumber: 95,
                                            columnNumber: 53
                                        }, this),
                                        stats.trend === 'stable' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                            className: "h-3 w-3 text-muted-foreground"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                                            lineNumber: 96,
                                            columnNumber: 50
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-medium text-muted-foreground",
                                            children: [
                                                Math.round(stats.successfulInputs / stats.totalInputs * 100),
                                                "% accuracy"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                                            lineNumber: 97,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                                    lineNumber: 93,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                            lineNumber: 87,
                            columnNumber: 15
                        }, this)
                    }, mode.id, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                        lineNumber: 86,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-black mb-4 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this),
                            " Quick Phrases"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: (phrases.length > 0 ? phrases : [
                            'Hello!',
                            'Thank you',
                            'Yes',
                            'No',
                            'Help me please',
                            'I need a break',
                            'I love you',
                            'Good morning'
                        ]).map((phrase, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                onClick: ()=>appendOutput(phrase + ' '),
                                className: "border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all font-bold text-sm",
                                children: phrase
                            }, i, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                                lineNumber: 118,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
                lineNumber: 109,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/page.tsx",
        lineNumber: 42,
        columnNumber: 9
    }, this);
}
_s(Dashboard, "uVokMAyEBcmXxMh1f3O/10XwMT8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFluentContext"]
    ];
});
_c = Dashboard;
var _c;
__turbopack_context__.k.register(_c, "Dashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Zap
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
            d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
            key: "1xq2db"
        }
    ]
];
const Zap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("zap", __iconNode);
;
 //# sourceMappingURL=zap.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Zap",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>TrendingUp
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
            d: "M16 7h6v6",
            key: "box55l"
        }
    ],
    [
        "path",
        {
            d: "m22 7-8.5 8.5-5-5L2 17",
            key: "1t1m79"
        }
    ]
];
const TrendingUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("trending-up", __iconNode);
;
 //# sourceMappingURL=trending-up.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrendingUp",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>TrendingDown
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
            d: "M16 17h6v-6",
            key: "t6n2it"
        }
    ],
    [
        "path",
        {
            d: "m22 17-8.5-8.5-5 5L2 7",
            key: "x473p"
        }
    ]
];
const TrendingDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("trending-down", __iconNode);
;
 //# sourceMappingURL=trending-down.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-client] (ecmascript) <export default as TrendingDown>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrendingDown",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-client] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Minus
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
            d: "M5 12h14",
            key: "1ays0h"
        }
    ]
];
const Minus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("minus", __iconNode);
;
 //# sourceMappingURL=minus.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Minus",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>TriangleAlert
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
            d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
            key: "wmoenq"
        }
    ],
    [
        "path",
        {
            d: "M12 9v4",
            key: "juzpu7"
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
const TriangleAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("triangle-alert", __iconNode);
;
 //# sourceMappingURL=triangle-alert.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertTriangle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/meh.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Meh
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
        "line",
        {
            x1: "8",
            x2: "16",
            y1: "15",
            y2: "15",
            key: "1xb1d9"
        }
    ],
    [
        "line",
        {
            x1: "9",
            x2: "9.01",
            y1: "9",
            y2: "9",
            key: "yxxnd0"
        }
    ],
    [
        "line",
        {
            x1: "15",
            x2: "15.01",
            y1: "9",
            y2: "9",
            key: "1p4y9e"
        }
    ]
];
const Meh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("meh", __iconNode);
;
 //# sourceMappingURL=meh.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/meh.js [app-client] (ecmascript) <export default as Meh>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Meh",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$meh$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$meh$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/meh.js [app-client] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/frown.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Frown
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
            d: "M16 16s-1.5-2-4-2-4 2-4 2",
            key: "epbg0q"
        }
    ],
    [
        "line",
        {
            x1: "9",
            x2: "9.01",
            y1: "9",
            y2: "9",
            key: "yxxnd0"
        }
    ],
    [
        "line",
        {
            x1: "15",
            x2: "15.01",
            y1: "9",
            y2: "9",
            key: "1p4y9e"
        }
    ]
];
const Frown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("frown", __iconNode);
;
 //# sourceMappingURL=frown.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/frown.js [app-client] (ecmascript) <export default as Frown>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Frown",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$frown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$frown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/frown.js [app-client] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Heart
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
            d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
            key: "mvr1a0"
        }
    ]
];
const Heart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("heart", __iconNode);
;
 //# sourceMappingURL=heart.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Heart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript)");
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Star
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
            d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
            key: "r04s7s"
        }
    ]
];
const Star = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("star", __iconNode);
;
 //# sourceMappingURL=star.js.map
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Star",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=Documents_GitHub_ntu-beyond-binary_frontend_e358dcd5._.js.map