export function formatChatTime(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();

    // --- Extract UTC date components ---
    const dateUTC = {
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
    };

    const nowUTC = {
        day: now.getUTCDate(),
        month: now.getUTCMonth(),
        year: now.getUTCFullYear(),
    };

    // --- Calculate day difference in UTC ---
    const oneDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.floor((now.getTime() - date.getTime()) / oneDay);

    // --- CHECK: Today (UTC) ---
    const isToday =
        dateUTC.day === nowUTC.day &&
        dateUTC.month === nowUTC.month &&
        dateUTC.year === nowUTC.year;

    if (isToday) {
        // 24-hour UTC time
        return date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "UTC",
        });
    }

    // --- CHECK: Yesterday (UTC) ---
    const yesterdayUTC = new Date(now.toISOString()); // clone
    yesterdayUTC.setUTCDate(nowUTC.day - 1);

    const isYesterday =
        dateUTC.day === yesterdayUTC.getUTCDate() &&
        dateUTC.month === yesterdayUTC.getUTCMonth() &&
        dateUTC.year === yesterdayUTC.getUTCFullYear();

    if (isYesterday) {
        return "Yesterday";
    }

    // --- CHECK: Same week (UTC), but not today/yesterday ---
    if (diffDays < 7) {
        return date.toLocaleDateString("en-GB", {
            weekday: "short",
            timeZone: "UTC",
        });
    }

    // --- OLDER: DD-MM-YYYY (UTC) ---
    const dd = String(dateUTC.day).padStart(2, "0");
    const mm = String(dateUTC.month + 1).padStart(2, "0");
    const yyyy = dateUTC.year;

    return `${dd}-${mm}-${yyyy}`;
}