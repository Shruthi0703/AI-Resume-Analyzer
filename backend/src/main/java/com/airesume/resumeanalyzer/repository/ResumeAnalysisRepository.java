package com.airesume.resumeanalyzer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.airesume.resumeanalyzer.model.ResumeAnalysis;

@Repository
public interface ResumeAnalysisRepository
        extends JpaRepository<ResumeAnalysis, Long> {

    List<ResumeAnalysis> findByUserEmail(String userEmail);

}