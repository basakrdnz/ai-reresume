interface Job {
    title: string;
    description: string;
    location: string;
    requiredSkills: string[];
}

interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
}

interface Feedback {
    overall_rating: number; // 0-10 scale
    strengths: string[];
    weaknesses: string[];
    ats_compatibility: number; // 0-10 scale
    ats_issues: string[];
    content_analysis: {
        technical_skills: number; // 0-10 scale
        experience_relevance: number; // 0-10 scale
        achievements: number; // 0-10 scale
        education: number; // 0-10 scale
        formatting: number; // 0-10 scale
    };
    missing_elements: string[];
    improvement_suggestions: string[];
    job_fit_analysis: {
        match_score: number; // 0-10 scale
        relevant_experience: string;
        gaps: string[];
    };
    recommendations: string[];
    // Legacy fields for backward compatibility (computed from new structure)
    overallScore?: number;
    ATS?: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    toneAndStyle?: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content?: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure?: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills?: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
}