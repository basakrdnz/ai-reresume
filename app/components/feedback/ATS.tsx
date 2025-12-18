import { cn } from "~/lib/utils";

const ATS = ({
  score,
  suggestions,
  feedback,
}: {
  score?: number;
  suggestions?: { type: "good" | "improve"; tip: string }[];
  feedback?: Feedback;
}) => {
  // Calculate ATS score from feedback
  const atsCompatibility = feedback?.ats_compatibility;
  const atsScore = feedback?.ATS?.score;
  const finalScore =
    score ||
    atsScore ||
    (atsCompatibility
      ? atsCompatibility <= 10
        ? atsCompatibility * 10
        : atsCompatibility
      : 0);

  // Get suggestions from feedback or use provided suggestions
  const atsTips = feedback?.ATS?.tips || [];
  const finalSuggestions = atsTips.length > 0 ? atsTips : suggestions || [];

  // Determine greeting based on score
  const greeting =
    finalScore > 69
      ? "Great Job!"
      : finalScore > 49
      ? "Good Start!"
      : "Needs Work";

  // Determine icon based on score
  const iconSrc =
    finalScore > 69
      ? "/icons/ats-good.svg"
      : finalScore > 49
      ? "/icons/ats-warning.svg"
      : "/icons/ats-bad.svg";

  return (
    <div
      className={cn(
        "rounded-2xl shadow-md w-full bg-gradient-to-b p-6 flex flex-col gap-3",
        finalScore > 69
          ? "from-green-100 to-white"
          : finalScore > 49
          ? "from-yellow-100 to-white"
          : "from-red-100 to-white"
      )}
    >
      <div className="flex flex-row gap-3 items-center">
        <img src={iconSrc} alt="ATS" className="w-10 h-10" />
        <p className="text-2xl font-semibold">ATS Score - {finalScore}/100</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-xl">{greeting}</p>
        <p className="text-lg text-gray-700">
          This score represents how well your resume is likely to perform in
          Applicant Tracking Systems used by employers.
        </p>
        {finalSuggestions.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            {finalSuggestions.map((suggestion, index) => (
          <div className="flex flex-row gap-2 items-center" key={index}>
            <img
              src={
                suggestion.type === "good"
                  ? "/icons/check.svg"
                  : "/icons/warning.svg"
              }
                  alt={suggestion.type}
                  className="w-5 h-5"
            />
                <p className="text-lg text-gray-700">{suggestion.tip}</p>
              </div>
            ))}
          </div>
        )}
        <p className="text-lg text-gray-700 mt-1">
          Keep refining your resume to improve your chances of getting past ATS
          filters and into the hands of recruiters.
        </p>
      </div>
    </div>
  );
};

export default ATS;

