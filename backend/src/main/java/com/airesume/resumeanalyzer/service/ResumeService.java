package com.airesume.resumeanalyzer.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.airesume.resumeanalyzer.model.Resume;
import com.airesume.resumeanalyzer.repository.ResumeRepository;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    private final String UPLOAD_DIR = "uploads/";

    // Upload Resume
    public Resume uploadResume(MultipartFile file) throws IOException {

        File folder = new File(UPLOAD_DIR);

        if (!folder.exists()) {
            folder.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path path = Paths.get(UPLOAD_DIR + fileName);

        Files.copy(file.getInputStream(), path);

        Resume resume = new Resume();

        resume.setFileName(fileName);
        resume.setFilePath(path.toString());
        resume.setUploadDate(LocalDateTime.now());

        return resumeRepository.save(resume);
    }

    // Get All Resumes
    public List<Resume> getAllResumes() {

        return resumeRepository.findAll();
    }

    // Delete Resume
    public void deleteResume(Long id) {

        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        File file = new File(resume.getFilePath());

        if (file.exists()) {
            file.delete();
        }

        resumeRepository.deleteById(id);
    }
}