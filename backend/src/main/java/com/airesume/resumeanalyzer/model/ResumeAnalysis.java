package com.airesume.resumeanalyzer.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "resume_analysis")
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private String resumeName;

    private int resumeScore;

    @Column(columnDefinition = "TEXT")
    private String missingSkills;

    @Column(columnDefinition = "TEXT")
    private String matchingSkills;

    @Column(columnDefinition = "TEXT")
    private String aiSuggestions;

    @Column(columnDefinition = "TEXT")
    private String learningRoadmap;

    @Column(columnDefinition = "TEXT")
    private String careerRecommendations;

    @Column(columnDefinition = "TEXT")
    private String interviewQuestions;

    @Column(columnDefinition = "TEXT")
    private String certificationRecommendations;

    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    private LocalDateTime uploadDate;

    public ResumeAnalysis() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getResumeName() {
        return resumeName;
    }

    public void setResumeName(String resumeName) {
        this.resumeName = resumeName;
    }

    public int getResumeScore() {
        return resumeScore;
    }

    public void setResumeScore(int resumeScore) {
        this.resumeScore = resumeScore;
    }

    public String getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(String missingSkills) {
        this.missingSkills = missingSkills;
    }

    public String getMatchingSkills() {
        return matchingSkills;
    }

    public void setMatchingSkills(String matchingSkills) {
        this.matchingSkills = matchingSkills;
    }

    public String getAiSuggestions() {
        return aiSuggestions;
    }

    public void setAiSuggestions(String aiSuggestions) {
        this.aiSuggestions = aiSuggestions;
    }

    public String getLearningRoadmap() {
        return learningRoadmap;
    }

    public void setLearningRoadmap(String learningRoadmap) {
        this.learningRoadmap = learningRoadmap;
    }

    public String getCareerRecommendations() {
        return careerRecommendations;
    }

    public void setCareerRecommendations(String careerRecommendations) {
        this.careerRecommendations = careerRecommendations;
    }

    public String getInterviewQuestions() {
        return interviewQuestions;
    }

    public void setInterviewQuestions(String interviewQuestions) {
        this.interviewQuestions = interviewQuestions;
    }

    public String getCertificationRecommendations() {
        return certificationRecommendations;
    }

    public void setCertificationRecommendations(String certificationRecommendations) {
        this.certificationRecommendations = certificationRecommendations;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
}