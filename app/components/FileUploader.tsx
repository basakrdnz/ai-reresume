import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file: File | null = acceptedFiles[0] || null;
        onFileSelect?.(file);
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        multiple: false,
        accept:{'application/pdf':['.pdf']},
        maxSize:20 * 1024 * 1024,
    });
    const file=acceptedFiles[0]||null;

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()} className="cursor-pointer">
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer p-6 text-center">

                    {/* icon */}
                    <div className="mx-auto w-16 h-16 flex items-center justify-center">
                        <img
                            src="/icons/info.svg"
                            alt="upload"
                            className="size-20 opacity-70"
                        />
                    </div>

                    {/* if file selected */}
                    {file ? (
                        <div className="text-lg font-semibold text-gray-700">
                            {file.name}
                        </div>
                    ) : (
                        <div>
                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-lg text-gray-500">PDF (max 20 MB)</p>
                        </div>
                    )}

                    {/* Drag active indication */}
                    {isDragActive && (
                        <p className="text-blue-500 font-semibold">Drop it here...</p>
                    )}

                </div>
            </div>
        </div>
    );
};

export default FileUploader;
