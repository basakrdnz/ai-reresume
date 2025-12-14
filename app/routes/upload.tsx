import { type FormEvent, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
        const { auth, isLoading, fs, ai, kv } = usePuterStore();
        const navigate = useNavigate();

        const [isProcessing, setIsProcessing] = useState(false);
        const [statusText, setStatusText] = useState("");
        const [file, setFile] = useState<File | null>(null);

        const handleFileSelect = (file: File | null) => {
            setFile(file);
        };

        const handleAnalyze = async ({companyName, jobTitle, jobDescription, file,}: { companyName: string; jobTitle: string; jobDescription: string; file: File;
        }) => {
            setIsProcessing(true);

            setStatusText("Uploading the file...");
            const uploadedFile = await fs.upload([file]);

            if (!uploadedFile) {
                setStatusText("Error: Failed to upload file");
                return;
            }

            setStatusText("Converting to image...");
            const imageResult = await convertPdfToImage(file);

            if (!imageResult.file) {
                setStatusText(
                    imageResult.error || "Error: Failed to convert PDF to image"
                );
                return;
            }

            setStatusText("Uploading the image...");
            const uploadedImage = await fs.upload([imageResult.file]);

            if (!uploadedImage) {
                setStatusText("Error: Failed to upload image");
                return;
            }

            setStatusText("Preparing data...");

            const uuid = generateUUID();

            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: "",
            };

            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText("Analyzing...");

            const feedback: AIResponse | undefined = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({AIResponseFormat: "", jobTitle, jobDescription })
            );

            if (!feedback)
                return setStatusText("Error: Failed to analyze resume");

            const feedbackText =
                typeof feedback.message.content === "string"
                    ? feedback.message.content
                    : feedback.message.content[0].text;

            data.feedback = JSON.parse(feedbackText);

            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText("Analysis complete, redirecting...");
            console.log(data);
            
            setIsProcessing(false);
            navigate(`/resume/${uuid}`);



        };

        const handleSubmit: (e: FormEvent<HTMLFormElement>) => void = (
            e: FormEvent<HTMLFormElement>
        ) => {
            e.preventDefault();

            const form = e.currentTarget;
            const formData = new FormData(form);

            const companyName = formData.get("company-name") as string;
            const jobTitle = formData.get("job-title") as string;
            const jobDescription = formData.get("job-description") as string;

            if (!file) return;

            handleAnalyze({
                companyName,
                jobTitle,
                jobDescription,
                file,
            });
        };
return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar/>

        <section className="main-section">
            <div className="page-heading py-16">
                <h1>Smart feedback for your dream job</h1>

                {isProcessing ? (
                    <>
                        <h2>{statusText}</h2>
                        <img
                            src="/images/resume-scan.gif"
                            className="w-full"
                            alt="scanning"
                        />
                    </>
                ) : (
                    <h2>Drop your resume for an ATS score and improvement tips</h2>
                )}

                {!isProcessing && (
                    <form
                        id="upload-form"
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6"
                    >
                        {/* Company Name */}
                        <div className="form-div">
                            <label htmlFor="company-name">Company Name</label>
                            <input
                                type="text"
                                name="company-name"
                                placeholder="Company Name"
                            />
                        </div>

                        {/* Job Title */}
                        <div className="form-div">
                            <label htmlFor="job-title">Job Title</label>
                            <input type="text" name="job-title" placeholder="Job Title"/>
                        </div>

                        {/* Job Description */}
                        <div className="form-div">
                            <label htmlFor="job-description">Job Description</label>
                            <textarea
                                rows={5}
                                name="job-description"
                                placeholder="Job Description"
                            ></textarea>
                        </div>

                        {/* File Uploader */}
                        <div className="form-div">
                            <label htmlFor="uploader">Upload Resume</label>
                            <FileUploader onFileSelect={handleFileSelect}></FileUploader>
                        </div>

                        <button className="primary-button" type="submit">
                            Analyze Resume
                        </button>
                    </form>
                )}
            </div>
        </section>
    </main>
);
}
;

export default Upload;
