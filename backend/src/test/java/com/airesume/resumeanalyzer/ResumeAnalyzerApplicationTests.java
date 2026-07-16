package com.airesume.resumeanalyzer;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import java.io.File;

@SpringBootTest
class ResumeAnalyzerApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    void generateTestResume() {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);
            
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 16);
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText("John Doe - Senior Java Software Engineer");
                contentStream.endText();
                
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                contentStream.newLineAtOffset(50, 710);
                contentStream.showText("Skills: Java, Spring Boot, MySQL, REST API, Git, Docker");
                contentStream.endText();

                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                contentStream.newLineAtOffset(50, 680);
                contentStream.showText("Experience: 5 years building scalable backend applications using Spring Boot.");
                contentStream.endText();
            }
            
            File output = new File("test_resume.pdf");
            document.save(output);
            System.out.println("Generated test resume PDF at: " + output.getAbsolutePath());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
