package com.airesume.resumeanalyzer.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import com.airesume.resumeanalyzer.model.ResumeAnalysis;

public class PdfReportGenerator {

    public static byte[] generateAnalysisPdf(ResumeAnalysis analysis) throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDType1Font fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDType1Font fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font fontOblique = new PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE);

            float margin = 50;
            float width = PDRectangle.A4.getWidth() - 2 * margin;
            float startY = PDRectangle.A4.getHeight() - margin;
            float currentY = startY;

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Draw Header
                contentStream.setNonStrokingColor(30, 41, 59); // Sleek Slate color
                contentStream.setFont(fontBold, 24);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, currentY - 30);
                contentStream.showText("AI Resume Analysis Report");
                contentStream.endText();

                // Draw Divider line
                currentY -= 45;
                contentStream.setLineWidth(1.5f);
                contentStream.setStrokingColor(226, 232, 240); // Light border color
                contentStream.moveTo(margin, currentY);
                contentStream.lineTo(margin + width, currentY);
                contentStream.stroke();

                currentY -= 20;

                // Candidate & Resume metadata
                contentStream.setFont(fontBold, 11);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, currentY);
                contentStream.showText("User Email: ");
                contentStream.setFont(fontRegular, 11);
                contentStream.showText(analysis.getUserEmail());
                contentStream.endText();

                contentStream.setFont(fontBold, 11);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin + 250, currentY);
                contentStream.showText("Date Analyzed: ");
                contentStream.setFont(fontRegular, 11);
                String formattedDate = analysis.getUploadDate() != null ? 
                    analysis.getUploadDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) : "N/A";
                contentStream.showText(formattedDate);
                contentStream.endText();

                currentY -= 15;

                contentStream.setFont(fontBold, 11);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, currentY);
                contentStream.showText("Resume Name: ");
                contentStream.setFont(fontRegular, 11);
                contentStream.showText(analysis.getResumeName());
                contentStream.endText();

                currentY -= 30;

                // Score block (colored background box)
                contentStream.setNonStrokingColor(241, 245, 249); // light grey box
                contentStream.addRect(margin, currentY - 50, width, 60);
                contentStream.fill();

                contentStream.setNonStrokingColor(15, 23, 42); // dark text
                contentStream.setFont(fontBold, 14);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin + 15, currentY - 20);
                contentStream.showText("OVERALL FIT SCORE: ");
                
                // Color code the score
                int score = analysis.getResumeScore();
                if (score >= 80) {
                    contentStream.setNonStrokingColor(22, 163, 74); // Green
                } else if (score >= 50) {
                    contentStream.setNonStrokingColor(217, 119, 6); // Orange
                } else {
                    contentStream.setNonStrokingColor(220, 38, 38); // Red
                }
                contentStream.setFont(fontBold, 22);
                contentStream.showText(score + " / 100");
                contentStream.endText();

                currentY -= 80;

                // 1. Matching Skills
                currentY = addSection(contentStream, "1. MATCHING SKILLS", analysis.getMatchingSkills(), margin, currentY, width, fontBold, fontRegular, fontOblique);

                // 2. Missing Skills
                currentY = addSection(contentStream, "2. MISSING SKILLS", analysis.getMissingSkills(), margin, currentY, width, fontBold, fontRegular, fontOblique);

                // 3. AI Suggestions
                currentY = addSection(contentStream, "3. IMPROVEMENT SUGGESTIONS", analysis.getAiSuggestions(), margin, currentY, width, fontBold, fontRegular, fontOblique);

                // 4. Learning Roadmap
                currentY = addSection(contentStream, "4. LEARNING ROADMAP", analysis.getLearningRoadmap(), margin, currentY, width, fontBold, fontRegular, fontOblique);

                // 5. Interview Preparation
                currentY = addSection(contentStream, "5. INTERVIEW QUESTIONS", analysis.getInterviewQuestions(), margin, currentY, width, fontBold, fontRegular, fontOblique);

                // 6. Career & Certification Recommendations
                String careerCertStr = "";
                if (analysis.getCareerRecommendations() != null) {
                    careerCertStr += "**Career Paths:** " + analysis.getCareerRecommendations() + "\n\n";
                }
                if (analysis.getCertificationRecommendations() != null) {
                    careerCertStr += "**Recommended Certifications:** " + analysis.getCertificationRecommendations();
                }
                addSection(contentStream, "6. CAREER & CERTIFICATION PATHS", careerCertStr, margin, currentY, width, fontBold, fontRegular, fontOblique);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }

    private static float addSection(PDPageContentStream contentStream, String title, String content, float x, float y, float width, 
                                   PDType1Font fontBold, PDType1Font fontRegular, PDType1Font fontOblique) throws IOException {
        if (content == null || content.trim().isEmpty()) {
            content = "None specified.";
        }

        // Draw Section Title
        contentStream.setNonStrokingColor(30, 41, 59); // Slate Blue
        contentStream.setFont(fontBold, 12);
        contentStream.beginText();
        contentStream.newLineAtOffset(x, y);
        contentStream.showText(title);
        contentStream.endText();

        contentStream.setLineWidth(0.8f);
        contentStream.setStrokingColor(203, 213, 225); // very thin light line
        contentStream.moveTo(x, y - 4);
        contentStream.lineTo(x + width, y - 4);
        contentStream.stroke();

        y -= 20;

        contentStream.setNonStrokingColor(71, 85, 105); // text slate color
        float leading = 14;
        List<String> wrappedLines = wrapText(content, width, fontRegular, 9);
        
        int linesWritten = 0;
        for (String line : wrappedLines) {
            contentStream.beginText();
            contentStream.setFont(fontRegular, 9);
            contentStream.newLineAtOffset(x, y - (linesWritten * leading));
            // Basic clean up of markdown bolding (**text**) for displaying in text stripper
            String cleanLine = line.replaceAll("\\*\\*", "");
            contentStream.showText(cleanLine);
            contentStream.endText();
            linesWritten++;
        }

        return y - (linesWritten * leading) - 25;
    }

    private static List<String> wrapText(String text, float width, PDType1Font font, int fontSize) throws IOException {
        List<String> result = new ArrayList<>();
        if (text == null || text.isEmpty()) return result;

        String[] paragraphs = text.split("\n");
        for (String paragraph : paragraphs) {
            if (paragraph.trim().isEmpty()) {
                result.add("");
                continue;
            }
            String[] words = paragraph.split(" ");
            StringBuilder currentLine = new StringBuilder();
            for (String word : words) {
                String testLine = currentLine.length() == 0 ? word : currentLine + " " + word;
                float textWidth = font.getStringWidth(testLine) / 1000f * fontSize;
                if (textWidth > width) {
                    result.add(currentLine.toString());
                    currentLine = new StringBuilder(word);
                } else {
                    currentLine = new StringBuilder(testLine);
                }
            }
            if (currentLine.length() > 0) {
                result.add(currentLine.toString());
            }
        }
        return result;
    }
}
