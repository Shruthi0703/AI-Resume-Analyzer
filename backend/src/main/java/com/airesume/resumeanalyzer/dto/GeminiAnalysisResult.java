package com.airesume.resumeanalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeminiAnalysisResult {
    private int resumeScore;
    private String matchingSkills;
    private String missingSkills;
    private String aiSuggestions;
    private String learningRoadmap;
    private String careerRecommendations;
    private String interviewQuestions;
    private String certificationRecommendations;
}
