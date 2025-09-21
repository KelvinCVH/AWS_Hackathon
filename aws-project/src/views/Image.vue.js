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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var selectedImage = (0, vue_1.ref)(null);
var imagePreview = (0, vue_1.ref)('');
var isDragging = (0, vue_1.ref)(false);
var isAnalyzing = (0, vue_1.ref)(false);
var results = (0, vue_1.ref)(null);
var error = (0, vue_1.ref)(null);
var activeTab = (0, vue_1.ref)('image');
var tabs = [
    { id: 'image', label: 'Image Info' },
    { id: 'detection', label: 'AI Detection' },
    { id: 'technical', label: 'Technical Analysis' },
    { id: 'summary', label: 'Summary' }
];
var fileSize = (0, vue_1.computed)(function () {
    if (!selectedImage.value)
        return '';
    var size = selectedImage.value.size;
    if (size < 1024 * 1024) {
        return "".concat(Math.round(size / 1024), " KB");
    }
    return "".concat((size / (1024 * 1024)).toFixed(1), " MB");
});
var hasResults = (0, vue_1.computed)(function () { return results.value !== null; });
var resultTextColor = (0, vue_1.computed)(function () {
    if (!results.value)
        return 'text-gray-500';
    var score = results.value.aiProbability * 100;
    if (score < 30)
        return 'text-green-600';
    if (score < 70)
        return 'text-yellow-600';
    return 'text-red-600';
});
var progressBarColor = (0, vue_1.computed)(function () {
    if (!results.value)
        return 'bg-gray-400';
    var score = results.value.aiProbability * 100;
    if (score < 30)
        return 'bg-green-500';
    if (score < 70)
        return 'bg-yellow-500';
    return 'bg-red-500';
});
var scoreColor = (0, vue_1.computed)(function () {
    if (!results.value)
        return '#9ca3af';
    var s = results.value.aiProbability * 100;
    if (s < 30)
        return '#10b981';
    if (s < 70)
        return '#f59e0b';
    return '#ef4444';
});
var confidenceBadgeClass = (0, vue_1.computed)(function () {
    var _a;
    if (!((_a = results.value) === null || _a === void 0 ? void 0 : _a.confidence))
        return 'bg-gray-100 text-gray-700';
    var conf = results.value.confidence;
    if (conf > 0.8)
        return 'bg-green-100 text-green-700';
    if (conf > 0.6)
        return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
});
// For circular progress
var circumference = 2 * Math.PI * 56;
var strokeDashoffset = (0, vue_1.computed)(function () {
    if (!results.value)
        return circumference;
    return circumference - (results.value.aiProbability * 100 / 100) * circumference;
});
var handleDrop = function (e) {
    e.preventDefault();
    isDragging.value = false;
    var files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        processFile(files[0]);
    }
};
var handleFileSelect = function (e) {
    var file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    }
};
var processFile = function (file) {
    selectedImage.value = file;
    var reader = new FileReader();
    reader.onload = function (e) {
        imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
    resetResults();
};
var removeImage = function () {
    selectedImage.value = null;
    imagePreview.value = '';
    resetResults();
};
var resetResults = function () {
    results.value = null;
};
// API configuration
var API_URL = import.meta.env.VUE_APP_IMAGE_API_URL || "https://bbi2604f92.execute-api.ap-southeast-5.amazonaws.com/Prod/process-image";
var generateUniqueFileName = function (originalName) {
    var timestamp = Date.now();
    var randomSuffix = Math.random().toString(36).substring(2, 8);
    var extension = originalName.split('.').pop();
    var nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
    return "".concat(nameWithoutExt, "-").concat(timestamp, "-").concat(randomSuffix, ".").concat(extension);
};
var formatFileSize = function (bytes) {
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
var getFeatureLabel = function (feature) {
    var labels = {
        'texture_consistency': 'Texture Consistency',
        'color_distribution': 'Color Distribution',
        'edge_sharpness': 'Edge Sharpness',
        'noise_patterns': 'Noise Patterns',
        'composition_balance': 'Composition Balance'
    };
    return labels[feature] || feature.charAt(0).toUpperCase() + feature.slice(1);
};
var getFeatureDescription = function (feature, value) {
    var descriptions = {
        'texture_consistency': value > 0.7 ? 'High consistency, AI-like' : value < 0.3 ? 'Variable texture, human-like' : 'Moderate consistency',
        'color_distribution': value > 0.7 ? 'Uniform distribution, AI-like' : value < 0.3 ? 'Natural variation, human-like' : 'Balanced distribution',
        'edge_sharpness': value > 0.7 ? 'Very sharp edges, AI-like' : value < 0.3 ? 'Natural edges, human-like' : 'Moderate sharpness',
        'noise_patterns': value > 0.7 ? 'Artificial noise patterns' : value < 0.3 ? 'Natural noise patterns' : 'Mixed noise patterns',
        'composition_balance': value > 0.7 ? 'Perfect balance, AI-like' : value < 0.3 ? 'Natural imbalance, human-like' : 'Moderate balance'
    };
    return descriptions[feature] || 'Analysis metric';
};
var getMetricColor = function (value) {
    if (value < 0.3)
        return 'text-green-600';
    if (value < 0.5)
        return 'text-yellow-600';
    if (value < 0.7)
        return 'text-orange-600';
    return 'text-red-600';
};
var getMetricBarColor = function (value) {
    if (value < 0.3)
        return 'bg-green-500';
    if (value < 0.5)
        return 'bg-yellow-500';
    if (value < 0.7)
        return 'bg-orange-500';
    return 'bg-red-500';
};
var analyzeImage = function () { return __awaiter(void 0, void 0, void 0, function () {
    var uniqueFileName, fileContent, payload, response, errorData, data, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!selectedImage.value)
                    return [2 /*return*/];
                isAnalyzing.value = true;
                error.value = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, 8, 9]);
                uniqueFileName = generateUniqueFileName(selectedImage.value.name);
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var reader = new FileReader();
                        reader.onload = function () { return resolve(reader.result.split(",")[1]); };
                        reader.onerror = reject;
                        reader.readAsDataURL(selectedImage.value);
                    })
                    // Send image to Lambda function
                ];
            case 2:
                fileContent = _a.sent();
                payload = {
                    action: "upload_and_analyze",
                    fileName: uniqueFileName,
                    fileType: selectedImage.value.type,
                    fileContent: fileContent,
                };
                return [4 /*yield*/, fetch(API_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(payload)
                    })];
            case 3:
                response = _a.sent();
                if (!!response.ok) return [3 /*break*/, 5];
                return [4 /*yield*/, response.json().catch(function () { return ({}); })];
            case 4:
                errorData = _a.sent();
                console.error('API Error:', errorData);
                throw new Error("Analysis failed: ".concat(errorData.error || response.statusText));
            case 5: return [4 /*yield*/, response.json()
                // Format results for UI
            ];
            case 6:
                data = _a.sent();
                // Format results for UI
                results.value = {
                    aiProbability: data.ai_probability || 0.5,
                    assessment: data.assessment || 'Uncertain',
                    explanation: data.explanation || 'Analysis completed',
                    confidence: data.confidence || 0.5,
                    keyIndicators: data.key_indicators || [],
                    recommendations: data.recommendations || '',
                    imageMetadata: data.image_metadata || {},
                    artidFeatures: data.artid_features || {},
                    modelInfo: data.model_info || {},
                    analysisVersion: data.analysis_version || 'v1.0'
                };
                return [3 /*break*/, 9];
            case 7:
                err_1 = _a.sent();
                console.error('Analysis error:', err_1);
                error.value = err_1.message.includes('Failed to fetch')
                    ? 'Unable to connect to analysis service. Please check your connection.'
                    : err_1.message;
                return [3 /*break*/, 9];
            case 8:
                isAnalyzing.value = false;
                return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}); };
var retryAnalysis = function () {
    error.value = null;
    analyzeImage();
};
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
if (!__VLS_ctx.selectedImage) {
    // @ts-ignore
    [selectedImage,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-12 h-12 text-gray-400 mb-4 mx-auto" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_elements.path, __VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-gray-600 mb-2" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(!__VLS_ctx.selectedImage))
                return;
            __VLS_ctx.$refs.fileInput.click();
            // @ts-ignore
            [$refs,];
        } }, { class: "px-4 py-2 bg-[#FF9900] text-white rounded hover:bg-[#E68A00] transition-colors" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-500 mt-2" }));
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "relative w-full h-full" }));
    __VLS_asFunctionalElement(__VLS_elements.img)(__assign({ src: (__VLS_ctx.imagePreview), alt: "Selected image" }, { class: "w-full h-full object-contain rounded-lg" }));
    // @ts-ignore
    [imagePreview,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.removeImage) }, { class: "absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors" }));
    // @ts-ignore
    [removeImage,];
}
__VLS_asFunctionalElement(__VLS_elements.input)(__assign(__assign({ onChange: (__VLS_ctx.handleFileSelect) }, { ref: "fileInput", type: "file", accept: "image/*" }), { class: "hidden" }));
/** @type {typeof __VLS_ctx.fileInput} */ ;
// @ts-ignore
[handleFileSelect, fileInput,];
if (__VLS_ctx.selectedImage) {
    // @ts-ignore
    [selectedImage,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "absolute bottom-4 right-4 bg-white bg-opacity-90 rounded px-3 py-1" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm text-gray-600" }));
    (__VLS_ctx.fileSize);
    // @ts-ignore
    [fileSize,];
}
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.analyzeImage) }, { disabled: (!__VLS_ctx.selectedImage || __VLS_ctx.isAnalyzing) }), { class: ([
        'w-full py-3 px-6 rounded-lg font-medium transition-colors',
        !__VLS_ctx.selectedImage || __VLS_ctx.isAnalyzing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#FF9900] text-white hover:bg-[#E68A00] shadow-lg'
    ]) }));
// @ts-ignore
[selectedImage, selectedImage, analyzeImage, isAnalyzing, isAnalyzing,];
(__VLS_ctx.isAnalyzing ? 'Analyzing...' : 'Analyze Image');
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
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
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
    (Math.round(__VLS_ctx.results.aiProbability * 100));
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-500" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex-1" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xl font-semibold mb-2" }, { class: (__VLS_ctx.resultTextColor) }));
    // @ts-ignore
    [resultTextColor,];
    (__VLS_ctx.results.assessment);
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-600" }));
    (__VLS_ctx.results.explanation);
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white rounded-xl shadow-lg border" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "border-b" }));
    __VLS_asFunctionalElement(__VLS_elements.nav, __VLS_elements.nav)(__assign({ class: "flex -mb-px" }));
    var _loop_1 = function (tab) {
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
    for (var _i = 0, _g = __VLS_getVForSourceType((__VLS_ctx.tabs)); _i < _g.length; _i++) {
        var tab = _g[_i][0];
        _loop_1(tab);
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "p-6" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'image') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800 mb-3" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-2 gap-4" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gray-50 rounded-lg p-3" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-600 mb-1" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "font-semibold" }));
    (((_a = __VLS_ctx.results.imageMetadata) === null || _a === void 0 ? void 0 : _a.width) || 'Unknown');
    (((_b = __VLS_ctx.results.imageMetadata) === null || _b === void 0 ? void 0 : _b.height) || 'Unknown');
    // @ts-ignore
    [results, results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gray-50 rounded-lg p-3" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-600 mb-1" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "font-semibold" }));
    (__VLS_ctx.formatFileSize(((_c = __VLS_ctx.results.imageMetadata) === null || _c === void 0 ? void 0 : _c.file_size) || 0));
    // @ts-ignore
    [results, formatFileSize,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gray-50 rounded-lg p-3" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-600 mb-1" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "font-semibold" }));
    (((_d = __VLS_ctx.results.imageMetadata) === null || _d === void 0 ? void 0 : _d.format) || 'Unknown');
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gray-50 rounded-lg p-3" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-600 mb-1" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "font-semibold" }));
    (((_e = __VLS_ctx.results.modelInfo) === null || _e === void 0 ? void 0 : _e.version) || 'v1.0');
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'detection') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800 mb-3" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gray-50 rounded-lg p-4" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-3" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm font-medium text-gray-700" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-lg font-bold" }, { class: (__VLS_ctx.resultTextColor) }));
    // @ts-ignore
    [resultTextColor,];
    (Math.round(__VLS_ctx.results.aiProbability * 100));
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "w-full bg-gray-200 rounded-full h-3" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ class: "h-3 rounded-full transition-all duration-1000 ease-out" }, { class: (__VLS_ctx.progressBarColor) }), { style: ({ width: (__VLS_ctx.results.aiProbability * 100) + '%' }) }));
    // @ts-ignore
    [results, progressBarColor,];
    if (__VLS_ctx.results.keyIndicators && __VLS_ctx.results.keyIndicators.length > 0) {
        // @ts-ignore
        [results, results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-3" }));
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "text-sm font-medium text-gray-700" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-2" }));
        for (var _h = 0, _j = __VLS_getVForSourceType((__VLS_ctx.results.keyIndicators)); _h < _j.length; _h++) {
            var indicator = _j[_h][0];
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (indicator) }, { class: "flex items-start" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "mr-2 mt-0.5" }));
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm leading-relaxed flex-1" }));
            (indicator);
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'technical') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800 mb-3" }));
    if (__VLS_ctx.results.artidFeatures) {
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "text-sm font-medium text-gray-700 mb-3" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-2 gap-4" }));
        for (var _k = 0, _l = __VLS_getVForSourceType((__VLS_ctx.results.artidFeatures)); _k < _l.length; _k++) {
            var _m = _l[_k], value = _m[0], feature = _m[1];
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (feature) }, { class: "bg-gray-50 rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-medium text-gray-700" }));
            (__VLS_ctx.getFeatureLabel(feature));
            // @ts-ignore
            [getFeatureLabel,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-lg font-bold" }, { class: (__VLS_ctx.getMetricColor(value)) }));
            // @ts-ignore
            [getMetricColor,];
            (Math.round(value * 100));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "w-full bg-gray-200 rounded-full h-2" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ class: "h-2 rounded-full transition-all duration-1000 ease-out" }, { class: (__VLS_ctx.getMetricBarColor(value)) }), { style: ({ width: (value * 100) + '%' }) }));
            // @ts-ignore
            [getMetricBarColor,];
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-500 mt-1" }));
            (__VLS_ctx.getFeatureDescription(feature, value));
            // @ts-ignore
            [getFeatureDescription,];
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'summary') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800 mb-3" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-blue-50 rounded-lg p-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "text-sm font-medium text-blue-800 mb-2" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-blue-700 leading-relaxed" }));
    __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
    (Math.round(__VLS_ctx.results.aiProbability * 100));
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
    (((_f = __VLS_ctx.results.assessment) === null || _f === void 0 ? void 0 : _f.toLowerCase()) || 'of uncertain origin');
    // @ts-ignore
    [results,];
    if (__VLS_ctx.results.explanation) {
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gray-50 rounded-lg p-4" }));
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "text-sm font-medium text-gray-700 mb-2" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-600 leading-relaxed" }));
        (__VLS_ctx.results.explanation);
        // @ts-ignore
        [results,];
    }
    if (__VLS_ctx.results.recommendations) {
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-amber-50 border border-amber-200 rounded-lg p-4" }));
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "text-sm font-medium text-amber-800 mb-2" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-amber-700" }));
        (__VLS_ctx.results.recommendations);
        // @ts-ignore
        [results,];
    }
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
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-contain']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-2']} */ ;
/** @type {__VLS_StyleScopedClasses['right-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-90']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
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
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
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
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
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
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-1000']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-out']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-1000']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-out']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-amber-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-amber-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-700']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () { return ({
        selectedImage: selectedImage,
        imagePreview: imagePreview,
        isDragging: isDragging,
        isAnalyzing: isAnalyzing,
        results: results,
        error: error,
        activeTab: activeTab,
        tabs: tabs,
        fileSize: fileSize,
        hasResults: hasResults,
        resultTextColor: resultTextColor,
        progressBarColor: progressBarColor,
        scoreColor: scoreColor,
        confidenceBadgeClass: confidenceBadgeClass,
        circumference: circumference,
        strokeDashoffset: strokeDashoffset,
        handleDrop: handleDrop,
        handleFileSelect: handleFileSelect,
        removeImage: removeImage,
        formatFileSize: formatFileSize,
        getFeatureLabel: getFeatureLabel,
        getFeatureDescription: getFeatureDescription,
        getMetricColor: getMetricColor,
        getMetricBarColor: getMetricBarColor,
        analyzeImage: analyzeImage,
        retryAnalysis: retryAnalysis,
    }); },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
