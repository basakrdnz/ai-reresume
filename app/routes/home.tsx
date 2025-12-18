import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reresume" },
    { name: "description", content: "Step by step to your dream job.." },
  ];
}

export default function Home() {
    const { auth } = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated]);
    return <main className="relative bg-[url('/images/bg-main.svg')] bg-cover">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10">
        <Navbar></Navbar>
        <section className="main-section">
            <div className="page-heading py-16">
                <h1>Track Your Applications and CV Scores</h1>
                <h2>Review your applications and get AI-powered feedback.</h2>
            </div>
        {resumes.length > 0 && (
            <div className="resumes-section">
                {resumes.map((resume) => (
                    <ResumeCard key={resume.id} resume={resume} />
                ))}
            </div>
        )}
        </section>
        </div>
    </main>
}
