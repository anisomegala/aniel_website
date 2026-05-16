import React, { useState } from 'react';
import { useRouter } from 'next/router';

const flags = { en: '🇺🇸', es: '🇪🇸', pt: '🇧🇷', pl: '🇵🇱' };

export default function GlobeIcon() {
    const router = useRouter();
    const { locale, locales, pathname, asPath } = router;
    const [isOpen, setIsOpen] = useState(false);

    if (!locales) return null;

    const handleLanguageChange = (newLocale) => {
        router.push(pathname, asPath, { locale: newLocale });
        setIsOpen(false);
    };

    return (
        <div
            className="relative flex flex-col items-center z-50"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                aria-label="Select language"
                aria-expanded={isOpen}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-dark/5 dark:bg-light/10 hover:bg-primary/10 transition-colors border border-dark/10 dark:border-light/10"
            >
                <span className="text-xl" aria-hidden="true">{flags[locale] || '🌐'}</span>
            </button>

            <div className={`
                absolute top-full mt-1 w-32 bg-light/95 dark:bg-dark/95
                backdrop-blur-md rounded-xl shadow-xl border border-dark/10 dark:border-light/10
                transition-all duration-200 flex flex-col overflow-hidden
                ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible pointer-events-none'}
            `}>
                {locales.map((l) => (
                    <button
                        key={l}
                        onClick={() => handleLanguageChange(l)}
                        className={`
                            w-full px-4 py-2.5 flex items-center justify-between text-sm font-bold transition-colors
                            hover:bg-primary/10
                            ${locale === l ? 'text-primary' : 'text-dark dark:text-light'}
                        `}
                    >
                        <span className="uppercase">{l}</span>
                        <span>{flags[l]}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
