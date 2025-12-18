import type { Route } from "./+types/resume";
import { useParams, useNavigate, Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useState, useEffect } from "react";
import Summary from "~/components/feedback/Summary";
import FullFeedbackDownload from "~/components/feedback/FullFeedbackDownload";
import UsageIndicator from "~/components/UsageIndicator";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Resumind | Review" },
    { name: "description", content: "Detailed overview of your resume" },
  ];
}

export default function Resume() {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [resumeData, setResumeData] = useState<{
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    resumePath: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
      return;
    }

    const loadResume = async () => {
      if (!id) return;

      try {
        const resume = await kv.get(`resume:${id}`);
        if (!resume) {
          setLoading(false);
          return;
        }

        const data = JSON.parse(resume);
        setResumeData(data);
        setFeedback(data.feedback);

        // Fetch monthly usage info (silently, no logging in production)
        try {
          await auth.getMonthlyUsage();
        } catch (err) {
          // Silently handle usage fetch errors
        }

        // Load first image (supports legacy single imagePath and new imagePaths array)
        const firstImagePath = data.imagePath || data.imagePaths?.[0];
        if (firstImagePath) {
          try {
            const imageBlob = await fs.read(firstImagePath);
            if (imageBlob) {
              const imageUrl = URL.createObjectURL(imageBlob);
              setImageUrl(imageUrl);
            }
          } catch (err) {
            // Silently handle image load errors
          }
        }

        // Load resume PDF
        if (data.resumePath) {
          try {
            const resumeBlob = await fs.read(data.resumePath);
            if (!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);
          } catch (err) {
            // Silently handle resume load errors
          }
        }
      } catch (err) {
        // Silently handle resume data load errors
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [isLoading]);

  if (loading) {
    return (
      <main className="!pt-0">
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!resumeData || !feedback) {
    return (
      <main className="!pt-0">
        <nav className="resume-nav">
          <Link to="/" className="back-button">
            <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
            <span className="text-gray-800 text-sm font-semibold">
              Back to Homepage
            </span>
          </Link>
        </nav>
        <div className="flex items-center justify-center min-h-screen">
          <p>Resume not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="relative feedback-section bg-[url('/images/bg-small.svg')] bg-cover">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10">
          <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <FullFeedbackDownload feedback={feedback} resumeUrl={resumeUrl} />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full" alt="loading" />
          )}
          </div>
        </section>

        {imageUrl && resumeUrl && (
          <div className="animate-in fade-in duration-1000 gradient-border max-lg:w-full w-1/2 p-4">
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={imageUrl}
                className="w-full h-full object-contain rounded-2xl"
                title="resume"
                alt="resume"
              />
            </a>
          </div>
        )}
      </div>

      <UsageIndicator />
    </main>
  );
}
