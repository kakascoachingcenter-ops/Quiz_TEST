/**
 * icons.js - Lucide Icons and Custom Subject SVGs for KCI
 * All icons strictly in Navy (#1e3a5f) and Gold (#f0b429) palette.
 */
const KCIIcons = {
    // Custom Navy/Gold Subject SVGs
    subjectMaths: `
        <svg viewBox="0 0 48 48" class="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="24" fill="#fef8eb"/>
            <circle cx="24" cy="24" r="23" stroke="#f0b429" stroke-width="1.5" stroke-dasharray="3 3"/>
            <!-- Plus Minus & Multiplication Math Motif -->
            <path d="M16 20H24M20 16V24" stroke="#1e3a5f" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M16 32H24" stroke="#1e3a5f" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M30 18L36 24M36 18L30 24" stroke="#f0b429" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="33" cy="30" r="1.5" fill="#1e3a5f"/>
            <circle cx="33" cy="34" r="1.5" fill="#1e3a5f"/>
            <path d="M29 32H37" stroke="#1e3a5f" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    subjectEnglish: `
        <svg viewBox="0 0 48 48" class="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="24" fill="#eaf1fb"/>
            <circle cx="24" cy="24" r="23" stroke="#1e3a5f" stroke-width="1.5" stroke-opacity="0.3"/>
            <!-- Open Book Motif -->
            <path d="M14 17C18 15 22 16.5 24 18V34C22 32.5 18 31 14 33V17Z" fill="#ffffff" stroke="#1e3a5f" stroke-width="2" stroke-linejoin="round"/>
            <path d="M34 17C30 15 26 16.5 24 18V34C26 32.5 30 31 34 33V17Z" fill="#ffffff" stroke="#1e3a5f" stroke-width="2" stroke-linejoin="round"/>
            <path d="M24 18V34" stroke="#f0b429" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M18 22H21M18 26H21" stroke="#f0b429" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M27 22H30M27 26H30" stroke="#f0b429" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
    `,
    subjectEVS: `
        <svg viewBox="0 0 48 48" class="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="24" fill="#f0f7f3"/>
            <circle cx="24" cy="24" r="23" stroke="#3f9b6a" stroke-width="1.5" stroke-opacity="0.3"/>
            <!-- Stylized Leaf Motif -->
            <path d="M16 33C17 25 21 17 33 15C33 27 25 31 17 33" fill="#3f9b6a" fill-opacity="0.15" stroke="#1e3a5f" stroke-width="2.2" stroke-linejoin="round"/>
            <path d="M16 33C21 28 26 23 33 15" stroke="#f0b429" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M22 27L25 29M26 23L29 25" stroke="#3f9b6a" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
    `,
    subjectIslamiat: `
        <svg viewBox="0 0 48 48" class="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="24" fill="#fef8eb"/>
            <circle cx="24" cy="24" r="23" stroke="#f0b429" stroke-width="1.5" stroke-opacity="0.5"/>
            <!-- Crescent + 8-Point Geometric Star (NO figures) -->
            <path d="M27 15C21.4772 15 17 19.4772 17 25C17 30.5228 21.4772 35 27 35C29.284 35 31.3917 34.2348 33.0769 32.9515C30.6559 32.4842 27.5 30.2 27.5 25C27.5 19.8 30.6559 17.5158 33.0769 17.0485C31.3917 15.7652 29.284 15 27 15Z" fill="#1e3a5f"/>
            <!-- 8-Point Islamic Star -->
            <path d="M31 22.5L32.2 23.8L34 23.8L32.8 25L33.3 26.8L31.7 26L30.1 26.8L30.6 25L29.4 23.8L31.2 23.8L31 22.5Z" fill="#f0b429"/>
        </svg>
    `,
    subjectUrdu: `
        <svg viewBox="0 0 48 48" class="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="24" fill="#eaf1fb"/>
            <circle cx="24" cy="24" r="23" stroke="#1e3a5f" stroke-width="1.5" stroke-opacity="0.3"/>
            <!-- Traditional Qalam / Pen Nib Motif -->
            <path d="M22 14L28 20L21 33L15 34L16 28L22 14Z" fill="#ffffff" stroke="#1e3a5f" stroke-width="2.2" stroke-linejoin="round"/>
            <path d="M15 34L19 30" stroke="#f0b429" stroke-width="2" stroke-linecap="round"/>
            <path d="M25 17L27 19" stroke="#f0b429" stroke-width="2" stroke-linecap="round"/>
            <circle cx="21" cy="27" r="1.5" fill="#1e3a5f"/>
            <path d="M29 27C31 28 34 29 34 32" stroke="#1e3a5f" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,

    // Lucide UI Chrome Icons (Navy/Gold style, stroke-based)
    folder: `
        <svg class="w-6 h-6 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
        </svg>
    `,
    bookOpen: `
        <svg class="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
    `,
    fileText: `
        <svg class="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <line x1="10" y1="9" x2="8" y2="9"/>
        </svg>
    `,
    sliders: `
        <svg class="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" x2="4" y1="21" y2="14"/>
            <line x1="4" x2="4" y1="10" y2="3"/>
            <line x1="12" x2="12" y1="21" y2="12"/>
            <line x1="12" x2="12" y1="8" y2="3"/>
            <line x1="20" x2="20" y1="21" y2="16"/>
            <line x1="20" x2="20" y1="12" y2="3"/>
            <line x1="1" x2="7" y1="14" y2="14"/>
            <line x1="9" x2="15" y1="8" y2="8"/>
            <line x1="17" x2="23" y1="16" y2="16"/>
        </svg>
    `,
    arrowLeft: `
        <svg class="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
        </svg>
    `,
    arrowRight: `
        <svg class="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
        </svg>
    `,
    check: `
        <svg class="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
    `,
    x: `
        <svg class="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    `,
    download: `
        <svg class="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
    `,
    rotateCw: `
        <svg class="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
    `,
    phone: `
        <svg class="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
    `,
    sparkle: `
        <svg class="w-5 h-5 inline-block text-gold" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z"/>
        </svg>
    `
};

if (typeof window !== 'undefined') {
    window.KCIIcons = KCIIcons;
}
