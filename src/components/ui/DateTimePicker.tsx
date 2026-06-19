"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse, isValid } from "date-fns";
import { ClockIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    value: string; // "YYYY-MM-DD HH:MM" or ""
    onChange: (value: string) => void;
    locale: string;
};

// Shop hours: 7 AM (07) to 11 PM (23)
const OPEN_H = 7;
const CLOSE_H = 23;
const MINUTES = [0, 30];

function SpinnerColumn({
    label,
    display,
    onUp,
    onDown,
    disableUp,
    disableDown,
}: {
    label: string;
    display: string;
    onUp: () => void;
    onDown: () => void;
    disableUp: boolean;
    disableDown: boolean;
}) {
    return (
        <div className="flex flex-col items-center gap-1 select-none">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]/30 mb-1">
                {label}
            </p>
            <button
                type="button"
                onClick={onUp}
                disabled={disableUp}
                className={cn(
                    "w-10 h-8 flex items-center justify-center rounded-md transition-colors",
                    "text-[var(--color-ink)]/40 hover:bg-[var(--color-earth-100)] hover:text-[var(--color-ink)]",
                    "disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                )}
            >
                <ChevronUpIcon size={16} strokeWidth={2.5} />
            </button>

            <div className="w-16 h-14 flex items-center justify-center bg-[var(--color-earth-50)] rounded-lg border border-[var(--color-earth-100)]">
                <span className="font-display text-2xl font-semibold text-[var(--color-ink)] tabular-nums">
                    {display}
                </span>
            </div>

            <button
                type="button"
                onClick={onDown}
                disabled={disableDown}
                className={cn(
                    "w-10 h-8 flex items-center justify-center rounded-md transition-colors",
                    "text-[var(--color-ink)]/40 hover:bg-[var(--color-earth-100)] hover:text-[var(--color-ink)]",
                    "disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                )}
            >
                <ChevronDownIcon size={16} strokeWidth={2.5} />
            </button>
        </div>
    );
}

export default function DateTimePicker({ value, onChange, locale }: Props) {
    const isBn = locale === "bn";

    const [datePart, timePart] = value.split(" ");
    const selectedDate = datePart && isValid(parse(datePart, "yyyy-MM-dd", new Date()))
        ? parse(datePart, "yyyy-MM-dd", new Date())
        : undefined;

    const [month, setMonth] = useState<Date>(selectedDate ?? new Date());

    // Parse current time or default to opening time
    const currentH = timePart ? parseInt(timePart.split(":")[0], 10) : OPEN_H;
    const currentM = timePart ? parseInt(timePart.split(":")[1], 10) : 0;

    function setTime(h: number, m: number) {
        const hh = String(h).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        const ymd = datePart ?? format(new Date(), "yyyy-MM-dd");
        onChange(`${ymd} ${hh}:${mm}`);
    }

    function pickDate(day: Date | undefined) {
        if (!day) return;
        const ymd = format(day, "yyyy-MM-dd");
        const hh = String(currentH).padStart(2, "0");
        const mm = String(currentM).padStart(2, "0");
        onChange(timePart ? `${ymd} ${timePart}` : `${ymd} ${hh}:${mm}`);
    }

    // 12h display helpers
    const h12 = currentH % 12 || 12;
    const isPM = currentH >= 12;
    const periodBn = currentH < 12 ? "সকাল" : currentH < 17 ? "বিকেল" : currentH < 20 ? "সন্ধ্যা" : "রাত";

    function incrementHour() { if (currentH < CLOSE_H) setTime(currentH + 1, currentM); }
    function decrementHour() { if (currentH > OPEN_H) setTime(currentH - 1, currentM); }
    function incrementMin() {
        const idx = MINUTES.indexOf(currentM);
        if (idx < MINUTES.length - 1) setTime(currentH, MINUTES[idx + 1]);
    }
    function decrementMin() {
        const idx = MINUTES.indexOf(currentM);
        if (idx > 0) setTime(currentH, MINUTES[idx - 1]);
    }
    function togglePeriod() {
        if (isPM && currentH - 12 >= OPEN_H) setTime(currentH - 12, currentM);
        if (!isPM && currentH + 12 <= CLOSE_H) setTime(currentH + 12, currentM);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
        cell: "flex-1 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: cn(
            "h-9 w-9 p-0 mx-auto font-normal rounded-md",
            "flex items-center justify-center",
            "hover:bg-[var(--color-earth-100)] hover:text-[var(--color-ink)]",
            "transition-colors cursor-pointer"
        ),
        day_selected: "!bg-[var(--color-terracotta-500)] !text-white font-semibold hover:!bg-[var(--color-terracotta-600)]",
        day_today: "border border-[var(--color-terracotta-400)] text-[var(--color-terracotta-600)] font-semibold",
        day_outside: "text-[var(--color-ink)]/20",
        day_disabled: "text-[var(--color-ink)]/15 !cursor-not-allowed hover:!bg-transparent",
        day_hidden: "invisible",
    };

    const summaryDate = selectedDate ? format(selectedDate, "EEE, MMM d") : null;
    const summaryTime = timePart
        ? isBn
            ? `${periodBn} ${h12}:${String(currentM).padStart(2, "0")}`
            : `${h12}:${String(currentM).padStart(2, "0")} ${isPM ? "PM" : "AM"}`
        : null;

    return (
        <div className="border border-[var(--color-earth-100)] overflow-hidden bg-white">
            {/* Summary strip */}
            {(summaryDate || summaryTime) && (
                <div className="px-4 py-2.5 bg-[var(--color-terracotta-500)] text-white text-xs font-semibold tracking-wide flex items-center gap-2">
                    <ClockIcon size={12} />
                    {summaryDate}
                    {summaryDate && summaryTime && " · "}
                    {summaryTime}
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

            {/* Time dialler */}
            <div className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink)]/35 mb-4">
                    {isBn ? "সময় বাছুন" : "Select time"}
                    <span className="ml-2 normal-case font-normal text-[var(--color-ink)]/25">
                        {isBn ? "(সকাল ৭টা – রাত ১১টা)" : "(7 AM – 11 PM)"}
                    </span>
                </p>

                <div className="flex items-center justify-center gap-3">
                    {/* Hour */}
                    <SpinnerColumn
                        label={isBn ? "ঘণ্টা" : "Hour"}
                        display={String(h12).padStart(2, "0")}
                        onUp={incrementHour}
                        onDown={decrementHour}
                        disableUp={currentH >= CLOSE_H}
                        disableDown={currentH <= OPEN_H}
                    />

                    <span className="font-display text-3xl font-bold text-[var(--color-ink)]/20 mt-5 select-none">
                        :
                    </span>

                    {/* Minute */}
                    <SpinnerColumn
                        label={isBn ? "মিনিট" : "Min"}
                        display={String(currentM).padStart(2, "0")}
                        onUp={incrementMin}
                        onDown={decrementMin}
                        disableUp={MINUTES.indexOf(currentM) >= MINUTES.length - 1}
                        disableDown={MINUTES.indexOf(currentM) <= 0}
                    />

                    {/* AM / PM toggle */}
                    <div className="flex flex-col gap-1 mt-5 ml-1">
                        <button
                            type="button"
                            onClick={() => !isPM && togglePeriod()}
                            className={cn(
                                "px-3 py-1.5 text-xs font-bold rounded-md transition-colors",
                                !isPM
                                    ? "bg-[var(--color-terracotta-500)] text-white"
                                    : "bg-[var(--color-earth-50)] text-[var(--color-ink)]/35 hover:bg-[var(--color-earth-100)]"
                            )}
                        >
                            {isBn ? "সকাল" : "AM"}
                        </button>
                        <button
                            type="button"
                            onClick={() => isPM && togglePeriod()}
                            className={cn(
                                "px-3 py-1.5 text-xs font-bold rounded-md transition-colors",
                                isPM
                                    ? "bg-[var(--color-terracotta-500)] text-white"
                                    : "bg-[var(--color-earth-50)] text-[var(--color-ink)]/35 hover:bg-[var(--color-earth-100)]"
                            )}
                        >
                            {isBn ? "বিকেল/রাত" : "PM"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
