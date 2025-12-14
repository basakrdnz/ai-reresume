import { useState } from "react";
import { cn } from "~/lib/utils";

const FullFeedbackDownload = ({
  feedback,
}: {
  feedback: Feedback;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const formatFullFeedback = () => {
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

    return JSON.stringify(fullFeedback, null, 2);
  };

  const handleSendEmail = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Format full feedback as JSON
      const fullFeedbackText = formatFullFeedback();

      // Create a blob and download link (for now, we'll create a downloadable file)
      // In production, you would send this to your backend API to email it
      const blob = new Blob([fullFeedbackText], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-feedback-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Simulate email sending (replace with actual API call)
      // await fetch('/api/send-feedback-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, feedback: fullFeedbackText })
      // });

      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setShowModal(false);
        setEmail("");
      }, 3000);
    } catch (err) {
      setError("Failed to send email. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
            Want to see all feedback details? Enter your email address and we'll
            send you a complete feedback report.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Get Full Report
          </button>
        </div>
      </div>

      {/* Modal/Popup */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => {
            if (!isLoading && !isSent) {
              setShowModal(false);
              setEmail("");
              setError("");
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {isSent ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <img
                    src="/icons/check.svg"
                    alt="success"
                    className="w-8 h-8"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Success!
                  </h3>
                  <p className="text-gray-600">
                    Full feedback has been sent to
                  </p>
                  <p className="text-blue-600 font-medium">{email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setIsSent(false);
                    setEmail("");
                    setError("");
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mt-2"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    Get Full Feedback Report
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEmail("");
                      setError("");
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a complete
                  feedback report.
                </p>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="modal-email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="your.email@example.com"
                    className={cn(
                      "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2",
                      error
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    )}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isLoading) {
                        handleSendEmail();
                      }
                    }}
                  />
                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}
                </div>
                <div className="flex flex-row gap-3">
                  <button
                    onClick={handleSendEmail}
                    disabled={isLoading}
                    className={cn(
                      "flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isLoading ? "Sending..." : "Send Full Report"}
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEmail("");
                      setError("");
                    }}
                    disabled={isLoading}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FullFeedbackDownload;
