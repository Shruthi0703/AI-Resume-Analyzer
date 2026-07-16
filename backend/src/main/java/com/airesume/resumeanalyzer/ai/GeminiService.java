package com.airesume.resumeanalyzer.ai;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airesume.resumeanalyzer.dto.GeminiAnalysisResult;

@Service
public class GeminiService {

    @Autowired
    private OpenRouterService openRouterService;

    public GeminiAnalysisResult analyzeResume(String resumeText, String jobDescription) {
        return openRouterService.analyzeResume(resumeText, jobDescription);
    }

    public String generateSuggestions(String resumeText, String jobDescription) {
        try {
            GeminiAnalysisResult result = analyzeResume(resumeText, jobDescription);
            return result.getAiSuggestions();
        } catch (Exception e) {
            return "OpenRouter Error: " + e.getMessage();
        }
    }
}