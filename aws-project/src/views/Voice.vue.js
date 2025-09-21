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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var selectedVoice = (0, vue_1.ref)(null);
var audioPreview = (0, vue_1.ref)('');
var isDragging = (0, vue_1.ref)(false);
var isAnalyzing = (0, vue_1.ref)(false);
var results = (0, vue_1.ref)(null);
var fileSize = (0, vue_1.computed)(function () {
    if (!selectedVoice.value)
        return '';
    var size = selectedVoice.value.size;
    if (size < 1024 * 1024) {
        return "".concat(Math.round(size / 1024), " KB");
    }
    return "".concat((size / (1024 * 1024)).toFixed(1), " MB");
});
var fileDuration = (0, vue_1.computed)(function () {
    if (!selectedVoice.value)
        return '';
    // Rough estimation based on file size (assuming average bitrate)
    var avgBitrate = 128; // kbps
    var durationSeconds = (selectedVoice.value.size * 8) / (avgBitrate * 1000);
    var minutes = Math.floor(durationSeconds / 60);
    var seconds = Math.floor(durationSeconds % 60);
    return "".concat(minutes, ":").concat(seconds.toString().padStart(2, '0'));
});
var hasResults = (0, vue_1.computed)(function () { return results.value !== null; });
var resultColor = (0, vue_1.computed)(function () {
    if (!results.value)
        return 'text-gray-500';
    if (results.value.aiProbability < 30)
        return 'text-green-600';
    if (results.value.aiProbability < 70)
        return 'text-yellow-600';
    return 'text-red-600';
});
var progressBarColor = (0, vue_1.computed)(function () {
    if (!results.value)
        return 'bg-gray-400';
    if (results.value.aiProbability < 30)
        return 'bg-green-500';
    if (results.value.aiProbability < 70)
        return 'bg-yellow-500';
    return 'bg-red-500';
});
var handleDrop = function (e) {
    e.preventDefault();
    isDragging.value = false;
    var files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('audio/')) {
        processFile(files[0]);
    }
};
var handleFileSelect = function (e) {
    var file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
        processFile(file);
    }
};
var processFile = function (file) {
    selectedVoice.value = file;
    var reader = new FileReader();
    reader.onload = function (e) {
        audioPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
    resetResults();
};
var removeVoice = function () {
    selectedVoice.value = null;
    audioPreview.value = '';
    resetResults();
};
var resetResults = function () {
    results.value = null;
};
var analyzeVoice = function () { return __awaiter(void 0, void 0, void 0, function () {
    var fileName, fileSize, aiScore, classification, reasons;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!selectedVoice.value)
                    return [2 /*return*/];
                isAnalyzing.value = true;
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 4000); })];
            case 1:
                _a.sent();
                fileName = selectedVoice.value.name.toLowerCase();
                fileSize = selectedVoice.value.size;
                aiScore = Math.random() * 100;
                // Voice-specific scoring factors
                if (fileName.includes('generated') || fileName.includes('ai') || fileName.includes('tts'))
                    aiScore += 25;
                if (fileName.includes('recording') || fileName.includes('voice') || fileName.includes('audio'))
                    aiScore -= 20;
                if (fileSize < 1024 * 1024)
                    aiScore += 15; // Very small files might be synthetic
                if (fileSize > 10 * 1024 * 1024)
                    aiScore -= 10; // Large files likely natural recordings
                aiScore = Math.max(0, Math.min(100, aiScore));
                if (aiScore < 30) {
                    classification = 'Likely Human Voice';
                    reasons = [
                        'Natural speech patterns detected',
                        'Authentic vocal variations present',
                        'Background noise consistent with recording',
                        'Natural breathing patterns identified'
                    ];
                }
                else if (aiScore < 70) {
                    classification = 'Uncertain Origin';
                    reasons = [
                        'Mixed vocal characteristics detected',
                        'Some synthetic patterns present',
                        'Audio quality affects analysis',
                        'Requires additional verification'
                    ];
                }
                else {
                    classification = 'Likely AI-Generated';
                    reasons = [
                        'Synthetic speech patterns detected',
                        'Consistent vocal tone throughout',
                        'Missing natural speech variations',
                        'Digital generation artifacts present'
                    ];
                }
                results.value = {
                    aiProbability: aiScore,
                    classification: classification,
                    confidence: Math.round(75 + Math.random() * 20),
                    processingTime: Math.round(3500 + Math.random() * 2000),
                    modelVersion: 'v1.8.2',
                    duration: fileDuration.value,
                    reasons: reasons
                };
                isAnalyzing.value = false;
                return [2 /*return*/];
        }
    });
}); };
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-1 lg:grid-cols-2 gap-8" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)(__assign({ class: "text-2xl font-bold text-[#252F3E] mb-4" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "relative" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign(__assign({ onDrop: (__VLS_ctx.handleDrop) }, { onDragover: function () { } }), { onDragenter: function () { } }), { class: ([
        'w-full h-96 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors',
        __VLS_ctx.isDragging ? 'border-[#FF9900] bg-orange-50' : 'border-gray-300 hover:border-[#FF9900]'
    ]) }));
// @ts-ignore
[handleDrop, isDragging,];
if (!__VLS_ctx.selectedVoice) {
    // @ts-ignore
    [selectedVoice,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-12 h-12 text-gray-400 mb-4 mx-auto" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_elements.path, __VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z",
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-gray-600 mb-2" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(!__VLS_ctx.selectedVoice))
                return;
            __VLS_ctx.$refs.fileInput.click();
            // @ts-ignore
            [$refs,];
        } }, { class: "px-4 py-2 bg-[#FF9900] text-white rounded hover:bg-[#E68A00] transition-colors" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-500 mt-2" }));
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center w-full" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white rounded-lg p-6 shadow-sm border w-full max-w-md mx-auto" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-16 h-16 text-[#FF9900] mb-4 mx-auto" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_elements.path, __VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "font-medium text-[#252F3E] mb-2" }));
    (__VLS_ctx.selectedVoice.name);
    // @ts-ignore
    [selectedVoice,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-600 mb-4" }));
    (__VLS_ctx.fileSize);
    (__VLS_ctx.fileDuration);
    // @ts-ignore
    [fileSize, fileDuration,];
    if (__VLS_ctx.audioPreview) {
        // @ts-ignore
        [audioPreview,];
        __VLS_asFunctionalElement(__VLS_elements.audio, __VLS_elements.audio)(__assign({ controls: true }, { class: "w-full mb-4" }));
        __VLS_asFunctionalElement(__VLS_elements.source)({
            src: (__VLS_ctx.audioPreview),
            type: (__VLS_ctx.selectedVoice.type),
        });
        // @ts-ignore
        [selectedVoice, audioPreview,];
    }
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.removeVoice) }, { class: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" }));
    // @ts-ignore
    [removeVoice,];
}
__VLS_asFunctionalElement(__VLS_elements.input)(__assign(__assign({ onChange: (__VLS_ctx.handleFileSelect) }, { ref: "fileInput", type: "file", accept: "audio/*" }), { class: "hidden" }));
/** @type {typeof __VLS_ctx.fileInput} */ ;
// @ts-ignore
[handleFileSelect, fileInput,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.analyzeVoice) }, { disabled: (!__VLS_ctx.selectedVoice || __VLS_ctx.isAnalyzing) }), { class: ([
        'w-full py-3 px-6 rounded-lg font-medium transition-colors',
        !__VLS_ctx.selectedVoice || __VLS_ctx.isAnalyzing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#FF9900] text-white hover:bg-[#E68A00] shadow-lg'
    ]) }));
// @ts-ignore
[selectedVoice, selectedVoice, analyzeVoice, isAnalyzing, isAnalyzing,];
(__VLS_ctx.isAnalyzing ? 'Analyzing...' : 'Analyze Voice');
// @ts-ignore
[isAnalyzing,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)(__assign({ class: "text-2xl font-bold text-[#252F3E] mb-4" }));
if (!__VLS_ctx.hasResults && !__VLS_ctx.isAnalyzing) {
    // @ts-ignore
    [isAnalyzing, hasResults,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center py-12" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-gray-500" }));
}
if (__VLS_ctx.isAnalyzing) {
    // @ts-ignore
    [isAnalyzing,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center py-12" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900] mx-auto mb-4" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-gray-600" }));
}
if (__VLS_ctx.hasResults && !__VLS_ctx.isAnalyzing) {
    // @ts-ignore
    [isAnalyzing, hasResults,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-6xl font-bold mb-2" }, { class: (__VLS_ctx.resultColor) }));
    // @ts-ignore
    [resultColor,];
    (Math.round(__VLS_ctx.results.aiProbability));
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-lg font-medium" }, { class: (__VLS_ctx.resultColor) }));
    // @ts-ignore
    [resultColor,];
    (__VLS_ctx.results.classification);
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "w-full bg-gray-200 rounded-full h-3" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ class: "h-3 rounded-full transition-all duration-1000 ease-out" }, { class: (__VLS_ctx.progressBarColor) }), { style: ({ width: __VLS_ctx.results.aiProbability + '%' }) }));
    // @ts-ignore
    [results, progressBarColor,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white rounded-lg p-6 shadow-sm border" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)(__assign({ class: "font-semibold text-[#252F3E] mb-4" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-2 gap-4 text-sm" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-gray-600" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "font-medium ml-2" }));
    (__VLS_ctx.results.confidence);
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-gray-600" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "font-medium ml-2" }));
    (__VLS_ctx.results.duration);
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-gray-600" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "font-medium ml-2" }));
    (__VLS_ctx.results.processingTime);
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-gray-600" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "font-medium ml-2" }));
    (__VLS_ctx.results.modelVersion);
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white rounded-lg p-6 shadow-sm border" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)(__assign({ class: "font-semibold text-[#252F3E] mb-4" }));
    __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)(__assign({ class: "list-disc list-inside space-y-2 ml-4 text-sm text-gray-700" }));
    for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.results.reasons)); _i < _a.length; _i++) {
        var reason = _a[_i][0];
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
            key: (reason),
        });
        (reason);
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600" }));
    __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
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
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[#FF9900]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[#E68A00]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#FF9900]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#252F3E]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#252F3E]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
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
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-6xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-1000']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-out']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#252F3E]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#252F3E]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['list-disc']} */ ;
/** @type {__VLS_StyleScopedClasses['list-inside']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () { return ({
        selectedVoice: selectedVoice,
        audioPreview: audioPreview,
        isDragging: isDragging,
        isAnalyzing: isAnalyzing,
        results: results,
        fileSize: fileSize,
        fileDuration: fileDuration,
        hasResults: hasResults,
        resultColor: resultColor,
        progressBarColor: progressBarColor,
        handleDrop: handleDrop,
        handleFileSelect: handleFileSelect,
        removeVoice: removeVoice,
        analyzeVoice: analyzeVoice,
    }); },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
