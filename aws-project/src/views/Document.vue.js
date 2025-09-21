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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var selectedFile = (0, vue_1.ref)(null);
var documentContent = (0, vue_1.ref)('');
var isAnalyzing = (0, vue_1.ref)(false);
var results = (0, vue_1.ref)(null);
var isDragging = (0, vue_1.ref)(false);
var fileInput = (0, vue_1.ref)(null);
var uploadProgress = (0, vue_1.ref)(0);
var analysisStep = (0, vue_1.ref)('');
var error = (0, vue_1.ref)(null);
var activeTab = (0, vue_1.ref)('document');
var selectedAnalysisSection = (0, vue_1.ref)('document');
// Sync selectedAnalysisSection with activeTab
(0, vue_1.watch)(activeTab, function (newTab) {
    selectedAnalysisSection.value = newTab;
});
var tabs = [
    { id: 'document', label: 'Document Info', description: 'File details and basic information' },
    { id: 'detection', label: 'AI Detection', description: 'AI content detection results' },
    { id: 'rubric', label: 'Rubric Analysis', description: '8-category rubric-based analysis' },
    { id: 'factcheck', label: 'Fact Check', description: 'Factual accuracy and hallucination detection' },
    { id: 'academic', label: 'Academic Analysis', description: 'Academic integrity analysis' },
    { id: 'integrity', label: 'Integrity Dashboard', description: 'Comprehensive integrity metrics' },
    { id: 'content', label: 'Content Analysis', description: 'Detailed content breakdown' },
    { id: 'advanced', label: 'Advanced Analysis', description: 'Technical analysis details' },
    { id: 'summary', label: 'Summary', description: 'Overall analysis summary' }
];
var wordCount = (0, vue_1.computed)(function () {
    if (!documentContent.value)
        return 0;
    return documentContent.value.trim().split(/\s+/).filter(function (w) { return w.length > 0; }).length;
});
var documentPreview = (0, vue_1.computed)(function () {
    if (!documentContent.value)
        return '';
    return documentContent.value.substring(0, 500);
});
var hasResults = (0, vue_1.computed)(function () { return results.value !== null; });
var resultTextColor = (0, vue_1.computed)(function () {
    if (!results.value)
        return 'text-gray-500';
    var score = results.value.ai_score || results.value.aiProbability || 50;
    if (score < 30)
        return 'text-green-600';
    if (score < 70)
        return 'text-yellow-600';
    return 'text-red-600';
});
var progressBarColor = (0, vue_1.computed)(function () {
    if (!results.value)
        return 'bg-gray-400';
    var score = results.value.ai_score || results.value.aiProbability || 50;
    if (score < 30)
        return 'bg-green-500';
    if (score < 70)
        return 'bg-yellow-500';
    return 'bg-red-500';
});
var scoreColor = (0, vue_1.computed)(function () {
    if (!results.value)
        return '#9ca3af';
    var s = results.value.ai_score || results.value.aiProbability || 50;
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
    var conf = results.value.confidence.toLowerCase();
    if (conf === 'high')
        return 'bg-green-100 text-green-700';
    if (conf === 'medium')
        return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
});
var sentimentBadgeClass = (0, vue_1.computed)(function () {
    var _a;
    if (!((_a = results.value) === null || _a === void 0 ? void 0 : _a.sentiment))
        return 'bg-gray-100 text-gray-700';
    var sentiment = results.value.sentiment;
    if (sentiment === 'POSITIVE')
        return 'bg-green-100 text-green-700';
    if (sentiment === 'NEGATIVE')
        return 'bg-red-100 text-red-700';
    if (sentiment === 'MIXED')
        return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
});
var getSentimentDisplay = function () {
    var _a, _b;
    if (!((_a = results.value) === null || _a === void 0 ? void 0 : _a.sentiment))
        return 'Not Available';
    var sentiment = results.value.sentiment;
    if (sentiment === 'UNKNOWN') {
        // Try to determine sentiment from comprehend analysis scores
        if ((_b = results.value.comprehendAnalysis) === null || _b === void 0 ? void 0 : _b.sentiment_scores) {
            var scores = results.value.comprehendAnalysis.sentiment_scores;
            var maxScore = Math.max(scores.POSITIVE || 0, scores.NEGATIVE || 0, scores.NEUTRAL || 0);
            if (scores.POSITIVE === maxScore)
                return 'POSITIVE';
            if (scores.NEGATIVE === maxScore)
                return 'NEGATIVE';
            if (scores.NEUTRAL === maxScore)
                return 'NEUTRAL';
        }
        return 'NEUTRAL'; // Default fallback
    }
    return sentiment;
};
var formatCategoryName = function (name) {
    var categoryMap = {
        'perplexity_burstiness': 'Perplexity & Burstiness',
        'repetitiveness_redundancy': 'Repetitiveness & Redundancy',
        'factuality_hallucination': 'Factuality & Hallucination',
        'stylistic_consistency': 'Stylistic Consistency',
        'writing_style': 'Writing Style',
        'connectors_hedging': 'Connectors & Hedging',
        'semantic_depth': 'Semantic Depth',
        'metadata_time_clues': 'Metadata & Time Clues',
        'llm_patterns': 'LLM Pattern Detection'
    };
    return categoryMap[name] || name.replace(/_/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); });
};
var interpretationDetail = (0, vue_1.computed)(function () {
    if (!results.value)
        return '';
    var s = results.value.ai_score || results.value.aiProbability || 50;
    if (s < 20)
        return 'Strong indicators of human authorship with natural writing patterns and personal voice.';
    if (s < 40)
        return 'Shows characteristics typical of human writing with some formal elements.';
    if (s < 60)
        return 'Mixed signals - could be edited human text or AI content with human touches.';
    if (s < 80)
        return 'Exhibits patterns commonly found in AI-generated content.';
    return 'Strong AI patterns detected including formulaic language and perfect structure.';
});
// For circular progress
var circumference = 2 * Math.PI * 56;
var strokeDashoffset = (0, vue_1.computed)(function () {
    if (!results.value)
        return circumference;
    var score = results.value.ai_score || results.value.aiProbability || 50;
    return circumference - (score / 100) * circumference;
});
var formatFileSize = function (bytes) {
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
var getLoadingText = function () {
    if (uploadProgress.value > 0 && uploadProgress.value < 100) {
        return 'Processing Document...';
    }
    return 'Analyzing Document...';
};
var getClassification = function (score) {
    if (score >= 80)
        return 'Likely AI Generated';
    if (score >= 60)
        return 'Possibly AI Generated';
    if (score >= 40)
        return 'Uncertain Origin';
    if (score >= 20)
        return 'Possibly Human Written';
    return 'Likely Human Written';
};
var getFileExtension = function () {
    if (!selectedFile.value)
        return 'N/A';
    return selectedFile.value.name.split('.').pop().toUpperCase();
};
var getWritingStyle = function () {
    if (!results.value)
        return 'Unknown';
    var score = results.value.aiProbability;
    if (score < 30)
        return 'Natural & Personal';
    if (score < 60)
        return 'Formal & Structured';
    return 'Highly Polished';
};
var getComplexityLevel = function () {
    if (!results.value)
        return 'Unknown';
    var wordCount = results.value.textLength || 0;
    if (wordCount < 100)
        return 'Simple';
    if (wordCount < 500)
        return 'Moderate';
    return 'Complex';
};
var getContentType = function () {
    if (!selectedFile.value)
        return 'Unknown';
    var name = selectedFile.value.name.toLowerCase();
    if (name.includes('report') || name.includes('summary'))
        return 'Report/Summary';
    if (name.includes('essay') || name.includes('article'))
        return 'Essay/Article';
    if (name.includes('review'))
        return 'Review';
    return 'General Document';
};
// Explanation parsing functions
var parseExplanation = function (explanation) {
    if (!explanation)
        return [];
    return explanation
        .split(/\.\s+(?=[A-Z])|(?:\s*\|\s*)|(?:\s*\.\s*$)/)
        .filter(function (part) { return part && part.trim().length > 0; })
        .map(function (part) { return part.trim(); });
};
var getExplanationPartClass = function (part) {
    var partLower = part.toLowerCase();
    if (partLower.includes('human pattern') || partLower.includes('human trait')) {
        return 'bg-green-50 p-3 rounded-lg';
    }
    if (partLower.includes('ai pattern') || partLower.includes('ai trait')) {
        return 'bg-red-50 p-3 rounded-lg';
    }
    return 'bg-gray-50 p-3 rounded-lg';
};
var getExplanationIcon = function (part) {
    var partLower = part.toLowerCase();
    if (partLower.includes('human'))
        return '👤';
    if (partLower.includes('ai'))
        return '🤖';
    if (partLower.includes('linguistic'))
        return '📝';
    return '📊';
};
var cleanExplanationPart = function (part) {
    return part
        .replace(/^(Human patterns:|AI patterns:|Linguistic features:)\s*/i, '')
        .replace(/\s+/g, ' ')
        .trim();
};
var formatFullExplanation = function (explanation) {
    if (!explanation)
        return 'No detailed explanation available.';
    return explanation.replace(/\s*\|\s*/g, '. ').replace(/\.\./g, '.').trim();
};
// New functions for better metrics display
var getMainAnalysisText = function (explanation) {
    if (!explanation)
        return 'No analysis available.';
    // Extract the main analysis text before the metrics
    var parts = explanation.split('├─');
    return parts[0].trim();
};
var hasMetrics = function (explanation) {
    if (!explanation)
        return false;
    return explanation.includes('├─') || explanation.includes('└─');
};
var parseMetrics = function (explanation) {
    if (!explanation)
        return [];
    var metrics = [];
    var lines = explanation.split('\n');
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        // Match patterns like "├─ Perplexity: 50%" or "├─ Burstiness: 40%"
        var match = line.match(/├─\s*(\w+):\s*(\d+)%/);
        if (match) {
            var name_1 = match[1].toLowerCase();
            var value = parseInt(match[2]);
            var label = getMetricLabel(name_1);
            metrics.push({ name: name_1, value: value, label: label });
        }
    }
    return metrics;
};
var getMetricLabel = function (name) {
    var labels = {
        'perplexity': 'Perplexity',
        'burstiness': 'Burstiness',
        'artifacts': 'AI Markers',
        'coherence': 'Coherence',
        'starters': 'Sentence Starters',
        'personal': 'Personal Touch',
        'academic': 'Academic Style'
    };
    return labels[name] || name.charAt(0).toUpperCase() + name.slice(1);
};
var getMetricColor = function (value) {
    if (value < 30)
        return 'text-green-600';
    if (value < 50)
        return 'text-yellow-600';
    if (value < 70)
        return 'text-orange-600';
    return 'text-red-600';
};
var getMetricBarColor = function (value) {
    if (value < 30)
        return 'bg-green-500';
    if (value < 50)
        return 'bg-yellow-500';
    if (value < 70)
        return 'bg-orange-500';
    return 'bg-red-500';
};
var getMetricDescription = function (name, value) {
    var descriptions = {
        'perplexity': value < 30 ? 'Low complexity, more human-like' : value > 70 ? 'High complexity, AI-like patterns' : 'Moderate complexity',
        'burstiness': value < 30 ? 'Consistent rhythm, AI-like' : value > 70 ? 'Variable rhythm, human-like' : 'Balanced rhythm',
        'artifacts': value < 30 ? 'Few AI markers detected' : value > 70 ? 'Many AI markers detected' : 'Some AI markers present',
        'coherence': value < 30 ? 'Low coherence, human-like' : value > 70 ? 'High coherence, AI-like' : 'Moderate coherence'
    };
    return descriptions[name] || 'Analysis metric';
};
var hasConfidence = function (explanation) {
    if (!explanation)
        return false;
    return explanation.includes('└─ Confidence:') || explanation.includes('Confidence:');
};
var getConfidenceLevel = function (explanation) {
    if (!explanation)
        return 'Unknown';
    var match = explanation.match(/└─\s*Confidence:\s*(\w+)/i);
    return match ? match[1] : 'Unknown';
};
// Fact-checking helper functions
var getFactualAccuracyColor = function (accuracy) {
    if (accuracy >= 80)
        return 'text-green-600';
    if (accuracy >= 60)
        return 'text-yellow-600';
    return 'text-red-600';
};
var getFactualAccuracyBarColor = function (accuracy) {
    if (accuracy >= 80)
        return 'bg-green-500';
    if (accuracy >= 60)
        return 'bg-yellow-500';
    return 'bg-red-500';
};
var getFactualAccuracyDescription = function (accuracy) {
    if (accuracy >= 90)
        return 'Excellent factual accuracy with minimal issues detected.';
    if (accuracy >= 80)
        return 'Good factual accuracy with some minor issues.';
    if (accuracy >= 60)
        return 'Moderate factual accuracy with several issues detected.';
    if (accuracy >= 40)
        return 'Poor factual accuracy with many issues detected.';
    return 'Very poor factual accuracy with significant issues detected.';
};
// Helper functions for enhanced analysis
var getFeatureLabel = function (feature) {
    var labels = {
        'perplexity': 'Perplexity',
        'burstiness': 'Burstiness',
        'artifacts': 'AI Markers',
        'coherence': 'Coherence',
        'starters': 'Sentence Starters',
        'personal': 'Personal Touch',
        'academic': 'Academic Style',
        'structure': 'Sentence Structure',
        'vocabulary': 'Vocabulary Sophistication',
        'repetition': 'Repetition Patterns',
        'temporal': 'Temporal References',
        'ngrams': 'N-gram Analysis'
    };
    return labels[feature] || feature.charAt(0).toUpperCase() + feature.slice(1);
};
var getFeatureDescription = function (feature, value) {
    var descriptions = {
        'perplexity': value < 30 ? 'Low complexity, more human-like' : value > 70 ? 'High complexity, AI-like patterns' : 'Moderate complexity',
        'burstiness': value < 30 ? 'Consistent rhythm, AI-like' : value > 70 ? 'Variable rhythm, human-like' : 'Balanced rhythm',
        'artifacts': value < 30 ? 'Few AI markers detected' : value > 70 ? 'Many AI markers detected' : 'Some AI markers present',
        'coherence': value < 30 ? 'Low coherence, human-like' : value > 70 ? 'High coherence, AI-like' : 'Moderate coherence',
        'structure': value < 30 ? 'Variable structure, human-like' : value > 70 ? 'Consistent structure, AI-like' : 'Balanced structure',
        'vocabulary': value < 30 ? 'Simple vocabulary, human-like' : value > 70 ? 'Sophisticated vocabulary, AI-like' : 'Moderate sophistication',
        'repetition': value < 30 ? 'High repetition, human-like' : value > 70 ? 'Low repetition, AI-like' : 'Moderate repetition',
        'temporal': value < 30 ? 'Many temporal references, human-like' : value > 70 ? 'Few temporal references, AI-like' : 'Moderate references'
    };
    return descriptions[feature] || 'Analysis metric';
};
// New helper functions for simplified analysis
var getAnalysisTitle = function (key) {
    var titles = {
        'writing_style': 'Writing Style',
        'personal_touch': 'Personal Touch',
        'content_specificity': 'Content Specificity',
        'language_complexity': 'Language Complexity'
    };
    return titles[key] || key;
};
var getAnalysisIndicatorClass = function (indicator) {
    var classes = {
        'Natural': 'bg-green-100 text-green-800',
        'Formal': 'bg-blue-100 text-blue-800',
        'Personal': 'bg-green-100 text-green-800',
        'Generic': 'bg-gray-100 text-gray-800',
        'Specific': 'bg-blue-100 text-blue-800',
        'Vague': 'bg-yellow-100 text-yellow-800',
        'Varied': 'bg-purple-100 text-purple-800',
        'Uniform': 'bg-orange-100 text-orange-800'
    };
    return classes[indicator] || 'bg-gray-100 text-gray-800';
};
var getScoreColor = function (score) {
    if (score < 30)
        return 'text-red-600';
    if (score < 60)
        return 'text-yellow-600';
    return 'text-green-600';
};
var getScoreBarColor = function (score) {
    if (score < 30)
        return 'bg-red-500';
    if (score < 60)
        return 'bg-yellow-500';
    return 'bg-green-500';
};
// Legacy analysis compatibility
var hasLegacyAnalysis = function () {
    return results.value && (results.value.comprehendAnalysis || results.value.linguisticFeatures);
};
var convertLegacyToSimplified = function () {
    var _a, _b;
    if (!results.value)
        return {};
    var legacy = results.value;
    var simplified = {};
    // Convert linguistic features if available
    if (legacy.linguisticFeatures) {
        simplified.writing_style = {
            score: legacy.linguisticFeatures.perplexity || 50,
            description: "How natural and varied the writing appears",
            indicator: (legacy.linguisticFeatures.perplexity || 50) < 40 ? "Natural" : "Formal"
        };
        simplified.personal_touch = {
            score: legacy.linguisticFeatures.human_score || 50,
            description: "Evidence of personal experience and emotion",
            indicator: (legacy.linguisticFeatures.human_score || 50) > 60 ? "Personal" : "Generic"
        };
        simplified.language_complexity = {
            score: legacy.linguisticFeatures.complexity_variation || 50,
            description: "Variation in sentence structure and vocabulary",
            indicator: (legacy.linguisticFeatures.complexity_variation || 50) > 60 ? "Varied" : "Uniform"
        };
    }
    // Convert comprehend analysis if available
    if (legacy.comprehendAnalysis) {
        simplified.content_specificity = {
            score: (((_a = legacy.comprehendAnalysis.entities) === null || _a === void 0 ? void 0 : _a.length) || 0) * 10,
            description: "Use of specific details and concrete information",
            indicator: (((_b = legacy.comprehendAnalysis.entities) === null || _b === void 0 ? void 0 : _b.length) || 0) > 3 ? "Specific" : "Vague"
        };
    }
    return simplified;
};
var handleDrop = function (e) {
    e.preventDefault();
    isDragging.value = false;
    var files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
};
var handleFileSelect = function (e) {
    var files = e.target.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
};
var handleFile = function (file) { return __awaiter(void 0, void 0, void 0, function () {
    var allowedTypes, text, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Check file size (10MB limit)
                if (file.size > 10 * 1024 * 1024) {
                    alert('File size must be less than 10MB');
                    return [2 /*return*/];
                }
                allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
                if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
                    alert('Please upload a PDF, DOC, DOCX, or TXT file');
                    return [2 /*return*/];
                }
                selectedFile.value = file;
                if (!(file.type === 'text/plain')) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, file.text()];
            case 2:
                text = _a.sent();
                documentContent.value = text;
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error('Error reading text file:', error_1);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                // Clear preview for non-text files (will be extracted by backend)
                documentContent.value = '';
                _a.label = 6;
            case 6:
                resetResults();
                return [2 /*return*/];
        }
    });
}); };
var clearFile = function () {
    selectedFile.value = null;
    documentContent.value = '';
    resetResults();
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};
var resetResults = function () {
    results.value = null;
    uploadProgress.value = 0;
    analysisStep.value = '';
    error.value = null;
    activeTab.value = 'document';
};
// API configuration
var API_URL = "https://bbi2604f92.execute-api.ap-southeast-5.amazonaws.com/Prod/process-document";
var generateUniqueFileName = function (originalName) {
    var timestamp = Date.now();
    var randomSuffix = Math.random().toString(36).substring(2, 8);
    var extension = originalName.split('.').pop();
    var nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
    return "".concat(nameWithoutExt, "-").concat(timestamp, "-").concat(randomSuffix, ".").concat(extension);
};
var analyzeDocument = function () { return __awaiter(void 0, void 0, void 0, function () {
    var uniqueFileName, fileContent, payload, response, errorData, data, responseText, jsonMatch, firstBrace, braceCount, endIndex, i, parseError_1, err_1;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                if (!selectedFile.value)
                    return [2 /*return*/];
                isAnalyzing.value = true;
                uploadProgress.value = 0;
                error.value = null;
                _l.label = 1;
            case 1:
                _l.trys.push([1, 10, 11, 12]);
                analysisStep.value = 'Preparing document for analysis...';
                uploadProgress.value = 20;
                uniqueFileName = generateUniqueFileName(selectedFile.value.name);
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var reader = new FileReader();
                        reader.onload = function () { return resolve(reader.result.split(",")[1]); };
                        reader.onerror = reject;
                        reader.readAsDataURL(selectedFile.value);
                    })];
            case 2:
                fileContent = _l.sent();
                uploadProgress.value = 50;
                analysisStep.value = 'Uploading and analyzing document...';
                payload = {
                    action: "upload_and_analyze",
                    fileName: uniqueFileName,
                    fileType: selectedFile.value.type,
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
                response = _l.sent();
                uploadProgress.value = 80;
                analysisStep.value = 'Processing results...';
                if (!!response.ok) return [3 /*break*/, 5];
                return [4 /*yield*/, response.json().catch(function () { return ({}); })];
            case 4:
                errorData = _l.sent();
                console.error('API Error:', errorData);
                throw new Error("Analysis failed: ".concat(errorData.error || response.statusText));
            case 5:
                data = void 0;
                _l.label = 6;
            case 6:
                _l.trys.push([6, 8, , 9]);
                return [4 /*yield*/, response.text()];
            case 7:
                responseText = _l.sent();
                console.log('Raw response length:', responseText.length);
                console.log('Raw response preview:', responseText.substring(0, 200) + '...');
                console.log('Response contains JSON markers:', responseText.includes('{') && responseText.includes('}'));
                // Try to parse as JSON first
                try {
                    data = JSON.parse(responseText);
                }
                catch (jsonError) {
                    console.warn('Direct JSON parse failed, attempting to extract JSON from mixed content');
                    jsonMatch = responseText.match(/\{[\s\S]*?\}(?=\s|$)/);
                    // If no match, try to find the first complete JSON object
                    if (!jsonMatch) {
                        firstBrace = responseText.indexOf('{');
                        if (firstBrace !== -1) {
                            braceCount = 0;
                            endIndex = firstBrace;
                            for (i = firstBrace; i < responseText.length; i++) {
                                if (responseText[i] === '{')
                                    braceCount++;
                                if (responseText[i] === '}')
                                    braceCount--;
                                if (braceCount === 0) {
                                    endIndex = i;
                                    break;
                                }
                            }
                            if (braceCount === 0) {
                                jsonMatch = [responseText.substring(firstBrace, endIndex + 1)];
                            }
                        }
                    }
                    if (jsonMatch) {
                        try {
                            data = JSON.parse(jsonMatch[0]);
                            console.log('Successfully extracted JSON from mixed content');
                        }
                        catch (extractError) {
                            console.error('Failed to parse extracted JSON:', extractError);
                            console.error('Extracted JSON:', jsonMatch[0]);
                            throw new Error("Unable to parse JSON from response: ".concat(extractError.message));
                        }
                    }
                    else {
                        throw new Error('No valid JSON found in response');
                    }
                }
                return [3 /*break*/, 9];
            case 8:
                parseError_1 = _l.sent();
                console.error('JSON Parse Error:', parseError_1);
                console.error('Response text length:', (responseText === null || responseText === void 0 ? void 0 : responseText.length) || 0);
                throw new Error("Invalid response format: ".concat(parseError_1.message));
            case 9:
                uploadProgress.value = 100;
                // Update document content from extracted text
                if (data.input_text) {
                    documentContent.value = data.input_text;
                }
                else if (data.text_length > 0) {
                    // If no input_text but we have text_length, show a message
                    documentContent.value = "Document processed successfully. ".concat(data.text_length, " words extracted.");
                }
                // Debug: Log the received data
                console.log('Received data:', data);
                console.log('Rubric breakdown:', data.rubric_breakdown);
                console.log('Fact checking:', data.fact_checking);
                // Format results for UI - mapping new rubric-based response
                results.value = {
                    aiProbability: data.ai_score || 50,
                    classification: data.classification || getClassification(data.ai_score || 50),
                    confidence: data.confidence || 'medium',
                    textLength: data.text_length || 0,
                    extractionMethod: data.extraction_method || 'auto',
                    modelVersion: data.analysis_version || 'rubric_v1',
                    sentiment: data.sentiment || 'NEUTRAL',
                    keyPhrases: data.key_phrases || [],
                    explanation: data.explanation || 'Analysis completed successfully',
                    documentId: data.document_id || null,
                    objectKey: data.object_key || null,
                    // New rubric-based analysis results
                    comprehendAnalysis: data.comprehend_analysis || {},
                    rubricBreakdown: data.rubric_breakdown || {},
                    factChecking: data.fact_checking || null,
                    // Legacy field mappings for backward compatibility
                    academicAnalysis: data.rubric_breakdown ? {
                        citations_found: ((_a = data.rubric_breakdown.citation_quality) === null || _a === void 0 ? void 0 : _a.citations_found) || 0,
                        suspicious_citations: ((_b = data.rubric_breakdown.citation_quality) === null || _b === void 0 ? void 0 : _b.suspicious_citations) || [],
                        sections_analyzed: 1,
                        high_ai_sections: [],
                        figure_concerns: [],
                        style_concerns: []
                    } : null,
                    integrityDashboard: data.rubric_breakdown ? {
                        overall_assessment: {
                            human_probability: 100 - (data.ai_score || 50),
                            ai_probability: data.ai_score || 50,
                            mixed_content: (data.ai_score || 50) > 40 && (data.ai_score || 50) < 70,
                            confidence_level: data.confidence || 'medium'
                        },
                        section_analysis: {},
                        citation_integrity: data.rubric_breakdown.citation_quality || {},
                        figure_analysis: { figure_count: 0, ai_indicators: 0, suspicious_figures: [] },
                        style_consistency: data.rubric_breakdown.stylistic_consistency || {},
                        actionable_evidence: []
                    } : null,
                    simplifiedAnalysis: data.rubric_breakdown ? {
                        writing_style: {
                            score: ((_c = data.rubric_breakdown.writing_style) === null || _c === void 0 ? void 0 : _c.score) || 50,
                            description: 'Writing style analysis',
                            indicator: ((_d = data.rubric_breakdown.writing_style) === null || _d === void 0 ? void 0 : _d.score) > 70 ? 'AI-like' : 'Human-like'
                        },
                        personal_touch: {
                            score: ((_e = data.rubric_breakdown.writing_style) === null || _e === void 0 ? void 0 : _e.personal_indicators) || 50,
                            description: 'Personal expression and voice',
                            indicator: ((_f = data.rubric_breakdown.writing_style) === null || _f === void 0 ? void 0 : _f.personal_indicators) > 70 ? 'Generic' : 'Personal'
                        },
                        content_specificity: {
                            score: ((_g = data.rubric_breakdown.semantic_depth) === null || _g === void 0 ? void 0 : _g.specificity_score) || 50,
                            description: 'Content specificity and detail',
                            indicator: ((_h = data.rubric_breakdown.semantic_depth) === null || _h === void 0 ? void 0 : _h.specificity_score) > 70 ? 'Vague' : 'Specific'
                        },
                        language_complexity: {
                            score: ((_j = data.rubric_breakdown.perplexity_burstiness) === null || _j === void 0 ? void 0 : _j.score) || 50,
                            description: 'Language complexity and variation',
                            indicator: ((_k = data.rubric_breakdown.perplexity_burstiness) === null || _k === void 0 ? void 0 : _k.score) > 70 ? 'Uniform' : 'Varied'
                        }
                    } : null,
                    standardAnalysis: data.rubric_breakdown || null
                };
                analysisStep.value = 'Analysis complete!';
                return [3 /*break*/, 12];
            case 10:
                err_1 = _l.sent();
                console.error('Analysis error:', err_1);
                error.value = err_1.message.includes('Failed to fetch')
                    ? 'Unable to connect to analysis service. Please check your connection.'
                    : err_1.message;
                return [3 /*break*/, 12];
            case 11:
                isAnalyzing.value = false;
                uploadProgress.value = 0;
                analysisStep.value = '';
                return [7 /*endfinally*/];
            case 12: return [2 /*return*/];
        }
    });
}); };
var retryAnalysis = function () {
    error.value = null;
    analyzeDocument();
};
// Helper functions for academic analysis
var getConfidenceClass = function (confidence) {
    switch (confidence) {
        case 'high':
            return 'bg-green-100 text-green-800';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800';
        case 'low':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
// Helper functions for dropdown selector
var getCurrentSectionDescription = function () {
    var section = tabs.find(function (tab) { return tab.id === selectedAnalysisSection.value; });
    return section ? section.description || 'Analysis section' : 'Select a section';
};
var getCurrentSectionLabel = function () {
    var section = tabs.find(function (tab) { return tab.id === selectedAnalysisSection.value; });
    return section ? section.label : 'Unknown';
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-screen" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)(__assign({ class: "text-2xl font-bold text-[#252F3E] mb-4" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign(__assign({ onDrop: (__VLS_ctx.handleDrop) }, { onDragover: function () { } }), { onDragenter: function () { } }), { class: ([
        'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors',
        __VLS_ctx.isDragging ? 'border-[#FF9900] bg-orange-50' : 'border-gray-300 hover:border-[#FF9900]'
    ]) }));
// @ts-ignore
[handleDrop, isDragging,];
__VLS_asFunctionalElement(__VLS_elements.input)(__assign(__assign({ onChange: (__VLS_ctx.handleFileSelect) }, { ref: "fileInput", type: "file", accept: ".pdf,.doc,.docx,.txt" }), { class: "absolute inset-0 w-full h-full opacity-0 cursor-pointer" }));
/** @type {typeof __VLS_ctx.fileInput} */ ;
// @ts-ignore
[handleFileSelect, fileInput,];
if (!__VLS_ctx.selectedFile) {
    // @ts-ignore
    [selectedFile,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-8 h-8 text-gray-400" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-lg font-medium text-gray-700" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-500" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-400 mt-2" }));
}
if (__VLS_ctx.selectedFile) {
    // @ts-ignore
    [selectedFile,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mx-auto w-16 h-16 bg-[#FF9900] rounded-full flex items-center justify-center" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-8 h-8 text-white" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-lg font-medium text-gray-700" }));
    (__VLS_ctx.selectedFile.name);
    // @ts-ignore
    [selectedFile,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-500" }));
    (__VLS_ctx.formatFileSize(__VLS_ctx.selectedFile.size));
    // @ts-ignore
    [selectedFile, formatFileSize,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.clearFile) }, { class: "text-xs text-red-500 hover:text-red-700 mt-2" }));
    // @ts-ignore
    [clearFile,];
}
if (__VLS_ctx.documentContent) {
    // @ts-ignore
    [documentContent,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mt-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)(__assign({ class: "text-sm font-medium text-[#252F3E] mb-2" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gray-50 border rounded-lg p-4 max-h-48 overflow-y-auto" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-700 whitespace-pre-wrap" }));
    (__VLS_ctx.documentPreview);
    // @ts-ignore
    [documentPreview,];
    if (__VLS_ctx.documentContent.length > 500) {
        // @ts-ignore
        [documentContent,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-500 mt-2" }));
        (Math.max(0, __VLS_ctx.wordCount - 100));
        // @ts-ignore
        [wordCount,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mt-2 text-sm text-gray-500" }));
    (__VLS_ctx.wordCount);
    // @ts-ignore
    [wordCount,];
}
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.analyzeDocument) }, { disabled: (!__VLS_ctx.selectedFile || __VLS_ctx.isAnalyzing) }), { class: ([
        'w-full py-3 px-6 rounded-lg font-medium transition-colors',
        !__VLS_ctx.selectedFile || __VLS_ctx.isAnalyzing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#FF9900] text-white hover:bg-[#E68A00] shadow-lg'
    ]) }));
// @ts-ignore
[selectedFile, selectedFile, analyzeDocument, isAnalyzing, isAnalyzing,];
(__VLS_ctx.isAnalyzing ? __VLS_ctx.getLoadingText() : 'Analyze Document');
// @ts-ignore
[isAnalyzing, getLoadingText,];
if (__VLS_ctx.uploadProgress > 0 && __VLS_ctx.uploadProgress < 100) {
    // @ts-ignore
    [uploadProgress, uploadProgress,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "w-full" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex justify-between text-sm text-gray-600 mb-1" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.uploadProgress);
    // @ts-ignore
    [uploadProgress,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "w-full bg-gray-200 rounded-full h-2" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-[#FF9900] h-2 rounded-full transition-all duration-300" }, { style: ({ width: __VLS_ctx.uploadProgress + '%' }) }));
    // @ts-ignore
    [uploadProgress,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6 lg:sticky lg:top-8 lg:h-fit" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)(__assign({ class: "text-2xl font-bold text-[#252F3E] mb-4" }));
if (!__VLS_ctx.hasResults && !__VLS_ctx.isAnalyzing && !__VLS_ctx.error) {
    // @ts-ignore
    [isAnalyzing, hasResults, error,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center py-12" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-16 h-16 mx-auto mb-4 text-gray-300" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-gray-500" }));
}
if (__VLS_ctx.isAnalyzing) {
    // @ts-ignore
    [isAnalyzing,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center py-12" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900] mx-auto mb-4" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-gray-600" }));
    (__VLS_ctx.getLoadingText());
    // @ts-ignore
    [getLoadingText,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-500 mt-2" }));
    (__VLS_ctx.analysisStep);
    // @ts-ignore
    [analysisStep,];
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
    (Math.round(__VLS_ctx.results.ai_score || __VLS_ctx.results.aiProbability || 50));
    // @ts-ignore
    [results, results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-500" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex-1" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xl font-semibold mb-2" }, { class: (__VLS_ctx.resultTextColor) }));
    // @ts-ignore
    [resultTextColor,];
    (__VLS_ctx.results.classification || __VLS_ctx.getClassification(__VLS_ctx.results.ai_score || __VLS_ctx.results.aiProbability || 50));
    // @ts-ignore
    [results, results, results, getClassification,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-600" }));
    (__VLS_ctx.interpretationDetail);
    // @ts-ignore
    [interpretationDetail,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white rounded-xl shadow-lg border" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "border-b p-6" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)(__assign({ class: "text-lg font-semibold text-gray-800" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full" }));
    (__VLS_ctx.getCurrentSectionDescription());
    // @ts-ignore
    [getCurrentSectionDescription,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "relative" }));
    __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)(__assign(__assign({ onChange: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.hasResults && !__VLS_ctx.isAnalyzing && !__VLS_ctx.error))
                return;
            __VLS_ctx.activeTab = __VLS_ctx.selectedAnalysisSection;
            // @ts-ignore
            [activeTab, selectedAnalysisSection,];
        } }, { value: (__VLS_ctx.selectedAnalysisSection) }), { class: "\u0077\u002d\u0066\u0075\u006c\u006c\u0020\u0070\u0078\u002d\u0034\u0020\u0070\u0079\u002d\u0033\u0020\u0062\u006f\u0072\u0064\u0065\u0072\u0020\u0062\u006f\u0072\u0064\u0065\u0072\u002d\u0067\u0072\u0061\u0079\u002d\u0033\u0030\u0030\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u006c\u0067\u0020\u000d\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u006f\u0075\u0074\u006c\u0069\u006e\u0065\u002d\u006e\u006f\u006e\u0065\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u0072\u0069\u006e\u0067\u002d\u0032\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u0072\u0069\u006e\u0067\u002d\u005b\u0023\u0046\u0046\u0039\u0039\u0030\u0030\u005d\u0020\u000d\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u0062\u006f\u0072\u0064\u0065\u0072\u002d\u005b\u0023\u0046\u0046\u0039\u0039\u0030\u0030\u005d\u0020\u0074\u0072\u0061\u006e\u0073\u0069\u0074\u0069\u006f\u006e\u002d\u0063\u006f\u006c\u006f\u0072\u0073\u0020\u0062\u0067\u002d\u0077\u0068\u0069\u0074\u0065\u0020\u000d\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0061\u0070\u0070\u0065\u0061\u0072\u0061\u006e\u0063\u0065\u002d\u006e\u006f\u006e\u0065" }));
    // @ts-ignore
    [selectedAnalysisSection,];
    for (var _i = 0, _4 = __VLS_getVForSourceType((__VLS_ctx.tabs)); _i < _4.length; _i++) {
        var section = _4[_i][0];
        // @ts-ignore
        [tabs,];
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)(__assign({ key: (section.id), value: (section.id) }, { class: "py-2" }));
        (section.label);
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 text-gray-400" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M19 9l-7 7-7-7",
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mt-4 p-3 bg-[#FF9900]/10 border border-[#FF9900]/20 rounded-lg" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center text-sm text-[#FF9900]" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-4 h-4 mr-2" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    });
    __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
    (__VLS_ctx.getCurrentSectionLabel());
    // @ts-ignore
    [getCurrentSectionLabel,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "p-6" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'document') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-400" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center mb-6" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-6 h-6 text-blue-600 mr-3" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    });
    __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-semibold text-gray-800 text-lg" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-1 lg:grid-cols-2 gap-6" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white rounded-lg p-4 border border-gray-200" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center mb-3" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 text-blue-500 mr-2" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    });
    __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "font-medium text-gray-700" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-3" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex flex-col" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-xs text-gray-500 uppercase tracking-wide mb-1" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-medium text-gray-800 break-all" }));
    (((_a = __VLS_ctx.selectedFile) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown');
    // @ts-ignore
    [selectedFile,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex flex-col" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-xs text-gray-500 uppercase tracking-wide mb-1" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-medium text-gray-800" }));
    (__VLS_ctx.formatFileSize(((_b = __VLS_ctx.selectedFile) === null || _b === void 0 ? void 0 : _b.size) || 0));
    // @ts-ignore
    [selectedFile, formatFileSize,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex flex-col" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-xs text-gray-500 uppercase tracking-wide mb-1" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-medium text-gray-800 break-all" }));
    (((_c = __VLS_ctx.selectedFile) === null || _c === void 0 ? void 0 : _c.type) || 'Unknown');
    // @ts-ignore
    [selectedFile,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white rounded-lg p-4 border border-gray-200" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center mb-3" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 text-green-500 mr-2" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    });
    __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "font-medium text-gray-700" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-3" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex flex-col" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-xs text-gray-500 uppercase tracking-wide mb-1" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-medium text-gray-800" }));
    (__VLS_ctx.results.text_length || __VLS_ctx.results.textLength || __VLS_ctx.wordCount);
    // @ts-ignore
    [wordCount, results, results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex flex-col" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-xs text-gray-500 uppercase tracking-wide mb-1" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-medium text-gray-800" }));
    (__VLS_ctx.results.extraction_method || __VLS_ctx.results.extractionMethod || 'Auto');
    // @ts-ignore
    [results, results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex flex-col" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-xs text-gray-500 uppercase tracking-wide mb-1" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-medium text-gray-800" }));
    (__VLS_ctx.results.analysis_version || __VLS_ctx.results.modelVersion || 'academic_journal_v1');
    // @ts-ignore
    [results, results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-gray-800 mb-3 flex items-center" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 mr-2 text-green-600" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-3 gap-4" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center p-3 bg-blue-50 rounded-lg border border-blue-200" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-2xl font-bold text-blue-600" }));
    (__VLS_ctx.results.text_length || __VLS_ctx.results.textLength || __VLS_ctx.wordCount);
    // @ts-ignore
    [wordCount, results, results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center p-3 bg-green-50 rounded-lg border border-green-200" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-2xl font-bold text-green-600" }));
    (((_d = __VLS_ctx.results.key_phrases) === null || _d === void 0 ? void 0 : _d.length) || ((_e = __VLS_ctx.results.keyPhrases) === null || _e === void 0 ? void 0 : _e.length) || 0);
    // @ts-ignore
    [results, results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center p-3 bg-purple-50 rounded-lg border border-purple-200" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-2xl font-bold text-purple-600" }));
    (((_g = (_f = __VLS_ctx.results.comprehend_analysis) === null || _f === void 0 ? void 0 : _f.entities) === null || _g === void 0 ? void 0 : _g.length) || ((_j = (_h = __VLS_ctx.results.comprehendAnalysis) === null || _h === void 0 ? void 0 : _h.entities) === null || _j === void 0 ? void 0 : _j.length) || 0);
    // @ts-ignore
    [results, results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600" }));
    if (__VLS_ctx.results.academicAnalysis || __VLS_ctx.results.integrityDashboard) {
        // @ts-ignore
        [results, results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }));
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-gray-800 mb-3 flex items-center" }));
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 mr-2 text-orange-600" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm text-green-800" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-medium text-green-600" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm text-green-800" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-medium text-green-600" }));
        if (__VLS_ctx.results.academicAnalysis) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-3 gap-4" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center p-3 bg-orange-50 rounded-lg border border-orange-200" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xl font-bold text-orange-600" }));
            (__VLS_ctx.results.academicAnalysis.citations_found || 0);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center p-3 bg-blue-50 rounded-lg border border-blue-200" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xl font-bold text-blue-600" }));
            (__VLS_ctx.results.academicAnalysis.sections_analyzed || 0);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center p-3 bg-red-50 rounded-lg border border-red-200" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xl font-bold text-red-600" }));
            (((_k = __VLS_ctx.results.academicAnalysis.high_ai_sections) === null || _k === void 0 ? void 0 : _k.length) || 0);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600" }));
        }
    }
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
    (Math.round(__VLS_ctx.results.ai_score || __VLS_ctx.results.aiProbability || 50));
    // @ts-ignore
    [results, results,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "w-full bg-gray-200 rounded-full h-3" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ class: "h-3 rounded-full transition-all duration-1000 ease-out" }, { class: (__VLS_ctx.progressBarColor) }), { style: ({ width: (__VLS_ctx.results.ai_score || __VLS_ctx.results.aiProbability || 50) + '%' }) }));
    // @ts-ignore
    [results, results, progressBarColor,];
    if (__VLS_ctx.results.explanation) {
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "text-sm font-medium text-gray-700" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-blue-50 border border-blue-200 rounded-lg p-4" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-blue-800 leading-relaxed" }));
        (__VLS_ctx.getMainAnalysisText(__VLS_ctx.results.explanation));
        // @ts-ignore
        [results, getMainAnalysisText,];
        if (__VLS_ctx.hasMetrics(__VLS_ctx.results.explanation)) {
            // @ts-ignore
            [results, hasMetrics,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-2 gap-4" }));
            for (var _5 = 0, _6 = __VLS_getVForSourceType((__VLS_ctx.parseMetrics(__VLS_ctx.results.explanation))); _5 < _6.length; _5++) {
                var metric = _6[_5][0];
                // @ts-ignore
                [results, parseMetrics,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (metric.name) }, { class: "bg-gray-50 rounded-lg p-4" }));
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-2" }));
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-medium text-gray-700" }));
                (metric.label);
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-lg font-bold" }, { class: (__VLS_ctx.getMetricColor(metric.value)) }));
                // @ts-ignore
                [getMetricColor,];
                (metric.value);
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "w-full bg-gray-200 rounded-full h-2" }));
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ class: "h-2 rounded-full transition-all duration-1000 ease-out" }, { class: (__VLS_ctx.getMetricBarColor(metric.value)) }), { style: ({ width: metric.value + '%' }) }));
                // @ts-ignore
                [getMetricBarColor,];
                __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-500 mt-1" }));
                (__VLS_ctx.getMetricDescription(metric.name, metric.value));
                // @ts-ignore
                [getMetricDescription,];
            }
        }
        if (__VLS_ctx.hasConfidence(__VLS_ctx.results.explanation)) {
            // @ts-ignore
            [results, hasConfidence,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-green-50 border border-green-200 rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-medium text-green-800" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-bold text-green-700" }));
            (__VLS_ctx.getConfidenceLevel(__VLS_ctx.results.explanation));
            // @ts-ignore
            [results, getConfidenceLevel,];
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'rubric') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded" }));
    if (__VLS_ctx.results.rubricBreakdown) {
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-3" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-semibold text-gray-800 text-lg" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-600 mt-1" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-right" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-3xl font-bold" }, { class: (__VLS_ctx.getScoreColor(__VLS_ctx.results.aiProbability)) }));
        // @ts-ignore
        [results, getScoreColor,];
        (__VLS_ctx.results.aiProbability);
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-sm text-gray-600 mt-1" }));
        (__VLS_ctx.results.classification);
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "w-full bg-gray-200 rounded-full h-3 mb-3" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ class: "h-3 rounded-full transition-all duration-500" }, { class: (__VLS_ctx.getScoreColor(__VLS_ctx.results.aiProbability).replace('text-', 'bg-')) }), { style: ("width: ".concat(__VLS_ctx.results.aiProbability, "%")) }));
        // @ts-ignore
        [results, results, getScoreColor,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between text-sm" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-gray-600" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "font-semibold" }, { class: (__VLS_ctx.getConfidenceClass(__VLS_ctx.results.confidence)) }));
        // @ts-ignore
        [results, getConfidenceClass,];
        (__VLS_ctx.results.confidence);
        // @ts-ignore
        [results,];
        if (__VLS_ctx.results.aiProbability > 70) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-red-600 font-medium" }));
        }
        else if (__VLS_ctx.results.aiProbability < 40) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-green-600 font-medium" }));
        }
        else {
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-orange-600 font-medium" }));
        }
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }));
        if (__VLS_ctx.results.rubricBreakdown.perplexity_burstiness) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "font-medium text-gray-700" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-semibold" }, { class: (__VLS_ctx.getScoreColor(__VLS_ctx.results.rubricBreakdown.perplexity_burstiness.score)) }));
            // @ts-ignore
            [results, getScoreColor,];
            (__VLS_ctx.results.rubricBreakdown.perplexity_burstiness.score);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600 space-y-1" }));
            for (var _7 = 0, _8 = __VLS_getVForSourceType(((_l = __VLS_ctx.results.rubricBreakdown.perplexity_burstiness.details) === null || _l === void 0 ? void 0 : _l.slice(0, 2))); _7 < _8.length; _7++) {
                var detail = _8[_7][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    key: (detail),
                });
                (detail);
            }
        }
        if (__VLS_ctx.results.rubricBreakdown.repetitiveness_redundancy) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "font-medium text-gray-700" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-semibold" }, { class: (__VLS_ctx.getScoreColor(__VLS_ctx.results.rubricBreakdown.repetitiveness_redundancy.score)) }));
            // @ts-ignore
            [results, getScoreColor,];
            (__VLS_ctx.results.rubricBreakdown.repetitiveness_redundancy.score);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600 space-y-1" }));
            for (var _9 = 0, _10 = __VLS_getVForSourceType(((_m = __VLS_ctx.results.rubricBreakdown.repetitiveness_redundancy.details) === null || _m === void 0 ? void 0 : _m.slice(0, 2))); _9 < _10.length; _9++) {
                var detail = _10[_9][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    key: (detail),
                });
                (detail);
            }
        }
        if (__VLS_ctx.results.rubricBreakdown.factuality_hallucination) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "font-medium text-gray-700" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-semibold" }, { class: (__VLS_ctx.getScoreColor(__VLS_ctx.results.rubricBreakdown.factuality_hallucination.score)) }));
            // @ts-ignore
            [results, getScoreColor,];
            (__VLS_ctx.results.rubricBreakdown.factuality_hallucination.score);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600 space-y-1" }));
            for (var _11 = 0, _12 = __VLS_getVForSourceType(((_o = __VLS_ctx.results.rubricBreakdown.factuality_hallucination.details) === null || _o === void 0 ? void 0 : _o.slice(0, 2))); _11 < _12.length; _11++) {
                var detail = _12[_11][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    key: (detail),
                });
                (detail);
            }
        }
        if (__VLS_ctx.results.rubricBreakdown.stylistic_consistency) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "font-medium text-gray-700" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-semibold" }, { class: (__VLS_ctx.getScoreColor(__VLS_ctx.results.rubricBreakdown.stylistic_consistency.score)) }));
            // @ts-ignore
            [results, getScoreColor,];
            (__VLS_ctx.results.rubricBreakdown.stylistic_consistency.score);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600 space-y-1" }));
            for (var _13 = 0, _14 = __VLS_getVForSourceType(((_p = __VLS_ctx.results.rubricBreakdown.stylistic_consistency.details) === null || _p === void 0 ? void 0 : _p.slice(0, 2))); _13 < _14.length; _13++) {
                var detail = _14[_13][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    key: (detail),
                });
                (detail);
            }
        }
        if (__VLS_ctx.results.rubricBreakdown.writing_style) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }, { class: (__VLS_ctx.results.rubricBreakdown.writing_style.score > 7 ? 'border-orange-200 bg-orange-50' : 'border-gray-200') }));
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "font-medium text-gray-700" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-semibold" }, { class: (__VLS_ctx.getScoreColor(__VLS_ctx.results.rubricBreakdown.writing_style.score)) }));
            // @ts-ignore
            [results, getScoreColor,];
            (__VLS_ctx.results.rubricBreakdown.writing_style.score);
            // @ts-ignore
            [results,];
            if (__VLS_ctx.results.rubricBreakdown.writing_style.score > 7) {
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "ml-2 text-xs text-orange-600 font-medium" }));
            }
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600 space-y-1" }));
            for (var _15 = 0, _16 = __VLS_getVForSourceType(((_q = __VLS_ctx.results.rubricBreakdown.writing_style.details) === null || _q === void 0 ? void 0 : _q.slice(0, 2))); _15 < _16.length; _15++) {
                var detail = _16[_15][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (detail) }, { class: "flex items-start" }));
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "w-1 h-1 bg-gray-400 rounded-full mr-2 mt-1.5 flex-shrink-0" }));
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
                (detail);
            }
            if (__VLS_ctx.results.rubricBreakdown.writing_style.personal_indicators) {
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mt-2 text-xs text-gray-500" }));
                (__VLS_ctx.results.rubricBreakdown.writing_style.personal_indicators);
                // @ts-ignore
                [results,];
            }
        }
        if (__VLS_ctx.results.rubricBreakdown.connectors_hedging) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "font-medium text-gray-700" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-semibold" }, { class: (__VLS_ctx.getScoreColor(__VLS_ctx.results.rubricBreakdown.connectors_hedging.score)) }));
            // @ts-ignore
            [results, getScoreColor,];
            (__VLS_ctx.results.rubricBreakdown.connectors_hedging.score);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600 space-y-1" }));
            for (var _17 = 0, _18 = __VLS_getVForSourceType(((_r = __VLS_ctx.results.rubricBreakdown.connectors_hedging.details) === null || _r === void 0 ? void 0 : _r.slice(0, 2))); _17 < _18.length; _17++) {
                var detail = _18[_17][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    key: (detail),
                });
                (detail);
            }
        }
        if (__VLS_ctx.results.rubricBreakdown.semantic_depth) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "font-medium text-gray-700" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-semibold" }, { class: (__VLS_ctx.getScoreColor(__VLS_ctx.results.rubricBreakdown.semantic_depth.score)) }));
            // @ts-ignore
            [results, getScoreColor,];
            (__VLS_ctx.results.rubricBreakdown.semantic_depth.score);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600 space-y-1" }));
            for (var _19 = 0, _20 = __VLS_getVForSourceType(((_s = __VLS_ctx.results.rubricBreakdown.semantic_depth.details) === null || _s === void 0 ? void 0 : _s.slice(0, 2))); _19 < _20.length; _19++) {
                var detail = _20[_19][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    key: (detail),
                });
                (detail);
            }
        }
        if (__VLS_ctx.results.rubricBreakdown.metadata_time_clues) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }, { class: (__VLS_ctx.results.rubricBreakdown.metadata_time_clues.score > 7 ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200') }));
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "font-medium text-gray-700" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-semibold" }, { class: (__VLS_ctx.getScoreColor(__VLS_ctx.results.rubricBreakdown.metadata_time_clues.score)) }));
            // @ts-ignore
            [results, getScoreColor,];
            (__VLS_ctx.results.rubricBreakdown.metadata_time_clues.score);
            // @ts-ignore
            [results,];
            if (__VLS_ctx.results.rubricBreakdown.metadata_time_clues.score > 7) {
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "ml-2 text-xs text-yellow-600 font-medium" }));
            }
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600 space-y-1" }));
            for (var _21 = 0, _22 = __VLS_getVForSourceType(((_t = __VLS_ctx.results.rubricBreakdown.metadata_time_clues.details) === null || _t === void 0 ? void 0 : _t.slice(0, 2))); _21 < _22.length; _21++) {
                var detail = _22[_21][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (detail) }, { class: "flex items-start" }));
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "w-1 h-1 bg-gray-400 rounded-full mr-2 mt-1.5 flex-shrink-0" }));
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
                (detail);
            }
            if (__VLS_ctx.results.rubricBreakdown.metadata_time_clues.temporal_references) {
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mt-2 text-xs text-gray-500" }));
                (__VLS_ctx.results.rubricBreakdown.metadata_time_clues.temporal_references);
                // @ts-ignore
                [results,];
            }
        }
        if (__VLS_ctx.results.rubricBreakdown.llm_patterns) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }, { class: (__VLS_ctx.results.rubricBreakdown.llm_patterns.score > 5 ? 'border-red-200 bg-red-50' : 'border-gray-200') }));
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "font-medium text-gray-700" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-semibold" }, { class: (__VLS_ctx.getScoreColor(__VLS_ctx.results.rubricBreakdown.llm_patterns.score)) }));
            // @ts-ignore
            [results, getScoreColor,];
            (__VLS_ctx.results.rubricBreakdown.llm_patterns.score);
            // @ts-ignore
            [results,];
            if (__VLS_ctx.results.rubricBreakdown.llm_patterns.score > 5) {
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "ml-2 text-xs text-red-600 font-medium" }));
            }
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600 space-y-1" }));
            for (var _23 = 0, _24 = __VLS_getVForSourceType(((_u = __VLS_ctx.results.rubricBreakdown.llm_patterns.details) === null || _u === void 0 ? void 0 : _u.slice(0, 3))); _23 < _24.length; _23++) {
                var detail = _24[_23][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (detail) }, { class: "flex items-start" }));
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "w-1 h-1 bg-red-400 rounded-full mr-2 mt-1.5 flex-shrink-0" }));
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
                (detail);
            }
            if (__VLS_ctx.results.rubricBreakdown.llm_patterns.pattern_count) {
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mt-2 text-xs text-gray-500" }));
                (__VLS_ctx.results.rubricBreakdown.llm_patterns.pattern_count);
                // @ts-ignore
                [results,];
            }
        }
        if (__VLS_ctx.results.explanation) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gray-50 rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "font-medium text-gray-700 mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-sm text-gray-600" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mb-3 p-3 bg-white rounded border-l-4" }, { class: (__VLS_ctx.getScoreColor(__VLS_ctx.results.aiProbability).replace('text-', 'border-')) }));
            // @ts-ignore
            [results, getScoreColor,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "font-semibold text-gray-800" }));
            (__VLS_ctx.results.explanation.split(' → ')[0]);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-500 mt-1" }));
            (__VLS_ctx.results.explanation.split(' → ')[1]);
            // @ts-ignore
            [results,];
            if (__VLS_ctx.results.explanation.includes('Citation Quality')) {
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-2" }));
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs font-medium text-gray-700 mb-2" }));
                for (var _25 = 0, _26 = __VLS_getVForSourceType((__VLS_ctx.results.explanation.split(' - ').slice(1))); _25 < _26.length; _25++) {
                    var line = _26[_25][0];
                    // @ts-ignore
                    [results,];
                    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (line) }, { class: "flex items-center text-xs" }));
                    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "w-2 h-2 bg-orange-400 rounded-full mr-2 flex-shrink-0" }));
                    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-gray-600" }));
                    (line.replace('Mixed content with both human and AI characteristics.', ''));
                }
            }
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center py-8 text-gray-500" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-4xl mb-2" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'factcheck') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded" }));
    if (__VLS_ctx.results.fact_checking && __VLS_ctx.results.fact_checking.status !== 'not_available') {
        // @ts-ignore
        [results, results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-6" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-4" }));
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-gray-800 flex items-center" }));
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 mr-2 text-purple-600" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-2xl font-bold" }, { class: (__VLS_ctx.getFactualAccuracyColor(__VLS_ctx.results.fact_checking.factual_accuracy)) }));
        // @ts-ignore
        [results, getFactualAccuracyColor,];
        (__VLS_ctx.results.fact_checking.factual_accuracy);
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "w-full bg-gray-200 rounded-full h-4 mb-4" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ class: "h-4 rounded-full transition-all duration-1000 ease-out" }, { class: (__VLS_ctx.getFactualAccuracyBarColor(__VLS_ctx.results.fact_checking.factual_accuracy)) }), { style: ({ width: __VLS_ctx.results.fact_checking.factual_accuracy + '%' }) }));
        // @ts-ignore
        [results, results, getFactualAccuracyBarColor,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-600" }));
        (__VLS_ctx.getFactualAccuracyDescription(__VLS_ctx.results.fact_checking.factual_accuracy));
        // @ts-ignore
        [results, getFactualAccuracyDescription,];
        if (__VLS_ctx.results.fact_checking.hallucinations_detected && __VLS_ctx.results.fact_checking.hallucinations_detected.length > 0) {
            // @ts-ignore
            [results, results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-red-50 border border-red-200 rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center mb-3" }));
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 mr-2 text-red-600" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
            });
            __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-red-800" }));
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-red-700 mb-3" }));
            (__VLS_ctx.results.fact_checking.hallucinations_detected.length);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)(__assign({ class: "space-y-2" }));
            for (var _27 = 0, _28 = __VLS_getVForSourceType((__VLS_ctx.results.fact_checking.hallucinations_detected.slice(0, 5))); _27 < _28.length; _27++) {
                var _29 = _28[_27], hallucination = _29[0], index = _29[1];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)(__assign({ key: (index) }, { class: "text-sm text-red-700 flex items-start" }));
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "w-2 h-2 bg-red-500 rounded-full mr-2 mt-2 flex-shrink-0" }));
                (hallucination);
            }
        }
        if (__VLS_ctx.results.fact_checking.misleading_claims && __VLS_ctx.results.fact_checking.misleading_claims.length > 0) {
            // @ts-ignore
            [results, results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-yellow-50 border border-yellow-200 rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center mb-3" }));
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 mr-2 text-yellow-600" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
            });
            __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-yellow-800" }));
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-yellow-700 mb-3" }));
            (__VLS_ctx.results.fact_checking.misleading_claims.length);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)(__assign({ class: "space-y-2" }));
            for (var _30 = 0, _31 = __VLS_getVForSourceType((__VLS_ctx.results.fact_checking.misleading_claims.slice(0, 5))); _30 < _31.length; _30++) {
                var _32 = _31[_30], claim = _32[0], index = _32[1];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)(__assign({ key: (index) }, { class: "text-sm text-yellow-700 flex items-start" }));
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-2 flex-shrink-0" }));
                (claim);
            }
        }
        if (__VLS_ctx.results.fact_checking.source_issues && __VLS_ctx.results.fact_checking.source_issues.length > 0) {
            // @ts-ignore
            [results, results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-orange-50 border border-orange-200 rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center mb-3" }));
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 mr-2 text-orange-600" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
            });
            __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-orange-800" }));
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-orange-700 mb-3" }));
            (__VLS_ctx.results.fact_checking.source_issues.length);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)(__assign({ class: "space-y-2" }));
            for (var _33 = 0, _34 = __VLS_getVForSourceType((__VLS_ctx.results.fact_checking.source_issues.slice(0, 5))); _33 < _34.length; _33++) {
                var _35 = _34[_33], issue = _35[0], index = _35[1];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)(__assign({ key: (index) }, { class: "text-sm text-orange-700 flex items-start" }));
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "w-2 h-2 bg-orange-500 rounded-full mr-2 mt-2 flex-shrink-0" }));
                (issue);
            }
        }
        if (__VLS_ctx.results.fact_checking.verified_facts && __VLS_ctx.results.fact_checking.verified_facts.length > 0) {
            // @ts-ignore
            [results, results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-green-50 border border-green-200 rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center mb-3" }));
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 mr-2 text-green-600" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            });
            __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-green-800" }));
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-green-700 mb-3" }));
            (__VLS_ctx.results.fact_checking.verified_facts.length);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)(__assign({ class: "space-y-2" }));
            for (var _36 = 0, _37 = __VLS_getVForSourceType((__VLS_ctx.results.fact_checking.verified_facts.slice(0, 5))); _36 < _37.length; _36++) {
                var _38 = _37[_36], fact = _38[0], index = _38[1];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)(__assign({ key: (index) }, { class: "text-sm text-green-700 flex items-start" }));
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0" }));
                (fact);
            }
        }
        if (__VLS_ctx.results.fact_checking.source_recommendations && __VLS_ctx.results.fact_checking.source_recommendations.length > 0) {
            // @ts-ignore
            [results, results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-blue-50 border border-blue-200 rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center mb-3" }));
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 mr-2 text-blue-600" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            });
            __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-blue-800" }));
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-blue-700 mb-3" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-3" }));
            for (var _39 = 0, _40 = __VLS_getVForSourceType((__VLS_ctx.results.fact_checking.source_recommendations.slice(0, 8))); _39 < _40.length; _39++) {
                var _41 = _40[_39], source = _41[0], index = _41[1];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (index) }, { class: "bg-white rounded-lg p-3 border border-blue-200" }));
                __VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)(__assign({ href: (source.url), target: "_blank" }, { class: "text-sm font-medium text-blue-800 hover:text-blue-600 transition-colors" }));
                (source.name);
                __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-blue-600 mt-1" }));
                (source.description);
            }
        }
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gray-50 rounded-lg p-4" }));
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-gray-800 mb-2" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-lg font-bold text-gray-800" }));
        (__VLS_ctx.results.fact_checking.total_chunks_analyzed || 0);
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-lg font-bold text-gray-800" }));
        (__VLS_ctx.results.fact_checking.total_claims_found || 0);
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-lg font-bold text-gray-800" }));
        (__VLS_ctx.results.fact_checking.total_issues_found || 0);
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-lg font-bold" }, { class: (__VLS_ctx.getFactualAccuracyColor(__VLS_ctx.results.fact_checking.factual_accuracy)) }));
        // @ts-ignore
        [results, getFactualAccuracyColor,];
        (__VLS_ctx.results.fact_checking.factual_accuracy);
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-xs text-gray-600" }));
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center py-8" }));
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-16 h-16 mx-auto text-gray-400 mb-4" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        });
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "text-lg font-medium text-gray-600 mb-2" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-500" }));
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'academic') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded" }));
    if (__VLS_ctx.results.academicAnalysis && Object.keys(__VLS_ctx.results.academicAnalysis).length > 0) {
        // @ts-ignore
        [results, results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-3" }));
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-gray-800 flex items-center" }));
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 mr-2 text-blue-600" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm text-gray-500" }));
        (__VLS_ctx.results.academicAnalysis.citations_found);
        // @ts-ignore
        [results,];
        if (__VLS_ctx.results.academicAnalysis.suspicious_citations && __VLS_ctx.results.academicAnalysis.suspicious_citations.length > 0) {
            // @ts-ignore
            [results, results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-red-50 border border-red-200 rounded-lg p-3" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "text-sm font-medium text-red-800 mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)(__assign({ class: "text-sm text-red-700 space-y-1" }));
            for (var _42 = 0, _43 = __VLS_getVForSourceType((__VLS_ctx.results.academicAnalysis.suspicious_citations)); _42 < _43.length; _42++) {
                var citation = _43[_42][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)(__assign({ key: (citation) }, { class: "flex items-center" }));
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "w-2 h-2 bg-red-500 rounded-full mr-2" }));
                (citation);
            }
        }
        else {
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3" }));
        }
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }));
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-gray-800 mb-3 flex items-center" }));
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 mr-2 text-purple-600" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-2 gap-3" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-sm" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-gray-600" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "font-medium ml-1" }));
        (__VLS_ctx.results.academicAnalysis.sections_analyzed);
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-sm" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-gray-600" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "font-medium ml-1 text-red-600" }));
        (((_v = __VLS_ctx.results.academicAnalysis.high_ai_sections) === null || _v === void 0 ? void 0 : _v.length) || 0);
        // @ts-ignore
        [results,];
        if (__VLS_ctx.results.academicAnalysis.high_ai_sections && __VLS_ctx.results.academicAnalysis.high_ai_sections.length > 0) {
            // @ts-ignore
            [results, results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mt-3 bg-red-50 border border-red-200 rounded-lg p-3" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "text-sm font-medium text-red-800 mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex flex-wrap gap-2" }));
            for (var _44 = 0, _45 = __VLS_getVForSourceType((__VLS_ctx.results.academicAnalysis.high_ai_sections)); _44 < _45.length; _44++) {
                var section = _45[_44][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ key: (section) }, { class: "px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full" }));
                (section);
            }
        }
        if (__VLS_ctx.results.academicAnalysis.figure_concerns && __VLS_ctx.results.academicAnalysis.figure_concerns.length > 0) {
            // @ts-ignore
            [results, results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-gray-800 mb-3 flex items-center" }));
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 mr-2 text-orange-600" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
            });
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-orange-50 border border-orange-200 rounded-lg p-3" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "text-sm font-medium text-orange-800 mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex flex-wrap gap-2" }));
            for (var _46 = 0, _47 = __VLS_getVForSourceType((__VLS_ctx.results.academicAnalysis.figure_concerns)); _46 < _47.length; _46++) {
                var figure = _47[_46][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ key: (figure) }, { class: "px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full" }));
                (figure);
            }
        }
        if (__VLS_ctx.results.academicAnalysis.style_concerns && __VLS_ctx.results.academicAnalysis.style_concerns.length > 0) {
            // @ts-ignore
            [results, results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-gray-800 mb-3 flex items-center" }));
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 mr-2 text-indigo-600" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
            });
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-yellow-50 border border-yellow-200 rounded-lg p-3" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "text-sm font-medium text-yellow-800 mb-2" }));
            __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)(__assign({ class: "text-sm text-yellow-700 space-y-1" }));
            for (var _48 = 0, _49 = __VLS_getVForSourceType((__VLS_ctx.results.academicAnalysis.style_concerns)); _48 < _49.length; _48++) {
                var concern = _49[_48][0];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)(__assign({ key: (concern) }, { class: "flex items-center" }));
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "w-2 h-2 bg-yellow-500 rounded-full mr-2" }));
                (concern);
            }
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center py-8 text-gray-500" }));
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-12 h-12 mx-auto mb-3 text-gray-300" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-400 mt-2" }));
        (__VLS_ctx.results.academicAnalysis);
        // @ts-ignore
        [results,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'integrity') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-xs text-green-600 bg-green-100 px-2 py-1 rounded" }));
    if (__VLS_ctx.results.integrityDashboard && Object.keys(__VLS_ctx.results.integrityDashboard).length > 0) {
        // @ts-ignore
        [results, results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-l-4 border-blue-400" }));
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-semibold text-gray-800 mb-4 flex items-center" }));
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-6 h-6 mr-2 text-blue-600" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-3 gap-4" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-2xl font-bold text-green-600" }));
        (((_w = __VLS_ctx.results.integrityDashboard.overall_assessment) === null || _w === void 0 ? void 0 : _w.human_probability) || 0);
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-sm text-gray-600" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-2xl font-bold text-red-600" }));
        (((_x = __VLS_ctx.results.integrityDashboard.overall_assessment) === null || _x === void 0 ? void 0 : _x.ai_probability) || 0);
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-sm text-gray-600" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-2xl font-bold" }, { class: (((_y = __VLS_ctx.results.integrityDashboard.overall_assessment) === null || _y === void 0 ? void 0 : _y.mixed_content) ? 'text-orange-600' : 'text-gray-600') }));
        // @ts-ignore
        [results,];
        (((_z = __VLS_ctx.results.integrityDashboard.overall_assessment) === null || _z === void 0 ? void 0 : _z.mixed_content) ? 'Mixed' : 'Single');
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-sm text-gray-600" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mt-4 text-center" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" }, { class: (__VLS_ctx.getConfidenceClass((_0 = __VLS_ctx.results.integrityDashboard.overall_assessment) === null || _0 === void 0 ? void 0 : _0.confidence_level)) }));
        // @ts-ignore
        [results, getConfidenceClass,];
        (((_1 = __VLS_ctx.results.integrityDashboard.overall_assessment) === null || _1 === void 0 ? void 0 : _1.confidence_level) || 'medium');
        // @ts-ignore
        [results,];
        if (__VLS_ctx.results.integrityDashboard.actionable_evidence && __VLS_ctx.results.integrityDashboard.actionable_evidence.length > 0) {
            // @ts-ignore
            [results, results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-gray-800 mb-3 flex items-center" }));
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-5 h-5 mr-2 text-red-600" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
            });
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-2" }));
            for (var _50 = 0, _51 = __VLS_getVForSourceType((__VLS_ctx.results.integrityDashboard.actionable_evidence)); _50 < _51.length; _50++) {
                var _52 = _51[_50], evidence = _52[0], index = _52[1];
                // @ts-ignore
                [results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (index) }, { class: "bg-red-50 border border-red-200 rounded-lg p-3" }));
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-start" }));
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0" }));
                __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-red-800" }));
                (evidence);
            }
        }
        if (__VLS_ctx.results.integrityDashboard.citation_integrity) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-white border rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "font-medium text-gray-800 mb-3" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-4" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-2xl font-bold" }, { class: (__VLS_ctx.results.integrityDashboard.citation_integrity.integrity_score > 50 ? 'text-red-600' : 'text-green-600') }));
            // @ts-ignore
            [results,];
            (__VLS_ctx.results.integrityDashboard.citation_integrity.integrity_score || 0);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-sm text-gray-600" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-2xl font-bold text-blue-600" }));
            (__VLS_ctx.results.integrityDashboard.citation_integrity.total_citations || 0);
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-sm text-gray-600" }));
            if (__VLS_ctx.results.integrityDashboard.citation_integrity.suspicious_citations && __VLS_ctx.results.integrityDashboard.citation_integrity.suspicious_citations.length > 0) {
                // @ts-ignore
                [results, results,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mt-4" }));
                __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "font-medium text-red-600 mb-2" }));
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-1" }));
                for (var _53 = 0, _54 = __VLS_getVForSourceType((__VLS_ctx.results.integrityDashboard.citation_integrity.suspicious_citations.slice(0, 3))); _53 < _54.length; _53++) {
                    var _55 = _54[_53], citation = _55[0], index = _55[1];
                    // @ts-ignore
                    [results,];
                    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (index) }, { class: "text-sm text-red-700 bg-red-50 p-2 rounded" }));
                    (citation.text || citation);
                }
            }
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center py-8 text-gray-500" }));
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-12 h-12 mx-auto mb-3 text-gray-300" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-400 mt-2" }));
        (__VLS_ctx.results.integrityDashboard);
        // @ts-ignore
        [results,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'content') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800 mb-3" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mb-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "text-sm font-medium text-gray-700 mb-2" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-sm text-gray-600" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: (['inline-block px-3 py-1 rounded-full text-sm font-medium', __VLS_ctx.sentimentBadgeClass]) }));
    // @ts-ignore
    [sentimentBadgeClass,];
    (__VLS_ctx.getSentimentDisplay());
    // @ts-ignore
    [getSentimentDisplay,];
    if (__VLS_ctx.results.comprehendAnalysis && __VLS_ctx.results.comprehendAnalysis.sentiment_scores) {
        // @ts-ignore
        [results, results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mt-2 text-xs text-gray-500" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-3 gap-2" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        (Math.round((__VLS_ctx.results.comprehendAnalysis.sentiment_scores.POSITIVE || 0) * 100));
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        (Math.round((__VLS_ctx.results.comprehendAnalysis.sentiment_scores.NEGATIVE || 0) * 100));
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        (Math.round((__VLS_ctx.results.comprehendAnalysis.sentiment_scores.NEUTRAL || 0) * 100));
        // @ts-ignore
        [results,];
    }
    if (__VLS_ctx.results.keyPhrases && __VLS_ctx.results.keyPhrases.length > 0) {
        // @ts-ignore
        [results, results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mb-4" }));
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "text-sm font-medium text-gray-700 mb-2" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex flex-wrap gap-2" }));
        for (var _56 = 0, _57 = __VLS_getVForSourceType((__VLS_ctx.results.keyPhrases.slice(0, 10))); _56 < _57.length; _56++) {
            var phrase = _57[_56][0];
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ key: (phrase) }, { class: "inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm" }));
            (phrase);
        }
        if (__VLS_ctx.results.keyPhrases.length > 10) {
            // @ts-ignore
            [results,];
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-500 mt-2" }));
            (__VLS_ctx.results.keyPhrases.length - 10);
            // @ts-ignore
            [results,];
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gray-50 rounded-lg p-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "text-sm font-medium text-gray-700 mb-3" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-1 gap-2 text-sm" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex justify-between" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-gray-600" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "font-medium" }));
    (__VLS_ctx.getWritingStyle());
    // @ts-ignore
    [getWritingStyle,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex justify-between" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-gray-600" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "font-medium" }));
    (__VLS_ctx.getComplexityLevel());
    // @ts-ignore
    [getComplexityLevel,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex justify-between" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-gray-600" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "font-medium" }));
    (__VLS_ctx.getContentType());
    // @ts-ignore
    [getContentType,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-6" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'advanced') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded" }));
    (__VLS_ctx.results.simplifiedAnalysis ? 'Simplified for All Users' : 'Enhanced Analysis View');
    // @ts-ignore
    [results,];
    if ((__VLS_ctx.results.simplifiedAnalysis && Object.keys(__VLS_ctx.results.simplifiedAnalysis).length > 0) || __VLS_ctx.hasLegacyAnalysis()) {
        // @ts-ignore
        [results, results, hasLegacyAnalysis,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-4" }));
        for (var _58 = 0, _59 = __VLS_getVForSourceType(((__VLS_ctx.results.simplifiedAnalysis || __VLS_ctx.convertLegacyToSimplified()))); _58 < _59.length; _58++) {
            var _60 = _59[_58], analysis = _60[0], key = _60[1];
            // @ts-ignore
            [results, convertLegacyToSimplified,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (key) }, { class: "bg-white border rounded-lg p-4 hover:shadow-md transition-shadow" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-3" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "font-medium text-gray-800" }));
            (__VLS_ctx.getAnalysisTitle(key));
            // @ts-ignore
            [getAnalysisTitle,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-bold px-2 py-1 rounded-full" }, { class: (__VLS_ctx.getAnalysisIndicatorClass(analysis.indicator)) }));
            // @ts-ignore
            [getAnalysisIndicatorClass,];
            (analysis.indicator);
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mb-3" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between mb-1" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm text-gray-600" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-semibold" }, { class: (__VLS_ctx.getScoreColor(analysis.score)) }));
            // @ts-ignore
            [getScoreColor,];
            (analysis.score);
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "w-full bg-gray-200 rounded-full h-2" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ class: "h-2 rounded-full transition-all duration-1000 ease-out" }, { class: (__VLS_ctx.getScoreBarColor(analysis.score)) }), { style: ({ width: Math.min(analysis.score, 100) + '%' }) }));
            // @ts-ignore
            [getScoreBarColor,];
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-xs text-gray-500 leading-relaxed" }));
            (analysis.description);
        }
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-400" }));
        __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "font-medium text-gray-800 mb-2" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-600 leading-relaxed" }));
    }
    else if (__VLS_ctx.results.comprehendAnalysis || __VLS_ctx.results.linguisticFeatures) {
        // @ts-ignore
        [results, results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-yellow-50 border border-yellow-200 rounded-lg p-4" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-yellow-800" }));
        __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.analyzeDocument) }, { class: "mt-3 px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors" }));
        // @ts-ignore
        [analyzeDocument,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "text-center py-8 text-gray-500" }));
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "w-12 h-12 mx-auto mb-3 text-gray-300" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm" }));
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.activeTab === 'summary') }), null, null);
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)(__assign({ class: "font-semibold text-gray-800 mb-3" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-blue-50 rounded-lg p-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "text-sm font-medium text-blue-800 mb-2" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-blue-700 leading-relaxed" }));
    (__VLS_ctx.results.textLength || __VLS_ctx.wordCount);
    (((_2 = __VLS_ctx.selectedFile) === null || _2 === void 0 ? void 0 : _2.name) || 'document');
    // @ts-ignore
    [selectedFile, wordCount, results,];
    __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
    (Math.round(__VLS_ctx.results.aiProbability));
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
    (((_3 = __VLS_ctx.results.classification) === null || _3 === void 0 ? void 0 : _3.toLowerCase()) || 'of uncertain origin');
    // @ts-ignore
    [results,];
    if (__VLS_ctx.results.explanation) {
        // @ts-ignore
        [results,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "space-y-4" }));
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "text-sm font-medium text-gray-700 mb-2" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-gray-50 rounded-lg p-4" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "text-sm text-gray-700 leading-relaxed" }));
        (__VLS_ctx.results.explanation);
        // @ts-ignore
        [results,];
        if (__VLS_ctx.results.rubricBreakdown && Object.keys(__VLS_ctx.results.rubricBreakdown).length > 0) {
            // @ts-ignore
            [results, results,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-blue-50 rounded-lg p-4" }));
            __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)(__assign({ class: "text-sm font-medium text-blue-800 mb-3" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "grid grid-cols-2 gap-3" }));
            if (__VLS_ctx.category && __VLS_ctx.category.score !== undefined) {
                // @ts-ignore
                [category, category,];
                for (var _61 = 0, _62 = __VLS_getVForSourceType((__VLS_ctx.results.rubricBreakdown)); _61 < _62.length; _61++) {
                    var _63 = _62[_61], category = _63[0], name_2 = _63[1];
                    // @ts-ignore
                    [results,];
                    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (name_2) }, { class: "flex items-center justify-between" }));
                    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm text-blue-700" }));
                    (__VLS_ctx.formatCategoryName(name_2));
                    // @ts-ignore
                    [formatCategoryName,];
                    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-bold" }, { class: (__VLS_ctx.getMetricColor(category.score)) }));
                    // @ts-ignore
                    [getMetricColor,];
                    (category.score);
                }
            }
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "mt-3 pt-3 border-t border-blue-200" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "flex items-center justify-between" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm text-blue-700" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "text-sm font-bold text-blue-800" }));
            (__VLS_ctx.results.confidence || 'medium');
            // @ts-ignore
            [results,];
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bg-amber-50 border border-amber-200 rounded-lg p-4" }));
    __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)(__assign({ class: "text-sm font-medium text-amber-800 mb-2" }));
    __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)(__assign({ class: "text-sm text-amber-700 space-y-1 list-disc list-inside" }));
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    (__VLS_ctx.results.extractionMethod || 'Automatic');
    // @ts-ignore
    [results,];
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
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
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#252F3E]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[#FF9900]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#252F3E]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-48']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-pre-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[#FF9900]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:sticky']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:top-8']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:h-fit']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#252F3E]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-300']} */ ;
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
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-[#FF9900]']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-[#FF9900]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['appearance-none']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-y-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[#FF9900]/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[#FF9900]/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#FF9900]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['to-indigo-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border-l-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['break-all']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['break-all']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-green-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-purple-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-purple-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-orange-600']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-green-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-green-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-orange-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-orange-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-orange-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-red-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
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
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
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
/** @type {__VLS_StyleScopedClasses['bg-green-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-green-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['to-indigo-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-200']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-orange-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-orange-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['w-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['w-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['w-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border-l-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-orange-400']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-purple-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-1000']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-out']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-red-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-yellow-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-yellow-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-yellow-500']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-orange-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-orange-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-orange-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-orange-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-orange-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-orange-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-orange-500']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-green-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-500']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-red-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-green-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-red-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-orange-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-orange-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-orange-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-orange-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-orange-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-orange-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-indigo-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-yellow-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-yellow-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-700']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-yellow-500']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['to-purple-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border-l-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-red-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-800']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
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
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
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
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['to-purple-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-l-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-yellow-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-yellow-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-yellow-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-yellow-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
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
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-200']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-800']} */ ;
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
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['list-disc']} */ ;
/** @type {__VLS_StyleScopedClasses['list-inside']} */ ;
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
        selectedFile: selectedFile,
        documentContent: documentContent,
        isAnalyzing: isAnalyzing,
        results: results,
        isDragging: isDragging,
        fileInput: fileInput,
        uploadProgress: uploadProgress,
        analysisStep: analysisStep,
        error: error,
        activeTab: activeTab,
        selectedAnalysisSection: selectedAnalysisSection,
        tabs: tabs,
        wordCount: wordCount,
        documentPreview: documentPreview,
        hasResults: hasResults,
        resultTextColor: resultTextColor,
        progressBarColor: progressBarColor,
        scoreColor: scoreColor,
        confidenceBadgeClass: confidenceBadgeClass,
        sentimentBadgeClass: sentimentBadgeClass,
        getSentimentDisplay: getSentimentDisplay,
        formatCategoryName: formatCategoryName,
        interpretationDetail: interpretationDetail,
        circumference: circumference,
        strokeDashoffset: strokeDashoffset,
        formatFileSize: formatFileSize,
        getLoadingText: getLoadingText,
        getClassification: getClassification,
        getWritingStyle: getWritingStyle,
        getComplexityLevel: getComplexityLevel,
        getContentType: getContentType,
        getMainAnalysisText: getMainAnalysisText,
        hasMetrics: hasMetrics,
        parseMetrics: parseMetrics,
        getMetricColor: getMetricColor,
        getMetricBarColor: getMetricBarColor,
        getMetricDescription: getMetricDescription,
        hasConfidence: hasConfidence,
        getConfidenceLevel: getConfidenceLevel,
        getFactualAccuracyColor: getFactualAccuracyColor,
        getFactualAccuracyBarColor: getFactualAccuracyBarColor,
        getFactualAccuracyDescription: getFactualAccuracyDescription,
        getAnalysisTitle: getAnalysisTitle,
        getAnalysisIndicatorClass: getAnalysisIndicatorClass,
        getScoreColor: getScoreColor,
        getScoreBarColor: getScoreBarColor,
        hasLegacyAnalysis: hasLegacyAnalysis,
        convertLegacyToSimplified: convertLegacyToSimplified,
        handleDrop: handleDrop,
        handleFileSelect: handleFileSelect,
        clearFile: clearFile,
        analyzeDocument: analyzeDocument,
        retryAnalysis: retryAnalysis,
        getConfidenceClass: getConfidenceClass,
        getCurrentSectionDescription: getCurrentSectionDescription,
        getCurrentSectionLabel: getCurrentSectionLabel,
    }); },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
