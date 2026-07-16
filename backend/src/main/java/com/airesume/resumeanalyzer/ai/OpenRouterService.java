package com.airesume.resumeanalyzer.ai;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.airesume.resumeanalyzer.dto.GeminiAnalysisResult;
import com.airesume.resumeanalyzer.exception.InvalidGeminiKeyException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class OpenRouterService {

    @Value("${openrouter.api.key}")
    private String apiKey;

    @Autowired
    private ObjectMapper objectMapper;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

    public GeminiAnalysisResult analyzeResume(String resumeText, String jobDescription) {
        
        // Validate API Key format
        if (apiKey == null || apiKey.trim().isEmpty() || 
            apiKey.contains("YOUR_OPENROUTER_API_KEY") || 
            !apiKey.startsWith("sk-or-v1-")) {
            throw new InvalidGeminiKeyException(
                "OpenRouter API Key is missing or invalid. Current value is '" + apiKey + "'. " +
                "Please configure a valid OpenRouter API Key (starts with 'sk-or-v1-') in your application.properties " +
                "file under 'openrouter.api.key' or set the OPENROUTER_API_KEY environment variable."
            );
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("HTTP-Referer", "http://localhost:8080");
            headers.set("X-Title", "ResumeAnalyzer");

            String prompt = """
                    You are an expert ATS (Applicant Tracking System) and AI Resume Analyzer.
                    Analyze the following resume in detail against the provided job description.

                    Resume Text:
                    ---
                    %s
                    ---

                    Job Description:
                    ---
                    %s
                    ---

                    Provide a detailed evaluation and output EXACTLY a valid JSON object matching the schema below.
                    Do not wrap the response in HTML or markdown formatting. 
                    Do not include any text before or after the JSON object.

                    Expected JSON Structure:
                    {
                      "resumeScore": 75,
                      "matchingSkills": "List matching skills as a comma-separated string",
                      "missingSkills": "List missing skills required by the job description but not in the resume as a comma-separated string",
                      "aiSuggestions": "Detailed bulleted suggestions on how to improve the resume for this job description",
                      "learningRoadmap": "A step-by-step learning path or roadmap to acquire missing skills and bridge the gap",
                      "careerRecommendations": "Potential next steps or roles that fit this resume profile based on the analysis",
                      "interviewQuestions": "3-5 relevant behavioral or technical interview questions the candidate should prepare for",
                      "certificationRecommendations": "List of recommended certifications that would boost the candidate's profile"
                    }
                    """.formatted(resumeText, jobDescription);

            // Construct payload
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "openai/gpt-4o-mini");
            
            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            requestBody.put("messages", List.of(message));

            Map<String, String> responseFormat = new HashMap<>();
            responseFormat.put("type", "json_object");
            requestBody.put("response_format", responseFormat);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(OPENROUTER_URL, entity, String.class);
            String responseBody = response.getBody();

            JsonNode root = objectMapper.readTree(responseBody);
            String contentJson = root.path("choices").get(0).path("message").path("content").asText();

            // Robust custom parsing to handle both arrays/lists and strings in the output JSON fields
            JsonNode analysisNode = objectMapper.readTree(contentJson);
            GeminiAnalysisResult result = new GeminiAnalysisResult();
            
            result.setResumeScore(analysisNode.path("resumeScore").asInt(70));
            result.setMatchingSkills(getAsString(analysisNode.path("matchingSkills"), ", "));
            result.setMissingSkills(getAsString(analysisNode.path("missingSkills"), ", "));
            result.setAiSuggestions(getAsString(analysisNode.path("aiSuggestions"), "\n"));
            result.setLearningRoadmap(getAsString(analysisNode.path("learningRoadmap"), "\n"));
            result.setCareerRecommendations(getAsString(analysisNode.path("careerRecommendations"), "\n"));
            result.setInterviewQuestions(getAsString(analysisNode.path("interviewQuestions"), "\n"));
            result.setCertificationRecommendations(getAsString(analysisNode.path("certificationRecommendations"), "\n"));

            return result;

        } catch (HttpClientErrorException.Unauthorized e) {
            throw new InvalidGeminiKeyException(
                "OpenRouter API Key authentication failed (401 Unauthorized). " +
                "Please verify that your OpenRouter API Key is active, has sufficient credits, and is configured correctly."
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to analyze resume with OpenRouter AI: " + e.getMessage(), e);
        }
    }

    private String getAsString(JsonNode node, String delimiter) {
        if (node.isMissingNode() || node.isNull()) {
            return "";
        }
        if (node.isArray()) {
            StringBuilder sb = new StringBuilder();
            for (JsonNode item : node) {
                if (sb.length() > 0) {
                    sb.append(delimiter);
                }
                sb.append(item.asText());
            }
            return sb.toString();
        }
        return node.asText();
    }
}
