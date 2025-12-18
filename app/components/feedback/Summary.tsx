import ScoreGauge from "../ScoreGauge";
import Details from "./Details";
import FullFeedbackDownload from "./FullFeedbackDownload";
import ATS from "./ATS";

const ScoreBadge = ({ score }: { score: number }) => {
  const badgeColor =
    score > 69
      ? "bg-badge-green"
      : score > 49
      ? "bg-badge-yellow"
      : "bg-badge-red";
  const textColor =
    score > 69
      ? "text-green-600"
      : score > 49
      ? "text-yellow-600"
      : "text-red-600";
  const badgeText =
    score > 69 ? "Strong" : score > 49 ? "Good Start" : "Needs Work";

  return (
    <div className={`score-badge ${badgeColor}`}>
      <p className={`text-xs ${textColor} font-semibold`}>{badgeText}</p>
    </div>
  );
};

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score > 69
      ? "text-green-600"
      : score > 49
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="resume-summary">
      <div className="category">
        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="text-2xl">{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-2xl ">
          <span className={textColor}>{score}</span>/100
        </p>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  // Convert 0-10 scale to 0-100 scale
  const overallScore = feedback.overallScore ?? (feedback.overall_rating * 10);
  const contentAnalysis = feedback.content_analysis;
  
  // Map content_analysis to categories (convert 0-10 to 0-100)
  const toneAndStyleScore = feedback.toneAndStyle?.score ?? (contentAnalysis?.formatting ? contentAnalysis.formatting * 10 : 0);
  const contentScore = feedback.content?.score ?? (contentAnalysis?.experience_relevance ? contentAnalysis.experience_relevance * 10 : 0);
  const structureScore = feedback.structure?.score ?? (contentAnalysis?.formatting ? contentAnalysis.formatting * 10 : 0);
  const skillsScore = feedback.skills?.score ?? (contentAnalysis?.technical_skills ? contentAnalysis.technical_skills * 10 : 0);

  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row max-sm:flex-col  items-center p-4 gap-8">
        <ScoreGauge score={overallScore} />
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>
      <div className="px-4 pb-4 flex flex-col gap-4">
        <Category title="Tone & Style" score={toneAndStyleScore} />
        <Category title="Content" score={contentScore} />
        <Category title="Structure" score={structureScore} />
        <Category title="Skills" score={skillsScore} />
      </div>
      <div className="px-4 pb-4">
        <ATS feedback={feedback} />
      </div>
      <div className="px-4 pb-4">
        <Details feedback={feedback} />
      </div>
    </div>
  );
};

export default Summary;

