import jsPDF from "jspdf";

type BrandConfig = {
  name?: string;
  primaryColor?: [number, number, number];
  footerText?: string;
};

export const generateFeedbackPdf = (
  feedback: Feedback,
  brand: BrandConfig = {}
): void => {
  const doc = new jsPDF();

  /* ================= CONFIG ================= */
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;

  let yPos = 35;

  const theme = {
    primary: brand.primaryColor ?? [40, 90, 160],
    text: [30, 30, 30] as [number, number, number],
    muted: [120, 120, 120] as [number, number, number],
    good: [0, 120, 80] as [number, number, number],
    warn: [180, 120, 40] as [number, number, number],
    sectionBg: [245, 247, 250] as [number, number, number],
  };

  /* ================= HELPERS ================= */
  const checkPage = () => {
    if (yPos > pageHeight - 25) {
      doc.addPage();
      yPos = 30;
    }
  };

  const addText = (
    text: string,
    size = 11,
    bold = false,
    color: [number, number, number] = theme.text
  ) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);

    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      checkPage();
      doc.text(line, margin, yPos);
      yPos += 4;
    });
  };

  const sectionTitle = (title: string) => {
    checkPage();
    yPos += 3;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...theme.text);
    doc.text(title, margin, yPos);
    yPos += 6;
  };

  const addBulletItem = (
    title: string,
    description?: string,
    type: "normal" | "good" | "warn" = "normal"
  ) => {
    checkPage();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...theme.text);
    doc.text("•", margin, yPos);
    doc.text(title, margin + 5, yPos);
    yPos += 4;

    if (description) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...theme.muted);

      const lines = doc.splitTextToSize(description, maxWidth - 10);
      lines.forEach((line: string) => {
        checkPage();
        doc.text(line, margin + 10, yPos);
        yPos += 4;
      });
    }

    yPos += 1;
  };

  /* ================= HEADER ================= */
  doc.setFillColor(...theme.primary);
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `${brand.name ?? "Resume Feedback"} Report`,
    margin,
    18
  );

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Professional resume evaluation", margin, 24);

  /* ================= SUMMARY ================= */
  const overallScore =
    feedback.overallScore ?? feedback.overall_rating * 10;

  const atsScore =
    feedback.ATS?.score ??
    (feedback.ats_compatibility ? feedback.ats_compatibility * 10 : 0);

  sectionTitle("Executive Summary");
  addText(`Overall Resume Score: ${overallScore}/100`, 12, true);
  addText(`This score represents the overall quality and effectiveness of your resume based on comprehensive analysis.`);
  yPos += 2;
  addText(`ATS Compatibility Score: ${atsScore}/100`, 12, true);
  addText(`This score indicates how well your resume will perform in Applicant Tracking Systems used by employers.`);

  /* ================= DETAILED CATEGORY ANALYSIS ================= */
  sectionTitle("Detailed Category Analysis");
  
  const contentAnalysis = feedback.content_analysis;
  const toneAndStyleScore = feedback.toneAndStyle?.score ?? (contentAnalysis?.formatting ? contentAnalysis.formatting * 10 : 0);
  const contentScore = feedback.content?.score ?? (contentAnalysis?.experience_relevance ? contentAnalysis.experience_relevance * 10 : 0);
  const structureScore = feedback.structure?.score ?? (contentAnalysis?.formatting ? contentAnalysis.formatting * 10 : 0);
  const skillsScore = feedback.skills?.score ?? (contentAnalysis?.technical_skills ? contentAnalysis.technical_skills * 10 : 0);

  addText("Tone & Style", 11, true);
  addText(`Score: ${toneAndStyleScore}/100`);
  if (feedback.toneAndStyle?.tips && feedback.toneAndStyle.tips.length > 0) {
    const goodTips = feedback.toneAndStyle.tips.filter(t => t.type === "good");
    const improveTips = feedback.toneAndStyle.tips.filter(t => t.type === "improve");
    
    if (goodTips.length > 0) {
      addText("Strengths:", 10, true);
      goodTips.forEach((tip: { type: "good" | "improve"; tip: string; explanation?: string }) => {
        addBulletItem(tip.tip, tip.explanation);
      });
    }
    
    if (improveTips.length > 0) {
      addText("Areas for Improvement:", 10, true);
      improveTips.forEach((tip: { type: "good" | "improve"; tip: string; explanation?: string }) => {
        addBulletItem(tip.tip, tip.explanation);
      });
    }
  } else {
    // Fallback to old structure
    const formatWeaknesses = feedback.weaknesses?.filter(
      (w: string) =>
        w.toLowerCase().includes("format") ||
        w.toLowerCase().includes("layout") ||
        w.toLowerCase().includes("style") ||
        w.toLowerCase().includes("professional") ||
        w.toLowerCase().includes("contact") ||
        w.toLowerCase().includes("portfolio")
    ) || [];
    
    const formatRecommendations = feedback.recommendations?.filter(
      (r: string) =>
        r.toLowerCase().includes("format") ||
        r.toLowerCase().includes("layout") ||
        r.toLowerCase().includes("structure") ||
        r.toLowerCase().includes("portfolio")
    ) || [];
    
    if (formatWeaknesses.length > 0) {
      addText("Areas for Improvement:", 10, true);
      formatWeaknesses.forEach((w: string) => addBulletItem(w));
    }
    
    if (formatRecommendations.length > 0) {
      addText("Recommendations:", 10, true);
      formatRecommendations.forEach((r: string) => addBulletItem(r));
    }
  }
  yPos += 2;

  addText("Content Quality", 11, true);
  addText(`Score: ${contentScore}/100`);
  if (contentAnalysis) {
    addBulletItem(`Experience Relevance: ${contentAnalysis.experience_relevance * 10}/100`);
    addBulletItem(`Achievements Highlighted: ${contentAnalysis.achievements * 10}/100`);
    addBulletItem(`Education Presentation: ${contentAnalysis.education * 10}/100`);
  }
  if (feedback.content?.tips && feedback.content.tips.length > 0) {
    const goodTips = feedback.content.tips.filter(t => t.type === "good");
    const improveTips = feedback.content.tips.filter(t => t.type === "improve");
    
    if (goodTips.length > 0) {
      addText("Strengths:", 10, true);
      goodTips.forEach((tip: { type: "good" | "improve"; tip: string; explanation?: string }) => {
        addBulletItem(tip.tip, tip.explanation);
      });
    }
    
    if (improveTips.length > 0) {
      addText("Areas for Improvement:", 10, true);
      improveTips.forEach((tip: { type: "good" | "improve"; tip: string; explanation?: string }) => {
        addBulletItem(tip.tip, tip.explanation);
      });
    }
  } else {
    // Fallback to old structure
    const contentStrengths = feedback.strengths?.filter(
      (s: string) =>
        !s.toLowerCase().includes("format") &&
        !s.toLowerCase().includes("layout") &&
        !s.toLowerCase().includes("ats") &&
        !s.toLowerCase().includes("skill") &&
        (s.toLowerCase().includes("experience") ||
          s.toLowerCase().includes("achievement") ||
          s.toLowerCase().includes("work") ||
          s.toLowerCase().includes("career") ||
          s.toLowerCase().includes("education"))
    ) || [];
    
    const contentWeaknesses = feedback.weaknesses?.filter(
      (w: string) =>
        !w.toLowerCase().includes("format") &&
        !w.toLowerCase().includes("layout") &&
        !w.toLowerCase().includes("ats") &&
        !w.toLowerCase().includes("skill")
    ) || [];
    
    if (contentStrengths.length > 0) {
      addText("Strengths:", 10, true);
      contentStrengths.forEach((s: string) => addBulletItem(s));
    }
    
    if (contentWeaknesses.length > 0) {
      addText("Areas for Improvement:", 10, true);
      contentWeaknesses.forEach((w: string) => addBulletItem(w));
    }
  }
  yPos += 2;

  addText("Structure & Formatting", 11, true);
  addText(`Score: ${structureScore}/100`);
  if (contentAnalysis) {
    addBulletItem(`Formatting Quality: ${contentAnalysis.formatting * 10}/100`);
  }
  if (feedback.structure?.tips && feedback.structure.tips.length > 0) {
    const goodTips = feedback.structure.tips.filter(t => t.type === "good");
    const improveTips = feedback.structure.tips.filter(t => t.type === "improve");
    
    if (goodTips.length > 0) {
      addText("Strengths:", 10, true);
      goodTips.forEach((tip: { type: "good" | "improve"; tip: string; explanation?: string }) => {
        addBulletItem(tip.tip, tip.explanation);
      });
    }
    
    if (improveTips.length > 0) {
      addText("Areas for Improvement:", 10, true);
      improveTips.forEach((tip: { type: "good" | "improve"; tip: string; explanation?: string }) => {
        addBulletItem(tip.tip, tip.explanation);
      });
    }
  } else {
    // Fallback to ATS issues for structure
    const atsIssues = feedback.ats_issues || [];
    if (atsIssues.length > 0) {
      addText("ATS Issues:", 10, true);
      atsIssues.forEach((issue: string) => addBulletItem(issue));
    }
  }
  yPos += 2;

  addText("Technical Skills", 11, true);
  addText(`Score: ${skillsScore}/100`);
  if (contentAnalysis) {
    addBulletItem(`Technical Skills Presentation: ${contentAnalysis.technical_skills * 10}/100`);
  }
  if (feedback.skills?.tips && feedback.skills.tips.length > 0) {
    const goodTips = feedback.skills.tips.filter(t => t.type === "good");
    const improveTips = feedback.skills.tips.filter(t => t.type === "improve");
    
    if (goodTips.length > 0) {
      addText("Strengths:", 10, true);
      goodTips.forEach((tip: { type: "good" | "improve"; tip: string; explanation?: string }) => {
        addBulletItem(tip.tip, tip.explanation);
      });
    }
    
    if (improveTips.length > 0) {
      addText("Areas for Improvement:", 10, true);
      improveTips.forEach((tip: { type: "good" | "improve"; tip: string; explanation?: string }) => {
        addBulletItem(tip.tip, tip.explanation);
      });
    }
  } else {
    // Fallback to old structure
    const skillStrengths = feedback.strengths?.filter(
      (s: string) =>
        s.toLowerCase().includes("skill") ||
        s.toLowerCase().includes("technical") ||
        s.toLowerCase().includes("technology") ||
        s.toLowerCase().includes("framework") ||
        s.toLowerCase().includes("language") ||
        s.toLowerCase().includes("tool")
    ) || [];
    
    const skillMissing = feedback.missing_elements?.filter(
      (m: string) =>
        m.toLowerCase().includes("skill") ||
        m.toLowerCase().includes("tool") ||
        m.toLowerCase().includes("library") ||
        m.toLowerCase().includes("framework")
    ) || [];
    
    if (skillStrengths.length > 0) {
      addText("Strengths:", 10, true);
      skillStrengths.forEach((s: string) => addBulletItem(s));
    }
    
    if (skillMissing.length > 0) {
      addText("Missing Elements:", 10, true);
      skillMissing.forEach((m: string) => addBulletItem(m));
    }
  }

  /* ================= STRENGTHS ================= */
  if (feedback.strengths?.length) {
    sectionTitle("Key Strengths");
    feedback.strengths.forEach((s: string) =>
      addBulletItem(s)
    );
  }

  /* ================= AREAS FOR IMPROVEMENT ================= */
  if (feedback.weaknesses?.length) {
    sectionTitle("Areas for Improvement");
    feedback.weaknesses.forEach((w: string) =>
      addBulletItem(w)
    );
  }

  /* ================= ATS ANALYSIS ================= */
  if (feedback.ATS?.tips?.length || feedback.ats_issues?.length) {
    sectionTitle("ATS (Applicant Tracking System) Analysis");
    
    if (feedback.ATS?.tips?.length) {
      addText("ATS Recommendations:", 10, true);
      feedback.ATS.tips.forEach((tip: { type: "good" | "improve"; tip: string }) =>
        addBulletItem(tip.tip)
      );
    }
    
    if (feedback.ats_issues?.length) {
      addText("Identified ATS Issues:", 10, true);
      feedback.ats_issues.forEach((issue: string) =>
        addBulletItem(issue)
      );
    }
  }

  /* ================= MISSING ELEMENTS ================= */
  if (feedback.missing_elements?.length) {
    sectionTitle("Missing Elements");
    addText("The following elements are recommended to strengthen your resume:", 10);
    feedback.missing_elements.forEach((element: string) =>
      addBulletItem(element)
    );
  }

  /* ================= IMPROVEMENT SUGGESTIONS ================= */
  if (feedback.improvement_suggestions?.length) {
    sectionTitle("Improvement Suggestions");
    feedback.improvement_suggestions.forEach((suggestion: string) =>
      addBulletItem(suggestion)
    );
  }

  /* ================= RECOMMENDATIONS ================= */
  if (feedback.recommendations?.length) {
    sectionTitle("Actionable Recommendations");
    feedback.recommendations.forEach((rec: string) =>
      addBulletItem(rec)
    );
  }

  /* ================= JOB FIT ANALYSIS ================= */
  if (feedback.job_fit_analysis) {
    sectionTitle("Job Fit Analysis");
    const matchScore = feedback.job_fit_analysis.match_score * 10;
    addText(`Job Match Score: ${matchScore}/100`, 11, true);
    addText(`This score indicates how well your resume aligns with the job requirements.`);
    
    if (feedback.job_fit_analysis.relevant_experience) {
      yPos += 2;
      addText("Relevant Experience:", 10, true);
      addText(feedback.job_fit_analysis.relevant_experience);
    }
    
    if (feedback.job_fit_analysis.gaps && feedback.job_fit_analysis.gaps.length > 0) {
      yPos += 2;
      addText("Identified Gaps:", 10, true);
      feedback.job_fit_analysis.gaps.forEach((gap: string) =>
        addBulletItem(gap)
      );
    }
  }

  /* ================= FOOTER ================= */
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...theme.muted);
    doc.text(
      brand.footerText ??
        `Confidential Report • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  doc.save("resume-feedback-report.pdf");
};
