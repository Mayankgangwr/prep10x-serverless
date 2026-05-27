"use client";

import React, { useMemo, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, FileText, UploadCloud, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    PageHeader,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { uploadResumeSchema } from "../schemas";
import { UploadResumeValues } from "../types";
import { allowedFileTypes, MAX_FILE_SIZE } from "../constants";

type UploadResumeFormProps = Record<string, never>;


const UploadResumeForm: React.FC<UploadResumeFormProps> = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<UploadResumeValues>({
        resolver: zodResolver(uploadResumeSchema) as any,
        defaultValues: {
            resume: undefined,
            targetExperience: "",
            targetRole: "",
        },
    });

    const resumeFile = useWatch({
        control: form.control,
        name: "resume",
    });

    const selectedFileSizeLabel = useMemo(() => {
        if (!resumeFile) return "";

        return `${(resumeFile.size / (1024 * 1024)).toFixed(2)} MB`;
    }, [resumeFile]);

    const setResumeFile = (file?: File) => {
        form.setValue("resume", file as any, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });

        if (!file && inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleFileSelect = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) return;

        if (!allowedFileTypes.includes(selectedFile.type)) {
            form.setError("resume", {
                type: "manual",
                message: "Only PDF/DOC/DOCX files are allowed",
            });

            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            form.setError("resume", {
                type: "manual",
                message: "File size must be less than 5 MB",
            });

            return;
        }

        form.clearErrors("resume");

        setResumeFile(selectedFile);
    };

    const clearFile = () => {
        form.clearErrors("resume");

        setResumeFile(undefined);
    };

    const onSubmit = async (values: UploadResumeValues) => {
        try {
            // await uploadResumeFile(values.resume);
        } catch (error) {
            console.error(error);

            form.setError("root", {
                type: "server",
                message: "Failed to upload resume. Please try again.",
            });
        }
    };

    return (
        <div className="space-y-5">
            <PageHeader
                title="Upload Resume"
                description="Upload your latest resume so we can analyze it against your target role and experience level."
            />

            <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-4">
                <p className="text-sm font-semibold text-text">
                    How this works
                </p>

                <div className="mt-3 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                    <div className="flex items-start gap-2">
                        <CheckCircle2
                            size={16}
                            className="mt-0.5 shrink-0 text-primary"
                        />

                        <span>
                            Upload your latest resume in PDF/DOC/DOCX format.
                        </span>
                    </div>

                    <div className="flex items-start gap-2">
                        <CheckCircle2
                            size={16}
                            className="mt-0.5 shrink-0 text-primary"
                        />

                        <span>
                            We analyze it against your target role and
                            experience level.
                        </span>
                    </div>

                    <div className="flex items-start gap-2">
                        <CheckCircle2
                            size={16}
                            className="mt-0.5 shrink-0 text-primary"
                        />

                        <span>
                            After that, you can generate your roadmap in one
                            click.
                        </span>
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <FormField
                        control={form.control}
                        name="resume"
                        render={({ field: { ref, onBlur } }) => (
                            <FormItem>
                                <Label htmlFor="resume-upload">
                                    Resume
                                </Label>

                                <FormControl>
                                    <div className="space-y-2">
                                        <input
                                            ref={(node) => {
                                                inputRef.current = node;
                                                ref(node);
                                            }}
                                            id="resume-upload"
                                            type="file"
                                            accept={allowedFileTypes.join(",")}
                                            onBlur={onBlur}
                                            onChange={handleFileSelect}
                                            className="sr-only"
                                        />

                                        <label
                                            htmlFor="resume-upload"
                                            className={`flex min-h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors duration-200 ${
                                                resumeFile
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border bg-background/40 hover:border-primary/50 hover:bg-primary/2"
                                            }`}
                                        >
                                            {resumeFile ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                        <FileText size={20} />
                                                    </div>

                                                    <div className="text-left">
                                                        <p className="text-sm font-medium text-text">
                                                            {resumeFile.name}
                                                        </p>

                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                selectedFileSizeLabel
                                                            }{" "}
                                                            | Click to replace
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();

                                                            clearFile();
                                                        }}
                                                        className="ml-2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-error/10 hover:text-error"
                                                        aria-label="Remove selected file"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                        <UploadCloud size={22} />
                                                    </div>

                                                    <p className="text-sm text-text">
                                                        Click to upload your
                                                        resume
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        Supported formats:
                                                        PDF/DOC/DOCX | Max 5 MB
                                                    </p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid gap-4 lg:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="targetRole"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor={field.name}>
                                        Target role
                                    </Label>

                                    <FormControl>
                                        <Input
                                            id={field.name}
                                            placeholder="Senior Frontend Engineer"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="targetExperience"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor={field.name}>
                                        Target experience
                                    </Label>

                                    <FormControl>
                                        <Input
                                            id={field.name}
                                            placeholder="5+ years"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {form.formState.errors.root?.message ? (
                        <p className="text-sm text-error">
                            {form.formState.errors.root.message}
                        </p>
                    ) : null}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-muted-foreground">
                            We use this upload to analyze your readiness and
                            guide your next step.
                        </p>

                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            {form.formState.isSubmitting
                                ? "Analyzing Resume..."
                                : "Upload & Analyze Resume"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default UploadResumeForm;
