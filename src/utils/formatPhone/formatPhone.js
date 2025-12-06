export function formatPhoneNumber(rawPhone = "") {
    if (!rawPhone) return "";

    // Remove all non-digit chars just in case
    const digits = rawPhone.replace(/\D/g, "");

    // If length < 4, it's invalid or incomplete
    if (digits.length < 4) return `+${digits}`;

    // For most countries:
    // First 1–3 digits → country code
    // Rest → actual phone number

    // India, USA, UK, etc. auto-detect by length
    let countryCode = "";
    let number = "";

    if (digits.length === 12) {
        // Ex: 919876543210 → CC=91, num=9876543210
        countryCode = digits.slice(0, 2);
        number = digits.slice(2);
    } else if (digits.length === 11) {
        // Ex: 19876543210 → CC=1, num=9876543210
        countryCode = digits.slice(0, 1);
        number = digits.slice(1);
    } else if (digits.length === 10) {
        // Default India-style 10-digit number, prepend +91
        countryCode = "91";
        number = digits;
    } else {
        // Fallback for other weird formats
        countryCode = digits.slice(0, digits.length - 10);
        number = digits.slice(-10);
    }

    return `+${countryCode}-${number}`;
}
