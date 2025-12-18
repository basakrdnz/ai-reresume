export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

export interface PdfMultiConversionResult {
    imageUrls: string[];
    files: File[];
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then(async (lib) => {
        // Set the worker source to use the worker from the package (same version)
        // This ensures version compatibility
        const workerUrl = new URL(
            "pdfjs-dist/build/pdf.worker.min.mjs",
            import.meta.url
        ).toString();
        lib.GlobalWorkerOptions.workerSrc = workerUrl;
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });

    return loadPromise;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    const result = await convertPdfToImages(file);
    if (result.error) {
        return { imageUrl: "", file: null, error: result.error };
    }

    return {
        imageUrl: result.imageUrls[0] || "",
        file: result.files[0] || null,
    };
}

export async function convertPdfToImages(
    file: File
): Promise<PdfMultiConversionResult> {
    try {
        const lib = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;


        const imageUrls: string[] = [];
        const files: File[] = [];

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const viewport = page.getViewport({ scale: 4 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            if (context) {
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = "high";
            }

            await page.render({ canvasContext: context!, viewport }).promise;

            const blob: Blob | null = await new Promise((resolve) => {
                canvas.toBlob((createdBlob) => resolve(createdBlob), "image/png", 1.0);
            });

            if (!blob) {
                return {
                    imageUrls: [],
                    files: [],
                    error: "Failed to create image blob",
                };
            }

            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File(
                [blob],
                `${originalName}-page-${pageNumber}.png`,
                {
                    type: "image/png",
                }
            );

            imageUrls.push(URL.createObjectURL(blob));
            files.push(imageFile);
        }

        return { imageUrls, files };
    } catch (err) {
        return {
            imageUrls: [],
            files: [],
            error: `Failed to convert PDF: ${err}`,
        };
    }
}