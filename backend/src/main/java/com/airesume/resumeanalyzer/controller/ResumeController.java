package com.airesume.resumeanalyzer.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.airesume.resumeanalyzer.dto.GeminiAnalysisResult;
import com.airesume.resumeanalyzer.model.ResumeAnalysis;
import com.airesume.resumeanalyzer.repository.ResumeAnalysisRepository;
import com.airesume.resumeanalyzer.service.PdfService;
import com.airesume.resumeanalyzer.ai.GeminiService;
import com.airesume.resumeanalyzer.util.PdfReportGenerator;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin("*")
public class ResumeController {

    @Autowired
    private PdfService pdfService;
     
    @Autowired
    private GeminiService geminiService;
    
    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;

    // ===========================
    // Upload Resume API
    // ===========================
    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("resume") MultipartFile resume,
            @RequestParam("jobDescription") String jobDescription,
            @RequestParam("userEmail") String userEmail
    ) throws IOException {

        // Extract Resume Text
        String resumeText = pdfService.extractText(resume);

        // Run Gemini AI Analysis
        GeminiAnalysisResult aiResult = geminiService.analyzeResume(resumeText, jobDescription);

        // Save to Database
        ResumeAnalysis analysis = new ResumeAnalysis();
        analysis.setUserEmail(userEmail);
        analysis.setResumeName(resume.getOriginalFilename());
        analysis.setResumeScore(aiResult.getResumeScore());
        analysis.setMatchingSkills(aiResult.getMatchingSkills());
        analysis.setMissingSkills(aiResult.getMissingSkills());
        analysis.setAiSuggestions(aiResult.getAiSuggestions());
        analysis.setLearningRoadmap(aiResult.getLearningRoadmap());
        analysis.setCareerRecommendations(aiResult.getCareerRecommendations());
        analysis.setInterviewQuestions(aiResult.getInterviewQuestions());
        analysis.setCertificationRecommendations(aiResult.getCertificationRecommendations());
        analysis.setJobDescription(jobDescription);
        analysis.setUploadDate(LocalDateTime.now());

        resumeAnalysisRepository.save(analysis);

        // Response details
        Map<String, Object> response = new HashMap<>();
        response.put("id", analysis.getId());
        response.put("resumeScore", aiResult.getResumeScore());
        response.put("matchingSkills", aiResult.getMatchingSkills());
        response.put("missingSkills", aiResult.getMissingSkills());
        response.put("aiSuggestions", aiResult.getAiSuggestions());
        response.put("learningRoadmap", aiResult.getLearningRoadmap());
        response.put("careerRecommendations", aiResult.getCareerRecommendations());
        response.put("interviewQuestions", aiResult.getInterviewQuestions());
        response.put("certificationRecommendations", aiResult.getCertificationRecommendations());
        response.put("jobDescription", jobDescription);
        response.put("resumeText", resumeText);
        response.put("message", "Resume uploaded and analysis saved successfully.");

        return ResponseEntity.ok(response);
    }

    // ===========================
    // Resume History API
    // ===========================
    @GetMapping("/history")
    public ResponseEntity<List<ResumeAnalysis>> getResumeHistory(
            @RequestParam("userEmail") String userEmail) {

        List<ResumeAnalysis> history =
                resumeAnalysisRepository.findByUserEmail(userEmail);

        return ResponseEntity.ok(history);
    }

    // ===========================
    // Resume Details API
    // ===========================
    @GetMapping("/details/{id}")
    public ResponseEntity<ResumeAnalysis> getResumeDetails(@PathVariable("id") Long id) {
        ResumeAnalysis analysis = resumeAnalysisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Analysis not found with ID: " + id));
        return ResponseEntity.ok(analysis);
    }

    // ===========================
    // Download Analysis PDF API
    // ===========================
    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadAnalysisPdf(@PathVariable("id") Long id) {
        ResumeAnalysis analysis = resumeAnalysisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Analysis not found with ID: " + id));

        try {
            byte[] pdfBytes = PdfReportGenerator.generateAnalysisPdf(analysis);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"resume_analysis_" + id + ".pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to generate PDF: " + e.getMessage());
        }
    }
}