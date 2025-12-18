import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "../Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
        score > 69
          ? "bg-badge-green"
          : score > 39
          ? "bg-badge-yellow"
          : "bg-badge-red"
      )}
    >
      <img
        src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
        alt="score"
        className="size-4"
      />
      <p
        className={cn(
          "text-sm font-medium",
          score > 69
            ? "text-badge-green-text"
            : score > 39
            ? "text-badge-yellow-text"
            : "text-badge-red-text"
        )}
      >
        {score}/100
      </p>
    </div>
  );
};

const FeedbackItem = ({
  text,
  type,
}: {
  text: string;
  type: "positive" | "negative";
}) => {
  return (
    <div
            className={cn(
        "flex flex-col gap-1.5 rounded-2xl p-3",
        type === "positive"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-yellow-50 border border-yellow-200 text-yellow-700"
            )}
          >
            <div className="flex flex-row gap-2 items-center">
              <img
          src={type === "positive" ? "/icons/check.svg" : "/icons/warning.svg"}
          alt={type}
                className="size-5"
              />
        <p className="text-lg font-semibold">{text}</p>
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  const contentAnalysis = feedback.content_analysis;
  
  // Calculate scores (convert 0-10 to 0-100) - prioritize new structure
  const toneAndStyleScore = feedback.toneAndStyle?.score ?? (contentAnalysis?.formatting ? contentAnalysis.formatting * 10 : 0);
  const contentScore = feedback.content?.score ?? (contentAnalysis?.experience_relevance ? contentAnalysis.experience_relevance * 10 : 0);
  const structureScore = feedback.structure?.score ?? (contentAnalysis?.formatting ? contentAnalysis.formatting * 10 : 0);
  const skillsScore = feedback.skills?.score ?? (contentAnalysis?.technical_skills ? contentAnalysis.technical_skills * 10 : 0);

  // Get tips from new structure or fallback to old structure
  const toneAndStyleTips = feedback.toneAndStyle?.tips || [];
  const contentTips = feedback.content?.tips || [];
  const structureTips = feedback.structure?.tips || [];
  const skillsTips = feedback.skills?.tips || [];

  // Fallback to old structure if new structure is empty
  const strengths = feedback.strengths || [];
  const weaknesses = feedback.weaknesses || [];
  const atsIssues = feedback.ats_issues || [];
  const recommendations = feedback.recommendations || [];
  const missingElements = feedback.missing_elements || [];

  // Helper to convert tips to feedback items
  const tipsToFeedbackItems = (tips: { type: "good" | "improve"; tip: string; explanation?: string }[]) => {
    const goodTips = tips.filter(t => t.type === "good").slice(0, 2);
    const improveTips = tips.filter(t => t.type === "improve").slice(0, 2);
    return { goodTips, improveTips };
  };

  // Fallback filtering for old structure
  const formatWeaknesses = weaknesses.filter(
    (w) =>
      w.toLowerCase().includes("format") ||
      w.toLowerCase().includes("layout") ||
      w.toLowerCase().includes("style") ||
      w.toLowerCase().includes("professional") ||
      w.toLowerCase().includes("contact") ||
      w.toLowerCase().includes("portfolio")
  );

  const formatRecommendations = recommendations.filter(
    (r) =>
      r.toLowerCase().includes("format") ||
      r.toLowerCase().includes("layout") ||
      r.toLowerCase().includes("structure") ||
      r.toLowerCase().includes("portfolio")
  );

  const contentStrengths = strengths.filter(
    (s) =>
      !s.toLowerCase().includes("format") &&
      !s.toLowerCase().includes("layout") &&
      !s.toLowerCase().includes("ats") &&
      !s.toLowerCase().includes("skill") &&
      (s.toLowerCase().includes("experience") ||
        s.toLowerCase().includes("achievement") ||
        s.toLowerCase().includes("work") ||
        s.toLowerCase().includes("career") ||
        s.toLowerCase().includes("education"))
  );

  const contentWeaknesses = weaknesses.filter(
    (w) =>
      !w.toLowerCase().includes("format") &&
      !w.toLowerCase().includes("layout") &&
      !w.toLowerCase().includes("ats") &&
      !w.toLowerCase().includes("skill")
  );

  const skillStrengths = strengths.filter(
    (s) =>
      s.toLowerCase().includes("skill") ||
      s.toLowerCase().includes("technical") ||
      s.toLowerCase().includes("technology") ||
      s.toLowerCase().includes("framework") ||
      s.toLowerCase().includes("language") ||
      s.toLowerCase().includes("tool")
  );

  const skillMissing = missingElements.filter(
    (m) =>
      m.toLowerCase().includes("skill") ||
      m.toLowerCase().includes("tool") ||
      m.toLowerCase().includes("library") ||
      m.toLowerCase().includes("framework")
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      <Accordion allowMultiple>
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <div className="flex flex-row gap-4 items-center w-full">
              <p className="text-2xl font-semibold">Tone & Style</p>
              <ScoreBadge score={toneAndStyleScore} />
            </div>
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <div className="flex flex-col gap-3 mt-3">
              {toneAndStyleTips.length > 0 ? (() => {
                const { goodTips, improveTips } = tipsToFeedbackItems(toneAndStyleTips);
                return (
                  <>
                    {goodTips.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h3 className="text-base font-semibold text-gray-700">Strengths</h3>
                        {goodTips.map((tip, index) => (
                          <FeedbackItem key={`good-${index}`} text={tip.tip} type="positive" />
                        ))}
                      </div>
                    )}
                    {improveTips.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h3 className="text-base font-semibold text-gray-700">Areas for Improvement</h3>
                        {improveTips.map((tip, index) => (
                          <FeedbackItem key={`improve-${index}`} text={tip.tip} type="negative" />
                        ))}
                      </div>
                    )}
                  </>
                );
              })() : (
                <>
                  {formatWeaknesses.slice(0, 2).length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-base font-semibold text-gray-700">Areas for Improvement</h3>
                      {formatWeaknesses.slice(0, 2).map((weakness, index) => (
                        <FeedbackItem key={`weakness-${index}`} text={weakness} type="negative" />
                      ))}
                    </div>
                  )}
                  {formatRecommendations.slice(0, 1).length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-base font-semibold text-gray-700">Recommendation</h3>
                      {formatRecommendations.slice(0, 1).map((rec, index) => (
                        <FeedbackItem key={`rec-${index}`} text={rec} type="negative" />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <div className="flex flex-row gap-4 items-center w-full">
              <p className="text-2xl font-semibold">Content</p>
              <ScoreBadge score={contentScore} />
            </div>
          </AccordionHeader>
          <AccordionContent itemId="content">
            <div className="flex flex-col gap-3 mt-3">
              {contentTips.length > 0 ? (() => {
                const { goodTips, improveTips } = tipsToFeedbackItems(contentTips);
                return (
                  <>
                    {goodTips.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h3 className="text-base font-semibold text-gray-700">Strengths</h3>
                        {goodTips.map((tip, index) => (
                          <FeedbackItem key={`good-${index}`} text={tip.tip} type="positive" />
                        ))}
                      </div>
                    )}
                    {improveTips.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h3 className="text-base font-semibold text-gray-700">Areas for Improvement</h3>
                        {improveTips.map((tip, index) => (
                          <FeedbackItem key={`improve-${index}`} text={tip.tip} type="negative" />
                        ))}
                      </div>
                    )}
                  </>
                );
              })() : (
                <>
                  {contentStrengths.slice(0, 2).length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-base font-semibold text-gray-700">Strengths</h3>
                      {contentStrengths.slice(0, 2).map((strength, index) => (
                        <FeedbackItem key={`strength-${index}`} text={strength} type="positive" />
                      ))}
                    </div>
                  )}
                  {contentWeaknesses.slice(0, 2).length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-base font-semibold text-gray-700">Areas for Improvement</h3>
                      {contentWeaknesses.slice(0, 2).map((weakness, index) => (
                        <FeedbackItem key={`weakness-${index}`} text={weakness} type="negative" />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <div className="flex flex-row gap-4 items-center w-full">
              <p className="text-2xl font-semibold">Structure</p>
              <ScoreBadge score={structureScore} />
            </div>
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <div className="flex flex-col gap-3 mt-3">
              {structureTips.length > 0 ? (() => {
                const { goodTips, improveTips } = tipsToFeedbackItems(structureTips);
                return (
                  <>
                    {goodTips.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h3 className="text-base font-semibold text-gray-700">Strengths</h3>
                        {goodTips.map((tip, index) => (
                          <FeedbackItem key={`good-${index}`} text={tip.tip} type="positive" />
                        ))}
                      </div>
                    )}
                    {improveTips.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h3 className="text-base font-semibold text-gray-700">Areas for Improvement</h3>
                        {improveTips.map((tip, index) => (
                          <FeedbackItem key={`improve-${index}`} text={tip.tip} type="negative" />
                        ))}
                      </div>
                    )}
                  </>
                );
              })() : (
                atsIssues.slice(0, 3).length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-semibold text-gray-700">ATS Issues</h3>
                    {atsIssues.slice(0, 3).map((issue, index) => (
                      <FeedbackItem key={`ats-${index}`} text={issue} type="negative" />
                    ))}
                  </div>
                )
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <div className="flex flex-row gap-4 items-center w-full">
              <p className="text-2xl font-semibold">Skills</p>
              <ScoreBadge score={skillsScore} />
            </div>
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <div className="flex flex-col gap-3 mt-3">
              {skillsTips.length > 0 ? (() => {
                const { goodTips, improveTips } = tipsToFeedbackItems(skillsTips);
                return (
                  <>
                    {goodTips.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h3 className="text-base font-semibold text-gray-700">Strengths</h3>
                        {goodTips.map((tip, index) => (
                          <FeedbackItem key={`good-${index}`} text={tip.tip} type="positive" />
                        ))}
                      </div>
                    )}
                    {improveTips.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h3 className="text-base font-semibold text-gray-700">Areas for Improvement</h3>
                        {improveTips.map((tip, index) => (
                          <FeedbackItem key={`improve-${index}`} text={tip.tip} type="negative" />
                        ))}
                      </div>
                    )}
                  </>
                );
              })() : (
                <>
                  {skillStrengths.slice(0, 2).length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-base font-semibold text-gray-700">Strengths</h3>
                      {skillStrengths.slice(0, 2).map((strength, index) => (
                        <FeedbackItem key={`strength-${index}`} text={strength} type="positive" />
                      ))}
                    </div>
                  )}
                  {skillMissing.slice(0, 2).length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-base font-semibold text-gray-700">Missing Elements</h3>
                      {skillMissing.slice(0, 2).map((missing, index) => (
                        <FeedbackItem key={`missing-${index}`} text={missing} type="negative" />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;

