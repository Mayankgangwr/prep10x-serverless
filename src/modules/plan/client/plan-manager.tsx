"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    BadgeCheck,
    CalendarRange,
    CheckCircle2,
    CreditCard,
    PencilLine,
    Plus,
    RotateCcw,
    Sparkles,
    Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    PageHeader,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { PLAN_PAGE_COPY } from "../constants";
import { toPlanFormValues } from "../actions";
import { billingCycles, planFormSchema } from "../schemas";
import type { PlanFormValues, PlanItem } from "../types";
import { usePlanManager } from "../hooks";

const billingCycleLabels: Record<PlanFormValues["billingCycle"], string> = {
    monthly: "Monthly",
    quarterly: "Quarterly",
    yearly: "Yearly",
};

const statusStyles: Record<PlanItem["status"], string> = {
    active: "bg-success/10 text-success",
    draft: "bg-warning/15 text-warning",
};

const initialFormValues: PlanFormValues = {
    name: "",
    price: 0,
    billingCycle: "monthly",
    description: "",
    featuresText: "",
    status: "active",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

type PlanManagerProps = {
    initialPlans: PlanItem[];
};

export default function PlanManager({ initialPlans }: PlanManagerProps) {
    const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
    const {
        plans,
        addPlan,
        editPlan,
        removePlan,
        refreshPlans,
        isRefreshing,
        isSubmitting,
    } = usePlanManager({ initialPlans });

    const editingPlan = useMemo(
        () => plans.find((plan) => plan.id === editingPlanId) ?? null,
        [editingPlanId, plans]
    );

    const form = useForm<PlanFormValues>({
        resolver: zodResolver(planFormSchema),
        defaultValues: initialFormValues,
    });

    const summary = useMemo(() => {
        const activeCount = plans.filter((plan) => plan.status === "active").length;
        const totalValue = plans.reduce((sum, plan) => sum + plan.price, 0);

        return {
            activeCount,
            totalValue,
        };
    }, [plans]);

    const handleSubmit = async (values: PlanFormValues) => {
        try {
            if (editingPlanId) {
                await editPlan(editingPlanId, values);
            } else {
                await addPlan(values);
            }

            setEditingPlanId(null);
            form.reset(initialFormValues);
        } catch (error) {
            console.error(error);

            form.setError("root", {
                type: "server",
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to save plan. Please try again.",
            });
        }
    };

    const handleEdit = (plan: PlanItem) => {
        setEditingPlanId(plan.id);
        form.reset(toPlanFormValues(plan));
    };

    const handleCancelEdit = () => {
        setEditingPlanId(null);
        form.reset(initialFormValues);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title={PLAN_PAGE_COPY.title}
                description={PLAN_PAGE_COPY.description}
                actions={
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                            try {
                                await refreshPlans();
                            } catch (error) {
                                console.error(error);

                                form.setError("root", {
                                    type: "server",
                                    message:
                                        error instanceof Error
                                            ? error.message
                                            : "Failed to reload plans. Please try again.",
                                });
                            }
                        }}
                        className="gap-2"
                        disabled={isRefreshing}
                    >
                        <RotateCcw size={16} />
                        {isRefreshing ? "Refreshing..." : "Reload from DB"}
                    </Button>
                }
            />

            <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-4">
                <p className="text-sm font-semibold text-text">How this works</p>

                <div className="mt-3 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
                    <div className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                        <span>Plan data loads directly from the database when you open the tab.</span>
                    </div>

                    <div className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                        <span>Use the form to create a new plan or update an existing one.</span>
                    </div>

                    <div className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                        <span>Delete buttons remove records immediately from the database.</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <Card className="border-border/70 bg-surface/70 shadow-sm">
                    <CardHeader className="space-y-3 border-b border-border/60 pb-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-xl">Manage plan</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {editingPlanId
                                        ? `Editing ${editingPlan?.name ?? "plan"}`
                                        : "Add a new plan to the catalog"}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                                <Sparkles size={14} className="text-primary" />
                                {plans.length} plans available
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label htmlFor={field.name}>Plan name</Label>
                                                <FormControl>
                                                    <Input
                                                        id={field.name}
                                                        placeholder="Basic"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label htmlFor={field.name}>Price</Label>
                                                <FormControl>
                                                    <Input
                                                        id={field.name}
                                                        type="number"
                                                        min={0}
                                                        placeholder="499"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="billingCycle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Billing cycle</Label>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select billing cycle" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {billingCycles.map((cycle) => (
                                                            <SelectItem key={cycle} value={cycle}>
                                                                {billingCycleLabels[cycle]}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Status</Label>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor={field.name}>Description</Label>
                                            <FormControl>
                                                <textarea
                                                    id={field.name}
                                                    rows={4}
                                                    placeholder="Describe what this plan includes and who it is for."
                                                    className="flex min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="featuresText"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor={field.name}>Features</Label>
                                            <FormControl>
                                                <textarea
                                                    id={field.name}
                                                    rows={4}
                                                    placeholder="Dashboard access, roadmap drafts, weekly progress tracking"
                                                    className="flex min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <p className="text-xs text-muted-foreground">
                                                Separate each feature with a comma.
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {form.formState.errors.root?.message ? (
                                    <p className="text-sm text-error">
                                        {form.formState.errors.root.message}
                                    </p>
                                ) : null}

                                <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="text-xs text-muted-foreground">
                                        {editingPlanId
                                            ? "You are updating an existing plan."
                                            : "Submitting will add a new plan to the catalog."}
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        {editingPlanId ? (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={handleCancelEdit}
                                                disabled={isSubmitting}
                                            >
                                                Cancel edit
                                            </Button>
                                        ) : null}

                                        <Button
                                            type="submit"
                                            className="gap-2"
                                            disabled={isSubmitting}
                                        >
                                            {editingPlanId ? (
                                                <PencilLine size={16} />
                                            ) : (
                                                <Plus size={16} />
                                            )}
                                            {isSubmitting
                                                ? "Saving..."
                                                : editingPlanId
                                                  ? "Update plan"
                                                  : "Add plan"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Card className="border-border/70 bg-surface/70 shadow-sm">
                            <CardContent className="flex items-center gap-3 p-5">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total plans</p>
                                    <p className="text-2xl font-semibold tracking-tight">{plans.length}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/70 bg-surface/70 shadow-sm">
                            <CardContent className="flex items-center gap-3 p-5">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
                                    <BadgeCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Active plans</p>
                                    <p className="text-2xl font-semibold tracking-tight">{summary.activeCount}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-border/70 bg-surface/70 shadow-sm">
                        <CardHeader className="space-y-2 border-b border-border/60 pb-5">
                            <CardTitle className="text-xl">Plan catalog</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Browse, update, or delete the current plan data.
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-4 pt-5">
                            {plans.length > 0 ? (
                                plans.map((plan) => (
                                    <article
                                        key={plan.id}
                                        className="rounded-2xl border border-border/70 bg-background/90 p-4 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="space-y-3">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-lg font-semibold tracking-tight">
                                                        {plan.name}
                                                    </h3>

                                                    <span
                                                        className={[
                                                            "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
                                                            statusStyles[plan.status],
                                                        ].join(" ")}
                                                    >
                                                        {plan.status}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <CreditCard size={14} />
                                                        {currencyFormatter.format(plan.price)} /{" "}
                                                        {billingCycleLabels[plan.billingCycle].toLowerCase()}
                                                    </span>

                                                    <span className="inline-flex items-center gap-1.5">
                                                        <CalendarRange size={14} />
                                                        {billingCycleLabels[plan.billingCycle]} billing
                                                    </span>
                                                </div>

                                                <p className="text-sm leading-6 text-muted-foreground">
                                                    {plan.description}
                                                </p>

                                                <div className="flex flex-wrap gap-2">
                                                    {plan.features.map((feature) => (
                                                        <span
                                                            key={`${plan.id}-${feature}`}
                                                            className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                                                        >
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 gap-2 sm:flex-col">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(plan)}
                                                    className="gap-2"
                                                    disabled={isSubmitting}
                                                >
                                                    <PencilLine size={14} />
                                                    Edit
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={async () => {
                                                        try {
                                                            await removePlan(plan.id);

                                                            if (editingPlanId === plan.id) {
                                                                handleCancelEdit();
                                                            }
                                                        } catch (error) {
                                                            console.error(error);
                                                            form.setError("root", {
                                                                type: "server",
                                                                message:
                                                                    error instanceof Error
                                                                        ? error.message
                                                                        : "Failed to delete plan. Please try again.",
                                                            });
                                                        }
                                                    }}
                                                    className="gap-2"
                                                    disabled={isSubmitting}
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-border/80 bg-background/60 px-4 py-10 text-center">
                                    <p className="text-base font-semibold text-text">
                                        No plans available
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Add a new plan or reload from the database to start rendering data here.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 bg-gradient-to-br from-background via-surface/60 to-accent/20 shadow-sm">
                        <CardContent className="flex items-start justify-between gap-4 p-5">
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-text">Catalog summary</p>
                                <p className="text-sm text-muted-foreground">
                                    Total monthly value across all plans.
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Estimated monthly value
                                </p>
                                <p className="text-2xl font-semibold tracking-tight">
                                    {currencyFormatter.format(summary.totalValue)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
