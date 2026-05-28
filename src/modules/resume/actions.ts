export const extractText = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/resume/extract", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const payload = (await response.json()) as {
            success: false;
            error?: { message?: string };
        };

        throw new Error(
            payload.error?.message ?? "Failed to extract text from resume."
        );
    }

    const payload = (await response.json()) as {
        success: true;
        data: { text: string };
    };

    return payload.data.text;
}