"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    value: string; // "YYYY-MM-DD HH:MM" or ""
    onChange: (value: string) => void;
    locale: string;
};

const OPEN_H  = 7;
const CLOSE_H = 23;
const MINUTES = [0, 30];

/* ── Spinner column ─────────────────────────────────────────── */
function Spinner({
    label, display, onUp, onDown, disableUp, disableDown,
}: {
    label: string; display: string;
    onUp: () => void; onDown: () => void;
    disableUp: boolean; disableDown: boolean;
}) {
    const arrowCls = cn(
        "w-9 h-8 flex items-center justify-center rounded-md transition-colors",
        "text-[var(--color-ink)]/35 hover:bg-white/60 hover:text-[var(--color-ink)]",
        "disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent",
    );
    return (
        <div className="flex flex-col items-center gap-0.5 select-none">
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-1">
                {label}
            </span>
            <button type="button" onClick={onUp} disabled={disableUp} className={arrowCls}>
                <ChevronUpIcon size={15} strokeWidth={2.5} />
            </button>
            <div className="w-14 h-12 flex items-center justify-center bg-white/15 rounded-xl border border-white/20 backdrop-blur-sm">
                <span className="font-display text-3xl font-bold text-white tabular-nums leading-none">
                    {display}
                </span>
            </div>
            <button type="button" onClick={onDown} disabled={disableDown} className={arrowCls}>
                <ChevronDownIcon size={15} strokeWidth={2.5} />
            </button>
        </div>
    );
}

/* ── Main component ─────────────────────────────────────────── */
export default function DateTimePicker({ value, onChange, locale }: Props) {
    const isBn = locale === "bn";

    const [datePart, timePart] = value.split(" ");
    const selectedDate =
        datePart && isValid(parse(datePart, "yyyy-MM-dd", new Date()))
            ? parse(datePart, "yyyy-MM-dd", new Date())
            : undefined;

    const [month, setMonth] = useState<Date>(selectedDate ?? new Date());

    const currentH = timePart ? parseInt(timePart.split(":")[0], 10) : OPEN_H;
    const currentM = timePart ? parseInt(timePart.split(":")[1], 10) : 0;

    function setTime(h: number, m: number) {
        const ymd = datePart ?? format(new Date(), "yyyy-MM-dd");
        onChange(`${ymd} ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }

    function pickDate(day: Date | undefined) {
        if (!day) return;
        const ymd = format(day, "yyyy-MM-dd");
        onChange(timePart ? `${ymd} ${timePart}` : `${ymd} ${String(OPEN_H).padStart(2,"0")}:00`);
    }

    const h12   = currentH % 12 || 12;
    const isPM  = currentH >= 12;
    const periodBn = currentH < 12 ? "সকাল" : currentH < 17 ? "বিকেল" : currentH < 20 ? "সন্ধ্যা" : "রাত";

    const incH = () => { if (currentH < CLOSE_H) setTime(currentH + 1, currentM); };
    const decH = () => { if (currentH > OPEN_H)  setTime(currentH - 1, currentM); };
    const incM = () => { const i = MINUTES.indexOf(currentM); if (i < MINUTES.length - 1) setTime(currentH, MINUTES[i + 1]); };
    const decM = () => { const i = MINUTES.indexOf(currentM); if (i > 0) setTime(currentH, MINUTES[i - 1]); };
    const togglePM = () => {
        if (isPM  && currentH - 12 >= OPEN_H)  setTime(currentH - 12, currentM);
        if (!isPM && currentH + 12 <= CLOSE_H) setTime(currentH + 12, currentM);
    };

    const today = new Date(); today.setHours(0, 0, 0, 0);

    /* shadcn-style classNames for DayPicker */
    const cal = {
        months:             "w-full",
        month:              "w-full flex flex-col gap-3",
        caption:            "flex justify-center relative items-center w-full py-1",
        caption_label:      "text-sm font-semibold text-[var(--color-ink)]",
        nav:                "flex items-center",
        nav_button: cn(
            "h-7 w-7 p-0 flex items-center justify-center rounded-md border border-[var(--color-earth-100)]",
            "text-[var(--color-ink)]/40 hover:bg-[var(--color-earth-100)] hover:text-[var(--color-ink)]",
            "transition-colors disabled:opacity-20 disabled:cursor-not-allowed",
        ),
        nav_button_previous:"absolute left-0",
        nav_button_next:    "absolute right-0",
        table:              "w-full border-collapse",
        head_row:           "w-full flex",
        head_cell:          "flex-1 text-center text-[11px] font-semibold text-[var(--color-ink)]/30 pb-2",
        row:                "w-full flex mt-1",
        cell:               "flex-1 p-0.5 text-center",
        day: cn(
            "w-full h-8 rounded-md text-sm font-normal",
            "flex items-center justify-center",
            "hover:bg-[var(--color-earth-100)] transition-colors cursor-pointer",
        ),
        day_selected:       "!bg-[var(--color-terracotta-500)] !text-white !font-semibold hover:!bg-[var(--color-terracotta-600)]",
        day_today:          "border border-[var(--color-terracotta-400)] text-[var(--color-terracotta-600)] font-semibold",
        day_outside:        "text-[var(--color-ink)]/20",
        day_disabled:       "!text-[var(--color-ink)]/15 !cursor-not-allowed hover:!bg-transparent",
        day_hidden:         "invisible",
    };

    const summaryDate = selectedDate ? format(selectedDate, "EEE, MMM d, yyyy") : null;
    const summaryTime = timePart
        ? isBn
            ? `${periodBn} ${h12}:${String(currentM).padStart(2, "0")}`
            : `${h12}:${String(currentM).padStart(2, "0")} ${isPM ? "PM" : "AM"}`
        : null;

    return (
        <div className="border border-[var(--color-earth-100)] overflow-hidden">

            {/* ── Summary strip ── */}
            <div className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
                summaryDate || summaryTime
                    ? "bg-[var(--color-terracotta-500)] text-white"
                    : "bg-[var(--color-earth-50)] text-[var(--color-ink)]/35",
            )}>
                <CalendarIcon size={14} strokeWidth={2} className="shrink-0" />
                <span>{summaryDate ?? (isBn ? "তারিখ বাছুন" : "Pick a date")}</span>
                {summaryDate && summaryTime && (
                    <>
                        <span className="opacity-40">·</span>
                        <ClockIcon size={13} strokeWidth={2} className="shrink-0" />
                        <span>{summaryTime}</span>
                    </>
                )}
                {summaryDate && !summaryTime && (
                    <>
                        <span className="opacity-40">·</span>
                        <span className="opacity-60 text-xs">{isBn ? "সময় বাছুন →" : "pick a time →"}</span>
                    </>
                )}
            </div>

            {/* ── Calendar + Dialler row ── */}
            <div className="flex flex-col sm:flex-row">

                {/* Calendar — fills all remaining width */}
                <div className="flex-1 p-4 bg-white">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={pickDate}
                        month={month}
                        onMonthChange={setMonth}
                        disabled={{ before: today }}
                        classNames={cal}
                        components={{
                            IconLeft:  () => <ChevronLeftIcon  size={13} strokeWidth={2.5} />,
                            IconRight: () => <ChevronRightIcon size={13} strokeWidth={2.5} />,
                        }}
                        showOutsideDays
                    />
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px bg-[var(--color-earth-100)]" />
                <div className="block sm:hidden h-px bg-[var(--color-earth-100)]" />

                {/* Time dialler — fixed width panel */}
                <div className="sm:w-44 flex flex-col items-center justify-center gap-4 p-5 bg-[var(--color-ink)]">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40">
                        {isBn ? "সময়" : "Time"}
                        <span className="ml-1.5 font-normal text-white/25">
                            {isBn ? "৭টা–১১টা" : "7am–11pm"}
                        </span>
                    </p>

                    <div className="flex items-center gap-2">
                        <Spinner
                            label={isBn ? "ঘণ্টা" : "Hour"}
                            display={String(h12).padStart(2, "0")}
                            onUp={incH} onDown={decH}
                            disableUp={currentH >= CLOSE_H}
                            disableDown={currentH <= OPEN_H}
                        />
                        <span className="font-display text-3xl font-bold text-white/25 mt-6 select-none">:</span>
                        <Spinner
                            label={isBn ? "মিনিট" : "Min"}
                            display={String(currentM).padStart(2, "0")}
                            onUp={incM} onDown={decM}
                            disableUp={MINUTES.indexOf(currentM) >= MINUTES.length - 1}
                            disableDown={MINUTES.indexOf(currentM) <= 0}
                        />
                    </div>

                    {/* AM / PM */}
                    <div className="flex gap-1.5 w-full">
                        {(["AM", "PM"] as const).map((p) => {
                            const active = p === "AM" ? !isPM : isPM;
                            return (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={togglePM}
                                    className={cn(
                                        "flex-1 py-1.5 text-[11px] font-bold rounded-md transition-colors",
                                        active
                                            ? "bg-[var(--color-terracotta-500)] text-white"
                                            : "bg-white/8 text-white/30 hover:bg-white/15 hover:text-white/60",
                                    )}
                                >
                                    {p === "AM"
                                        ? (isBn ? "সকাল" : "AM")
                                        : (isBn ? "রাত" : "PM")}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
