"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse, isValid } from "date-fns";
import { ClockIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    value: string; // "YYYY-MM-DD HH:MM" or ""
    onChange: (value: string) => void;
    locale: string;
};

const TIME_SLOTS: string[] = [];
for (let h = 7; h <= 23; h++) {
    TIME_SLOTS.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 23) TIME_SLOTS.push(`${String(h).padStart(2, "0")}:30`);
}

function formatTimeLabel(t: string, isBn: boolean) {
    const [h, m] = t.split(":").map(Number);
    const h12 = h % 12 || 12;
    const mm = String(m).padStart(2, "0");
    if (isBn) {
        const period = h < 12 ? "সকাল" : h < 17 ? "বিকেল" : h < 20 ? "সন্ধ্যা" : "রাত";
        return `${period} ${h12}:${mm}`;
    }
    return `${h12}:${mm} ${h < 12 ? "AM" : "PM"}`;
}

export default function DateTimePicker({ value, onChange, locale }: Props) {
    const isBn = locale === "bn";

    const [datePart, timePart] = value.split(" ");
    const selectedDate = datePart && isValid(parse(datePart, "yyyy-MM-dd", new Date()))
        ? parse(datePart, "yyyy-MM-dd", new Date())
        : undefined;

    const [month, setMonth] = useState<Date>(selectedDate ?? new Date());

    function pickDate(day: Date | undefined) {
        if (!day) return;
        const ymd = format(day, "yyyy-MM-dd");
        onChange(timePart ? `${ymd} ${timePart}` : ymd);
    }

    function pickTime(t: string) {
        const ymd = datePart ?? format(new Date(), "yyyy-MM-dd");
        onChange(`${ymd} ${t}`);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // shadcn-style classNames for DayPicker
    const calClassNames = {
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-semibold text-[var(--color-ink)]",
        nav: "flex items-center gap-1",
        nav_button: cn(
            "h-7 w-7 bg-transparent p-0 flex items-center justify-center",
            "border border-[var(--color-earth-100)] rounded-md",
            "text-[var(--color-ink)]/40 hover:text-[var(--color-ink)] hover:bg-[var(--color-earth-100)]",
            "transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "text-[var(--color-ink)]/30 rounded-md w-9 font-medium text-[0.7rem] flex-1 text-center pb-1",
        row: "flex w-full mt-1",
        cell: cn(
            "flex-1 text-center text-sm p-0 relative",
            "focus-within:relative focus-within:z-20"
        ),
        day: cn(
            "h-9 w-9 p-0 mx-auto font-normal rounded-md",
            "flex items-center justify-center",
            "hover:bg-[var(--color-earth-100)] hover:text-[var(--color-ink)]",
            "transition-colors cursor-pointer",
            "aria-selected:opacity-100"
        ),
        day_selected: cn(
            "!bg-[var(--color-terracotta-500)] !text-white font-semibold",
            "hover:!bg-[var(--color-terracotta-600)]"
        ),
        day_today: cn(
            "border border-[var(--color-terracotta-400)]",
            "text-[var(--color-terracotta-600)] font-semibold"
        ),
        day_outside: "text-[var(--color-ink)]/20 aria-selected:!bg-[var(--color-earth-50)] aria-selected:!text-[var(--color-ink)]/30",
        day_disabled: "text-[var(--color-ink)]/15 !cursor-not-allowed hover:!bg-transparent",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
    };

    return (
        <div className="border border-[var(--color-earth-100)] overflow-hidden bg-white">
            {/* Selected summary */}
            {(datePart || timePart) && (
                <div className="px-4 py-2.5 bg-[var(--color-terracotta-500)] text-white text-xs font-semibold tracking-wide flex items-center gap-2">
                    <ClockIcon size={12} />
                    {selectedDate && format(selectedDate, "EEE, MMM d, yyyy")}
                    {datePart && timePart && " · "}
                    {timePart && formatTimeLabel(timePart, isBn)}
                </div>
            )}

            {/* Calendar */}
            <div className="p-3 border-b border-[var(--color-earth-100)]">
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={pickDate}
                    month={month}
                    onMonthChange={setMonth}
                    disabled={{ before: today }}
                    classNames={calClassNames}
                    components={{
                        IconLeft: () => <ChevronLeftIcon size={14} strokeWidth={2.5} />,
                        IconRight: () => <ChevronRightIcon size={14} strokeWidth={2.5} />,
                    }}
                    showOutsideDays
                />
            </div>

            {/* Time slots */}
            <div className="p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink)]/35 mb-2.5">
                    {isBn ? "সময় বাছুন" : "Select time"}
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                    {TIME_SLOTS.map((t) => {
                        const active = t === timePart;
                        return (
                            <button
                                key={t}
                                type="button"
                                onClick={() => pickTime(t)}
                                className={cn(
                                    "py-1.5 px-1 text-[11px] font-medium rounded-md transition-colors text-center leading-tight",
                                    active
                                        ? "bg-[var(--color-terracotta-500)] text-white shadow-sm"
                                        : "bg-[var(--color-earth-50)] text-[var(--color-ink)]/55 hover:bg-[var(--color-earth-100)] hover:text-[var(--color-ink)]"
                                )}
                            >
                                {formatTimeLabel(t, isBn)}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
