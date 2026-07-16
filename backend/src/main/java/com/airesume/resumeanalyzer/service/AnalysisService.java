package com.airesume.resumeanalyzer.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class AnalysisService {

    public List<String> findMissingSkills(String resumeText, String jobDescription) {

        String[] skills = {
                "java",
                "spring",
                "spring boot",
                "mysql",
                "html",
                "css",
                "javascript",
                "react",
                "python",
                "machine learning",
                "git",
                "docker"
        };

        resumeText = resumeText.toLowerCase();
        jobDescription = jobDescription.toLowerCase();

        List<String> missingSkills = new ArrayList<>();

        for (String skill : skills) {

            if (jobDescription.contains(skill) && !resumeText.contains(skill)) {
                missingSkills.add(skill);
            }
        }

        return missingSkills;
    }

    public int calculateScore(List<String> missingSkills) {

        int score = 100 - (missingSkills.size() * 10);

        if (score < 0) {
            score = 0;
        }

        return score;
    }
}