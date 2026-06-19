"use client";

import { useState, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ClockIcon } from "lucide-react";

type Props = {
    value: string; // "YYYY-MM-DD HH:MM" or ""
    onChange: (value: string) => void;
    locale: string;
};

// Time slots: 7:00 AM – 11:00 PM every 30 min
const TIME_SLOTS: string[] = [];
for (let h = 7; h <= 23; h++) {
    TIME_SLOTS.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 23) TIME_SLOTS.push(`${String(h).padStart(2, "0")}:30`);
}

function formatTimeLabel(t: string, locale: string) {
    const [h, m] = t.split(":").map(Number);
    if (locale === "bn") {
        const period = h < 12 ? "সকাল" : h < 17 ? "বিকেল" : "রাত";
        const hour12 = h % 12 || 12;
        return `${period} ${hour12}:${String(m).padStart(2, "0")}`;
    }
    const period = h < 12 ? "AM" : "PM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_BN = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
const DAYS_EN = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const DAYS_BN = ["র","সো","ম","বু","বৃ","শু","শ"];

function toYMD(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function DateTimePicker({ value, onChange, locale }: Props) {
    const isBn = locale === "bn";

    const [selectedDate, selectedTime] = value.split(" ");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const initYear = selectedDate ? Number(selectedDate.split("-")[0]) : today.getFullYear();
    const initMonth = selectedDate ? Number(selectedDate.split("-")[1]) - 1 : today.getMonth();

    const [viewYear, setViewYear] = useState(initYear);
    const [viewMonth, setViewMonth] = useState(initMonth);

    const prevMonth = useCallback(() => {
        setViewMonth((m) => { if (m === 0) { setViewYear((y) => y - 1); return 11; } return m - 1; });
    }, []);
    const nextMonth = useCallback(() => {
        setViewMonth((m) => { if (m === 11) { setViewYear((y) => y + 1); return 0; } return m + 1; });
    }, []);

    function pickDate(ymd: string) {
        onChange(selectedTime ? `${ymd} ${selectedTime}` : ymd);
    }
    function pickTime(t: string) {
        onChange(selectedDate ? `${selectedDate} ${t}` : t);
    }

    // Build calendar grid
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const monthNames = isBn ? MONTHS_BN : MONTHS_EN;
    const dayNames = isBn ? DAYS_BN : DAYS_EN;

    const todayYMD = toYMD(today);

    // Display summary
    let summary = "";
    if (selectedDate && selectedTime) {
        const d = new Date(selectedDate + "T" + selectedTime);
        const dateStr = isBn
            ? `${d.getDate()} ${MONTHS_BN[d.getMonth()]} ${d.getFullYear()}`
            : `${MONTHS_EN[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        summary = `${dateStr} · ${formatTimeLabel(selectedTime, locale)}`;
    } else if (selectedDate) {
        const d = new Date(selectedDate + "T00:00:00");
        summary = isBn
            ? `${d.getDate()} ${MONTHS_BN[d.getMonth()]} ${d.getFullYear()} — সময় বাছুন`
            : `${MONTHS_EN[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} — pick a time`;
    } else if (selectedTime) {
        summary = (isBn ? "তারিখ বাছুন — " : "Pick a date — ") + formatTimeLabel(selectedTime, locale);
    }

    return (
        <div className="border border-[var(--color-earth-100)] bg-white overflow-hidden">
            {/* Summary strip */}
            {summary && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-terracotta-500)] text-white">
                    <CalendarIcon size={13} strokeWidth={2} />
                    <span className="text-[12px] font-semibold">{summary}</span>
                </div>
            )}

            {/* Calendar */}
            <div className="p-4 border-b border-[var(--color-earth-100)]">
                {/* Month nav */}
                <div className="flex items-center justify-between mb-3">
                    <button
                        type="button"
                        onClick={prevMonth}
                        className="w-7 h-7 flex items-center justify-center text-[var(--color-ink)]/40 hover:text-[var(--color-ink)] hover:bg-[var(--color-earth-100)] rounded transition-colors"
                    >
                        <ChevronLeftIcon size={14} strokeWidth={2.5} />
                    </button>
                    <p className="text-sm font-semibold text-[var(--color-ink)]">
                        {monthNames[viewMonth]} {viewYear}
                    </p>
                    <button
                        type="button"
                        onClick={nextMonth}
                        className="w-7 h-7 flex items-center justify-center text-[var(--color-ink)]/40 hover:text-[var(--color-ink)] hover:bg-[var(--color-earth-100)] rounded transition-colors"
                    >
                        <ChevronRightIcon size={14} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-1">
                    {dayNames.map((d) => (
                        <div key={d} className="text-center text-[10px] font-semibold text-[var(--color-ink)]/30 py-1">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Date cells */}
                <div className="grid grid-cols-7 gap-y-0.5">
                    {cells.map((day, i) => {
                        if (!day) return <div key={`e-${i}`} />;
                        const ymd = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const isPast = ymd < todayYMD;
                        const isToday = ymd === todayYMD;
                        const isSelected = ymd === selectedDate;
                        return (
                            <button
                                key={ymd}
                                type="button"
                                disabled={isPast}
                                onClick={() => pickDate(ymd)}
                                className={`
                                    h-8 w-full flex items-center justify-center text-sm rounded transition-colors
                                    ${isPast ? "text-[var(--color-ink)]/15 cursor-not-allowed" : ""}
                                    ${isSelected
                                        ? "bg-[var(--color-terracotta-500)] text-white font-semibold"
                                        : isToday
                                        ? "border border-[var(--color-terracotta-400)] text-[var(--color-terracotta-600)] font-semibold"
                                        : !isPast
                                        ? "text-[var(--color-ink)]/70 hover:bg-[var(--color-earth-100)]"
                                        : ""}
                                `}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time slots */}
            <div className="p-4">
                <div className="flex items-center gap-1.5 mb-3">
                    <ClockIcon size={12} strokeWidth={2} className="text-[var(--color-ink)]/40" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink)]/40">
                        {isBn ? "সময় বাছুন" : "Select time"}
                    </p>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                    {TIME_SLOTS.map((t) => {
                        const isSelected = t === selectedTime;
                        return (
                            <button
                                key={t}
                                type="button"
                                onClick={() => pickTime(t)}
                                className={`
                                    py-1.5 text-[11px] font-medium rounded transition-colors text-center
                                    ${isSelected
                                        ? "bg-[var(--color-terracotta-500)] text-white"
                                        : "bg-[var(--color-earth-50)] text-[var(--color-ink)]/60 hover:bg-[var(--color-earth-100)] hover:text-[var(--color-ink)]"
                                    }
                                `}
                            >
                                {formatTimeLabel(t, locale)}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
