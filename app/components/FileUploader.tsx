import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/util";

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const maxFileSize = 20 * 1024 * 1024; // 20MB

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const selectedFile = acceptedFiles[0] || null;
            setFile(selectedFile);
            onFileSelect?.(selectedFile);
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { "application/pdf": [".pdf"] },
        maxSize: maxFileSize,
    });

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()} className="cursor-pointer">
                <input {...getInputProps()} />

                <div className="space-y-4 p-6 text-center">
                    {file ? (
                        <div
                            className="uploader-selected-file flex items-center justify-between"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center space-x-3 min-w-0">
                                <img src="/images/pdf.png" alt="pdf" className="size-10" />

                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-700 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="p-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                    onFileSelect?.(null);
                                }}
                            >
                                <img
                                    src="/icons/cross.svg"
                                    alt="remove"
                                    className="w-4 h-4"
                                />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                                <img
                                    src="/icons/info.svg"
                                    alt="upload"
                                    className="size-20 opacity-70"
                                />
                            </div>

                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-sm text-gray-400">
                                PDF (max {formatSize(maxFileSize)})
                            </p>
                        </div>
                    )}

                    {isDragActive && (
                        <p className="text-blue-500 font-semibold">
                            Drop it here...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploader;
