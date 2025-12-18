import { useMemo } from "react";
import { cn } from "~/lib/utils";
import { generateFeedbackPdf } from "~/lib/generateFeedbackPdf";

const FullFeedbackDownload = ({
  feedback,
  resumeUrl,
}: {
  feedback: Feedback;
  resumeUrl?: string;
}) => {
  // Build a downloadable JSON of full feedback (optional, may be useful to keep)
  const feedbackBlobUrl = useMemo(() => {
    try {
      const fullFeedback = {
        overall_rating: feedback.overall_rating,
        ats_compatibility: feedback.ats_compatibility,
        content_analysis: feedback.content_analysis,
        strengths: feedback.strengths,
        weaknesses: feedback.weaknesses,
        ats_issues: feedback.ats_issues,
        missing_elements: feedback.missing_elements,
        improvement_suggestions: feedback.improvement_suggestions,
        recommendations: feedback.recommendations,
        job_fit_analysis: feedback.job_fit_analysis,
        generated_at: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(fullFeedback, null, 2)], {
        type: "application/json",
      });
      return URL.createObjectURL(blob);
    } catch {
      return undefined;
    }
  }, [feedback]);

  const handleDownloadFeedbackPdf = () => {
    generateFeedbackPdf(feedback);
  };

  const handleDownloadJson = () => {
    if (!feedbackBlobUrl) return;
    const a = document.createElement("a");
    a.href = feedbackBlobUrl;
    a.download = "feedback.json";
    a.click();
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md w-full p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-3">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold">Get Full Feedback Report</h3>
          </div>
          <p className="text-gray-600">
            Download your detailed feedback report as a PDF document.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleDownloadFeedbackPdf}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Download Feedback Report (PDF)
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FullFeedbackDownload;
