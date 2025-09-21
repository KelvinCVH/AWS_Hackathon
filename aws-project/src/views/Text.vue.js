"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var inputText = (0, vue_1.ref)('');
var isAnalyzing = (0, vue_1.ref)(false);
var results = (0, vue_1.ref)(null);
var error = (0, vue_1.ref)(null);
var activeTab = (0, vue_1.ref)('linguistic');
var analysisStartTime = (0, vue_1.ref)(null);
var analysisTime = (0, vue_1.ref)(0);
// Replace with your actual API Gateway URL
var API_URL = 'https://bbi2604f92.execute-api.ap-southeast-5.amazonaws.com/Prod/analyze';
var tabs = [
    { id: 'linguistic', label: 'Linguistic Analysis' },
    { id: 'semantic', label: 'Semantic Analysis' },
    { id: 'model', label: 'Model Assessment' },
    { id: 'explanation', label: 'Full Summary' }
];
var sampleTexts = [
    {
        label: 'Human Review',
        text: "I bought this coffee maker last week and honestly, I'm pretty disappointed. It makes decent coffee but it's SO loud when grinding the beans - woke up my kids at 6am! The water reservoir is also kinda small so I have to refill it constantly. For $89 I expected better. Gonna return it and try a different brand."
    },
    {
        label: 'AI Generated',
        text: "This revolutionary product represents a paradigm shift in coffee brewing technology. The innovative design seamlessly integrates cutting-edge features with user-friendly functionality. The exceptional build quality ensures optimal performance and longevity. Furthermore, the comprehensive brewing options cater to diverse preferences, making it an outstanding choice for coffee enthusiasts seeking a premium experience."
    },
    {
        label: 'Mixed/Uncertain',
        text: "The new software update brings several improvements to the user interface. Navigation is more intuitive and the loading times have been reduced significantly. However, some users may need time to adjust to the new layout. Overall, it's a positive change that enhances the user experience."
    }
];
var wordCount = (0, vue_1.computed)(function () {
    return inputText.value.trim().split(/\s+/).filter(function (w) { return w.length > 0; }).length;
});
var hasResults = (0, vue_1.computed)(function () { return results.value !== null; });
var classification = (0, vue_1.computed)(function () {
    if (!results.value)
        return '';
    var s = results.value.ai_score;
    if (s < 20)
        return 'Very Likely Human';
    if (s < 40)
        return 'Likely Human';
    if (s < 60)
        return 'Uncertain Origin';
    if (s < 80)
        return 'Likely AI';
    return 'Very Likely AI';
});
var interpretationDetail = (0, vue_1.computed)(function () {
    if (!results.value)
        return '';
    var s = results.value.ai_score;
    if (s < 20)
        return 'Strong indicators of human authorship with personal voice and natural imperfections.';
    if (s < 40)
        return 'Shows characteristics typical of human writing with some formal elements.';
    if (s < 60)
        return 'Mixed signals - could be edited human text or AI with human touches.';
    if (s < 80)
        return 'Exhibits patterns commonly found in AI-generated content.';
    return 'Strong AI patterns detected including formulaic language and perfect structure.';
});
var resultTextColor = (0, vue_1.computed)(function () {
    if (!results.value)
        return 'text-gray-500';
    var s = results.value.ai_score;
    if (s < 40)
        return 'text-green-600';
    if (s < 60)
        return 'text-yellow-600';
    return 'text-red-600';
});
var scoreColor = (0, vue_1.computed)(function () {
    if (!results.value)
        return '#9ca3af';
    var s = results.value.ai_score;
    if (s < 40)
        return '#10b981';
    if (s < 60)
        return '#f59e0b';
    return '#ef4444';
});
var confidenceBadgeClass = (0, vue_1.computed)(function () {
    var _a;
    if (!((_a = results.value) === null || _a === void 0 ? void 0 : _a.confidence))
        return 'bg-gray-100 text-gray-700';
    var conf = results.value.confidence.toLowerCase();
    if (conf === 'high')
        return 'bg-green-100 text-green-700';
    if (conf === 'medium')
        return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
});
var sentimentColor = (0, vue_1.computed)(function () {
    var _a, _b, _c;
    if (!((_c = (_b = (_a = results.value) === null || _a === void 0 ? void 0 : _a.details) === null || _b === void 0 ? void 0 : _b.semantic_analysis) === null || _c === void 0 ? void 0 : _c.sentiment))
        return 'text-gray-600';
    var sentiment = results.value.details.semantic_analysis.sentiment;
    if (sentiment === 'POSITIVE')
        return 'text-green-600';
    if (sentiment === 'NEGATIVE')
        return 'text-red-600';
    if (sentiment === 'MIXED')
        return 'text-purple-600';
    return 'text-gray-600';
});
// For circular progress
var circumference = 2 * Math.PI * 56;
var strokeDashoffset = (0, vue_1.computed)(function () {
    if (!results.value)
        return circumference;
    return circumference - (results.value.ai_score / 100) * circumference;
});
var formatIndicator = function (indicator) {
    return indicator
        .replace(/_/g, ' ')
        .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
};
// Enhanced formatting functions for comprehensive explanations
var parseExplanation = function (explanation) {
    if (!explanation)
        return [];
    // Enhanced parsing for comprehensive explanations
    var parts = explanation
        .split(/\s*\|\s*/) // Split by pipe separators first
        .flatMap(function (part) {
        return part.split(/\.\s+(?=[A-Z])/);
    } // Then split by sentence boundaries
    )
        .filter(function (part) { return part && part.trim().length > 0; })
        .map(function (part) { return part.trim(); });
    return parts;
};
var getExplanationPartClass = function (part) {
    var partLower = part.toLowerCase();
    if (partLower.includes('human pattern') || partLower.includes('human trait') || partLower.includes('human writing')) {
        return 'bg-green-50 border-l-4 border-green-400 p-4 rounded-lg';
    }
    if (partLower.includes('ai pattern') || partLower.includes('ai trait') || partLower.includes('ai writing')) {
        return 'bg-red-50 border-l-4 border-red-400 p-4 rounded-lg';
    }
    if (partLower.includes('advanced model') || partLower.includes('model analysis')) {
        return 'bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg';
    }
    if (partLower.includes('semantic analysis') || partLower.includes('entities') || partLower.includes('sentiment')) {
        return 'bg-purple-50 border-l-4 border-purple-400 p-4 rounded-lg';
    }
    if (partLower.includes('complexity') || partLower.includes('natural')) {
        return 'bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg';
    }
    return 'bg-gray-50 border-l-4 border-gray-400 p-4 rounded-lg';
};
var getExplanationIcon = function (part) {
    var partLower = part.toLowerCase();
    if (partLower.includes('human'))
        return '👤';
    if (partLower.includes('ai'))
        return '🤖';
    if (partLower.includes('advanced model') || partLower.includes('model analysis'))
        return '🧠';
    if (partLower.includes('semantic') || partLower.includes('entities') || partLower.includes('sentiment'))
        return '🔍';
    if (partLower.includes('complexity') || partLower.includes('natural'))
        return '📊';
    if (partLower.includes('style'))
        return '✏️';
    if (partLower.includes('content'))
        return '📝';
    return '📊';
};
var cleanExplanationPart = function (part) {
    // Enhanced cleaning for comprehensive explanations
    return part
        .replace(/^(Human writing patterns detected:|AI writing patterns detected:|Advanced model analysis:|Semantic analysis:|Natural sentence complexity variation detected:)\s*/i, '')
        .replace(/^(Human patterns:|AI patterns:|Style:|Content:|Model analysis:)\s*/i, '')
        .replace(/\s+/g, ' ')
        .trim();
};
var cleanModelExplanation = function (explanation) {
    if (!explanation)
        return '';
    // Remove any cutoff text indicators
    return explanation.replace(/\.\.\.$/, '').trim();
};
var formatFullExplanation = function (explanation) {
    if (!explanation)
        return '';
    // Parse and format the explanation to avoid redundancy
    var parts = parseExplanation(explanation);
    // Remove duplicate parts
    var uniqueParts = __spreadArray([], new Set(parts.map(function (p) { return cleanExplanationPart(p); })), true);
    return uniqueParts
        .map(function (part) {
        if (part.toLowerCase().includes('human')) {
            return "\uD83D\uDC64 Human indicators: ".concat(part);
        }
        if (part.toLowerCase().includes('ai')) {
            return "\uD83E\uDD16 AI indicators: ".concat(part);
        }
        return "\uD83D\uDCCA ".concat(part);
    })
        .join('\n\n');
};
var resetResults = function () {
    results.value = null;
    error.value = null;
    activeTab.value = 'linguistic';
};
var loadSampleText = function (sample) {
    inputText.value = sample.text;
    resetResults();
};
var pasteText = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = inputText;
                return [4 /*yield*/, navigator.clipboard.readText()];
            case 1:
                _a.value = _b.sent();
                resetResults();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                console.error('Clipboard access failed:', err_1);
                alert('Please paste the text manually (Ctrl+V or Cmd+V)');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var analyzeText = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, errorText, data, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!inputText.value.trim() || inputText.value.trim().split(/\s+/).length < 5)
                    return [2 /*return*/];
                isAnalyzing.value = true;
                analysisStartTime.value = Date.now();
                resetResults();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, 7, 8]);
                return [4 /*yield*/, fetch(API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ text: inputText.value.trim() })
                    })];
            case 2:
                response = _a.sent();
                if (!!response.ok) return [3 /*break*/, 4];
                return [4 /*yield*/, response.text()];
            case 3:
                errorText = _a.sent();
                throw new Error("API returned ".concat(response.status, ": ").concat(errorText));
            case 4: return [4 /*yield*/, response.json()
                // Handle both direct responses and wrapped responses
            ];
            case 5:
                data = _a.sent();
                // Handle both direct responses and wrapped responses
                if (data.body && typeof data.body === 'string') {
                    results.value = JSON.parse(data.body);
                }
                else if (data.ai_score !== undefined) {
                    results.value = data;
                }
                else {
                    throw new Error('Unexpected response format');
                }
                // Calculate analysis time
                analysisTime.value = ((Date.now() - analysisStartTime.value) / 1000).toFixed(1);
                return [3 /*break*/, 8];
            case 6:
                err_2 = _a.sent();
                console.error('Analysis error:', err_2);
                error.value = err_2.message.includes('fetch')
                    ? 'Unable to connect to analysis service. Please check your connection.'
                    : err_2.message;
                return [3 /*break*/, 8];
            case 7:
                isAnalyzing.value = false;
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
var retryAnalysis = function () {
    error.value = null;
    analyzeText();
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-1 lg:grid-cols-2 gap-8" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)(__assign({ class: "text-2xl font-bold text-[#252F3E] mb-4" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "relative" }));
__VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)(__assign(__assign({ onInput: (__VLS_ctx.resetResults) }, { value: (__VLS_ctx.inputText), placeholder: "Paste or type your text here..." }), { class: "\u0077\u002d\u0066\u0075\u006c\u006c\u0020\u0068\u002d\u0039\u0036\u0020\u0070\u002d\u0034\u0020\u0062\u006f\u0072\u0064\u0065\u0072\u0020\u0062\u006f\u0072\u0064\u0065\u0072\u002d\u0067\u0072\u0061\u0079\u002d\u0034\u0030\u0030\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u006c\u0067\u0020\u0072\u0065\u0073\u0069\u007a\u0065\u002d\u006e\u006f\u006e\u0065\u000d\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u0072\u0069\u006e\u0067\u002d\u0032\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u0072\u0069\u006e\u0067\u002d\u005b\u0023\u0046\u0046\u0039\u0039\u0030\u0030\u005d\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u0062\u006f\u0072\u0064\u0065\u0072\u002d\u0074\u0072\u0061\u006e\u0073\u0070\u0061\u0072\u0065\u006e\u0074" }));
// @ts-ignore
[resetResults, inputText,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "absolute bottom-4 right-4 flex items-center space-x-2" }));
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm text-gray-500" }));
(__VLS_ctx.wordCount);
// @ts-ignore
[wordCount,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.pasteText) }, { class: "\u0070\u0078\u002d\u0033\u0020\u0070\u0079\u002d\u0031\u0020\u0062\u0067\u002d\u005b\u0023\u0046\u0046\u0039\u0039\u0030\u0030\u005d\u0020\u0074\u0065\u0078\u0074\u002d\u0077\u0068\u0069\u0074\u0065\u0020\u0074\u0065\u0078\u0074\u002d\u0073\u006d\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u000d\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0068\u006f\u0076\u0065\u0072\u003a\u0062\u0067\u002d\u005b\u0023\u0045\u0036\u0038\u0041\u0030\u0030\u005d\u0020\u0074\u0072\u0061\u006e\u0073\u0069\u0074\u0069\u006f\u006e\u002d\u0063\u006f\u006c\u006f\u0072\u0073" }));
// @ts-ignore
[pasteText,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.analyzeText) }, { disabled: (!__VLS_ctx.inputText.trim() || __VLS_ctx.isAnalyzing || __VLS_ctx.inputText.trim().split(/\s+/).length < 5) }), { class: ([
        'w-full py-3 px-6 rounded-lg font-medium transition-colors',
        !__VLS_ctx.inputText.trim() || __VLS_ctx.isAnalyzing || __VLS_ctx.inputText.trim().split(/\s+/).length < 5
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#FF9900] text-white hover:bg-[#E68A00] shadow-lg'
    ]) }));
// @ts-ignore
[inputText, inputText, inputText, inputText, analyzeText, isAnalyzing, isAnalyzing,];
(__VLS_ctx.isAnalyzing ? 'Analyzing...' : 'Analyze Text');
// @ts-ignore
[isAnalyzing,];
if (__VLS_ctx.inputText.trim() && __VLS_ctx.inputText.trim().split(/\s+/).length < 5) {
    // @ts-ignore
    [inputText, inputText,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-sm text-red-600 text-center" }));
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "border-t pt-4 mt-6" }));
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-600 mb-3" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex flex-wrap gap-2" }));
var _loop_1 = function (sample) {
    // @ts-ignore
    [sampleTexts,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.loadSampleText(sample);
            // @ts-ignore
            [loadSampleText,];
        } }, { key: (sample.label) }), { class: "px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors" }));
    (sample.label);
};
for (var _i = 0, _j = __VLS_getVForSourceType((__VLS_ctx.sampleTexts)); _i < _j.length; _i++) {
    var sample = _j[_i][0];
    _loop_1(sample);
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)(__assign({ class: "text-2xl font-bold text-[#252F3E] mb-4" }));
if (!__VLS_ctx.hasResults && !__VLS_ctx.isAnalyzing && !__VLS_ctx.error) {
    // @ts-ignore
    [isAnalyzing, hasResults, error,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center py-12 text-gray-500" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-16 h-16 mx-auto mb-4 text-gray-300" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    });
}
if (__VLS_ctx.isAnalyzing) {
    // @ts-ignore
    [isAnalyzing,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center py-12" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900] mx-auto mb-4" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-gray-600" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-500 mt-2" }));
}
if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-red-50 border border-red-200 rounded-lg p-4" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-6 h-6 text-red-600 mr-3" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex-1" }));
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "text-red-800 font-medium" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-red-700 text-sm mt-1" }));
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.retryAnalysis) }, { class: "mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded" }));
    // @ts-ignore
    [retryAnalysis,];
}
if (__VLS_ctx.hasResults && !__VLS_ctx.isAnalyzing && !__VLS_ctx.error) {
    // @ts-ignore
    [isAnalyzing, hasResults, error,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white rounded-xl shadow-lg border p-6" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)(__assign({ class: "text-lg font-semibold text-gray-800" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: (['px-3 py-1 rounded-full text-sm font-medium', __VLS_ctx.confidenceBadgeClass]) }));
    // @ts-ignore
    [confidenceBadgeClass,];
    (__VLS_ctx.results.confidence || 'Medium');
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center space-x-6" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "relative" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-32 h-32 transform -rotate-90" }));
    __VLS_asFunctionalElement(__VLS_elements.circle)({
        cx: "64",
        cy: "64",
        r: "56",
        stroke: "#e5e7eb",
        'stroke-width': "12",
        fill: "none",
    });
    __VLS_asFunctionalElement(__VLS_elements.circle)(__assign({ cx: "64", cy: "64", r: "56", stroke: (__VLS_ctx.scoreColor), 'stroke-width': "12", fill: "none", 'stroke-linecap': "round", 'stroke-dasharray': (__VLS_ctx.circumference), 'stroke-dashoffset': (__VLS_ctx.strokeDashoffset) }, { class: "transition-all duration-1000 ease-out" }));
    // @ts-ignore
    [scoreColor, circumference, strokeDashoffset,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "absolute inset-0 flex items-center justify-center" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-3xl font-bold" }, { class: (__VLS_ctx.resultTextColor) }));
    // @ts-ignore
    [resultTextColor,];
    (Math.round(__VLS_ctx.results.ai_score));
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-500" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex-1" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xl font-semibold mb-2" }, { class: (__VLS_ctx.resultTextColor) }));
    // @ts-ignore
    [resultTextColor,];
    (__VLS_ctx.results.interpretation || __VLS_ctx.classification);
    // @ts-ignore
    [results, classification,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-600" }));
    (__VLS_ctx.interpretationDetail);
    // @ts-ignore
    [interpretationDetail,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white rounded-xl shadow-lg border" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "border-b" }));
    __VLS_asFunctionalElement(__VLS_elements.nav, __VLS_elements.nav)(__assign({ class: "flex -mb-px" }));
    var _loop_2 = function (tab) {
        // @ts-ignore
        [tabs,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.hasResults && !__VLS_ctx.isAnalyzing && !__VLS_ctx.error))
                    return;
                __VLS_ctx.activeTab = tab.id;
                // @ts-ignore
                [activeTab,];
            } }, { key: (tab.id) }), { class: ([
                'py-3 px-6 border-b-2 font-medium text-sm transition-colors',
                __VLS_ctx.activeTab === tab.id
                    ? 'border-[#FF9900] text-[#FF9900]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
            ]) }));
        // @ts-ignore
        [activeTab,];
        (tab.label);
    };
    for (var _k = 0, _l = __VLS_getVForSourceType((__VLS_ctx.tabs)); _k < _l.length; _k++) {
        var tab = _l[_k][0];
        _loop_2(tab);
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "p-6" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'linguistic') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800 mb-3" }));
    if ((_a = __VLS_ctx.results.details) === null || _a === void 0 ? void 0 : _a.linguistic_analysis) {
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        if ((_b = __VLS_ctx.results.details.linguistic_analysis.human_indicators) === null || _b === void 0 ? void 0 : _b.length) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mb-4" }));
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm font-medium text-green-700 mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex flex-wrap gap-2" }));
            for (var _m = 0, _o = __VLS_getVForSourceType((__VLS_ctx.results.details.linguistic_analysis.human_indicators)); _m < _o.length; _m++) {
                var indicator = _o[_m][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ key: (indicator) }, { class: "px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm" }));
                (__VLS_ctx.formatIndicator(indicator));
                // @ts-ignore
                [formatIndicator,];
            }
        }
        if ((_c = __VLS_ctx.results.details.linguistic_analysis.ai_indicators) === null || _c === void 0 ? void 0 : _c.length) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mb-4" }));
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm font-medium text-red-700 mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex flex-wrap gap-2" }));
            for (var _p = 0, _q = __VLS_getVForSourceType((__VLS_ctx.results.details.linguistic_analysis.ai_indicators)); _p < _q.length; _p++) {
                var indicator = _q[_p][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ key: (indicator) }, { class: "px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm" }));
                (__VLS_ctx.formatIndicator(indicator));
                // @ts-ignore
                [formatIndicator,];
            }
        }
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gray-50 rounded-lg p-4 mt-4" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm font-medium text-gray-700 mb-2" }));
        (__VLS_ctx.results.details.linguistic_analysis.score);
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "w-full bg-gray-200 rounded-full h-2" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "h-2 rounded-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-500" }, { style: ({ width: __VLS_ctx.results.details.linguistic_analysis.score + '%' }) }));
        // @ts-ignore
        [results,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-gray-500 text-sm" }));
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'semantic') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800 mb-3" }));
    if ((_d = __VLS_ctx.results.details) === null || _d === void 0 ? void 0 : _d.semantic_analysis) {
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-2 gap-4 mb-4" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gray-50 rounded-lg p-3" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-600 mb-1" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "font-semibold" }, { class: (__VLS_ctx.sentimentColor) }));
        // @ts-ignore
        [sentimentColor,];
        (__VLS_ctx.results.details.semantic_analysis.sentiment || 'N/A');
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gray-50 rounded-lg p-3" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-600 mb-1" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "font-semibold" }));
        (__VLS_ctx.results.details.semantic_analysis.entities_found || ((_e = __VLS_ctx.results.details.semantic_analysis.entities) === null || _e === void 0 ? void 0 : _e.length) || 0);
        // @ts-ignore
        [results, results,];
        if ((_f = __VLS_ctx.results.details.semantic_analysis.key_phrases) === null || _f === void 0 ? void 0 : _f.length) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm font-medium text-gray-700 mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex flex-wrap gap-2" }));
            for (var _r = 0, _s = __VLS_getVForSourceType((__VLS_ctx.results.details.semantic_analysis.key_phrases)); _r < _s.length; _r++) {
                var phrase = _s[_r][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ key: (phrase) }, { class: "px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm" }));
                (phrase);
            }
        }
        if ((_g = __VLS_ctx.results.details.semantic_analysis.features) === null || _g === void 0 ? void 0 : _g.length) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mt-4" }));
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm font-medium text-gray-700 mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex flex-wrap gap-2" }));
            for (var _t = 0, _u = __VLS_getVForSourceType((__VLS_ctx.results.details.semantic_analysis.features)); _t < _u.length; _t++) {
                var feature = _u[_t][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ key: (feature) }, { class: "px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm" }));
                (__VLS_ctx.formatIndicator(feature));
                // @ts-ignore
                [formatIndicator,];
            }
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-gray-500 text-sm" }));
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'model') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800 mb-3" }));
    if ((_h = __VLS_ctx.results.details) === null || _h === void 0 ? void 0 : _h.model_analysis) {
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gray-50 rounded-lg p-4" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-3" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm font-medium text-gray-700" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-lg font-bold" }, { class: (__VLS_ctx.resultTextColor) }));
        // @ts-ignore
        [resultTextColor,];
        (__VLS_ctx.results.details.model_analysis.score);
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-600 leading-relaxed" }));
        (__VLS_ctx.cleanModelExplanation(__VLS_ctx.results.details.model_analysis.explanation));
        // @ts-ignore
        [results, cleanModelExplanation,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-gray-500 text-sm" }));
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'explanation') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded" }));
    if (__VLS_ctx.results.explanation) {
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
        for (var _v = 0, _w = __VLS_getVForSourceType((__VLS_ctx.parseExplanation(__VLS_ctx.results.explanation))); _v < _w.length; _v++) {
            var _x = _w[_v], part = _x[0], index = _x[1];
            // @ts-ignore
            [results, parseExplanation,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (index) }, { class: (__VLS_ctx.getExplanationPartClass(part)) }));
            // @ts-ignore
            [getExplanationPartClass,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-start" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "mr-3 mt-1 text-lg" }));
            (__VLS_ctx.getExplanationIcon(part));
            // @ts-ignore
            [getExplanationIcon,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex-1" }));
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm leading-relaxed" }));
            (__VLS_ctx.cleanExplanationPart(part));
            // @ts-ignore
            [cleanExplanationPart,];
        }
    }
    if (__VLS_ctx.results.details) {
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mt-6 space-y-4" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border" }));
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-gray-800 mb-2" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" }));
        if (__VLS_ctx.results.details.linguistic_analysis) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "font-medium text-gray-600" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "ml-2 font-semibold" }));
            (__VLS_ctx.results.details.linguistic_analysis.score);
            // @ts-ignore
            [results,];
        }
        if (__VLS_ctx.results.details.model_analysis) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "font-medium text-gray-600" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "ml-2 font-semibold" }));
            (__VLS_ctx.results.details.model_analysis.score);
            // @ts-ignore
            [results,];
        }
        if (__VLS_ctx.results.details.semantic_analysis) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "font-medium text-gray-600" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "ml-2 font-semibold" }));
            (__VLS_ctx.results.details.semantic_analysis.entities_found || 0);
            // @ts-ignore
            [results,];
        }
        if (__VLS_ctx.results.details.semantic_analysis) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "font-medium text-gray-600" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "ml-2 font-semibold capitalize" }));
            (__VLS_ctx.results.details.semantic_analysis.sentiment || 'N/A');
            // @ts-ignore
            [results,];
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-blue-800" }));
    __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-3 gap-4" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white rounded-lg border p-3 text-center" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-600 mb-1" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm font-medium text-gray-800" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white rounded-lg border p-3 text-center" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-600 mb-1" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm font-medium text-gray-800" }));
    (__VLS_ctx.results.confidence || 'Medium');
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white rounded-lg border p-3 text-center" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-600 mb-1" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm font-medium text-gray-800" }));
}
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#252F3E]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-96']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['resize-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-[#FF9900]']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[#FF9900]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[#E68A00]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#252F3E]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[#FF9900]']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-red-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-800']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-100']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-800']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-6']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-32']} */ ;
/** @type {__VLS_StyleScopedClasses['h-32']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['-rotate-90']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-1000']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-out']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['-mb-px']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-green-500']} */ ;
/** @type {__VLS_StyleScopedClasses['to-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-purple-50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['to-purple-50']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['capitalize']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border-l-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () { return ({
        inputText: inputText,
        isAnalyzing: isAnalyzing,
        results: results,
        error: error,
        activeTab: activeTab,
        tabs: tabs,
        sampleTexts: sampleTexts,
        wordCount: wordCount,
        hasResults: hasResults,
        classification: classification,
        interpretationDetail: interpretationDetail,
        resultTextColor: resultTextColor,
        scoreColor: scoreColor,
        confidenceBadgeClass: confidenceBadgeClass,
        sentimentColor: sentimentColor,
        circumference: circumference,
        strokeDashoffset: strokeDashoffset,
        formatIndicator: formatIndicator,
        parseExplanation: parseExplanation,
        getExplanationPartClass: getExplanationPartClass,
        getExplanationIcon: getExplanationIcon,
        cleanExplanationPart: cleanExplanationPart,
        cleanModelExplanation: cleanModelExplanation,
        resetResults: resetResults,
        loadSampleText: loadSampleText,
        pasteText: pasteText,
        analyzeText: analyzeText,
        retryAnalysis: retryAnalysis,
    }); },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
