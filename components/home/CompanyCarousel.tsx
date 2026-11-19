import * as React from 'react';

interface CompanyProfile {
  id: string;
  name: string;
  logo: React.ReactNode;
}

const COMPANIES: CompanyProfile[] = [
  {
    id: 'google',
    name: 'Google',
    logo: (
      <div className="flex items-center gap-2.5">
        <svg className="size-6 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.27 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
          />
        </svg>
        <span className="text-[17px] font-semibold tracking-tight text-[#1c1c1e] dark:text-white">
          Google
        </span>
      </div>
    ),
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: (
      <div className="flex items-center gap-2.5">
        <svg className="size-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="1" y="1" width="10" height="10" fill="#F25022" />
          <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
          <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
          <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
        </svg>
        <span className="text-[17px] font-semibold tracking-tight text-[#1c1c1e] dark:text-white">
          Microsoft
        </span>
      </div>
    ),
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: (
      <div className="flex flex-col items-center leading-none pt-0.5">
        <span className="text-[18px] font-bold tracking-tight text-[#1c1c1e] dark:text-white">
          amazon
        </span>
        <svg className="w-16 h-3 -mt-0.5 shrink-0" viewBox="0 0 80 14" fill="none" aria-hidden="true">
          <path
            d="M4 3.5C19 11.5 46 12.2 68 4.2"
            stroke="#FF9900"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M64.5 1.8L70.5 3.6L67.8 9.2"
            stroke="#FF9900"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logo: (
      <div className="flex items-center gap-2">
        <svg className="size-6 shrink-0" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect width="28" height="28" rx="6" fill="#635BFF" />
          <path
            d="M13.2 11.3c0-.9.75-1.25 1.98-1.25 1.77 0 4 .54 5.77 1.5V6.68c-1.93-.77-3.84-1.08-5.77-1.08-4.72 0-7.86 2.46-7.86 6.58 0 6.42 8.84 5.4 8.84 8.17 0 1.07-.93 1.42-2.22 1.42-1.92 0-4.38-.79-6.33-1.86v4.94c2.15.93 4.33 1.32 6.33 1.32 4.84 0 8.16-2.39 8.16-6.56-.02-6.93-8.9-5.7-8.9-8.31z"
            fill="#ffffff"
          />
        </svg>
        <span className="text-[18px] font-bold tracking-tight text-[#635BFF] dark:text-[#8d87ff]">
          stripe
        </span>
      </div>
    ),
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    logo: (
      <div className="flex items-center gap-2">
        <svg className="size-6 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M16 3.5c-2.2 0-3.8 1.5-5.3 4.4-1.8 3.5-4.3 8.9-5.2 11.6-.9 2.7.2 6.2 3.1 7.6 2.4 1.1 5.1.3 7.4-2.1 2.3 2.4 5 3.2 7.4 2.1 2.9-1.4 4-4.9 3.1-7.6-.9-2.7-3.4-8.1-5.2-11.6C19.8 5 18.2 3.5 16 3.5zm0 16.3c-1.5-1.8-2.4-3.7-2.4-5.1 0-1.4 1.1-2.5 2.4-2.5s2.4 1.1 2.4 2.5c0 1.4-.9 3.3-2.4 5.1z"
            stroke="#FF5A5F"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[17px] font-bold tracking-tight text-[#FF5A5F]">
          airbnb
        </span>
      </div>
    ),
  },
  {
    id: 'spotify',
    name: 'Spotify',
    logo: (
      <div className="flex items-center gap-2.5">
        <svg className="size-6 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#1ED760" />
          <path
            d="M6.8 9.4c3.4-1 8.9-.8 12.1 1.1M7.6 12.6c2.8-.8 7.3-.6 10 .9M8.4 15.6c2.2-.6 5.6-.4 7.7.7"
            fill="none"
            stroke="#121212"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-[17px] font-bold tracking-tight text-[#1c1c1e] dark:text-white">
          Spotify
        </span>
      </div>
    ),
  },
  {
    id: 'shopify',
    name: 'Shopify',
    logo: (
      <div className="flex items-center gap-2">
        <svg className="size-6 shrink-0" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path
            d="M21.4 7.3c-.03-.2-.21-.31-.36-.32-.15-.01-3.1-.06-3.1-.06s-2.48-2.4-2.74-2.66c-.26-.26-.77-.18-.97-.12-.02.01-.45.14-1.15.36-.69-1.97-1.91-3.78-4.05-3.78h-.19C8.26.2 7.54.01 6.95.01c-2.66 0-3.93 3.33-4.33 5.02-.99.31-1.7.53-1.79.56-.56.17-.57.19-.64.72C.12 6.72-.5 23.6-.5 23.6L16.3 26.8l9.1-1.98S21.43 7.5 21.4 7.3z"
            transform="translate(2 0.8) scale(0.92)"
            fill="#95BF47"
          />
          <path
            d="M17.2 7.2c-.15-.01-3.1-.06-3.1-.06s-2.48-2.4-2.74-2.66c-.1-.1-.22-.15-.36-.17v22.5l9.1-1.98S17.57 7.42 17.54 7.22c-.03-.2-.19-.01-.34-.02z"
            transform="translate(2 0.8) scale(0.92)"
            fill="#5E8E3E"
          />
          <path
            d="M13.2 12.1c-.4-.2-.9-.32-1.45-.32-1.14 0-1.58.65-1.58 1.15 0 .74.96 1.07 1.72 1.48 1.14.61 1.72 1.38 1.72 2.5 0 1.72-1.31 2.81-3.18 2.81-.96 0-1.88-.28-2.45-.68l.42-1.4c.56.34 1.31.59 1.98.59.79 0 1.24-.38 1.24-.95 0-.62-.45-.94-1.52-1.47-1.14-.56-1.89-1.3-1.89-2.52 0-1.61 1.24-2.77 3.17-2.77.82 0 1.54.18 2.02.42l-.2 1.16z"
            fill="#ffffff"
          />
        </svg>
        <span className="text-[17px] font-bold tracking-tight text-[#1c1c1e] dark:text-white">
          shopify
        </span>
      </div>
    ),
  },
];

export const CompanyCarousel: React.FC = () => {
  const renderCompanyCard = (company: CompanyProfile, copyIndex: number) => {
    const isDuplicate = copyIndex === 1;

    return (
      <div
        key={`${company.id}-${copyIndex}`}
        aria-hidden={isDuplicate ? true : undefined}
        data-company-id={company.id}
        data-marquee-copy={copyIndex}
        className="group relative mx-2.5 flex items-center justify-center h-[68px] min-w-[172px] px-6 rounded-2xl border border-[#e0e2e8] dark:border-[#2c2c34] bg-white/85 dark:bg-[#1c1c20] hover:bg-white dark:hover:bg-[#24242b] hover:border-[#c7cad5] dark:hover:border-[#42424e] hover:-translate-y-0.5 transition-all duration-200 shrink-0"
      >
        <div className="transition-transform duration-200 group-hover:scale-[1.04]">
          {company.logo}
        </div>
      </div>
    );
  };

  return (
    <div className="pt-8 border-t border-[#e0e2e8] dark:border-[#2c2c34]">
      <p className="text-xs uppercase tracking-widest font-semibold text-[#6b6f7e] dark:text-[#a5a8b5] text-center mb-6">
        Empowering candidates interviewing at leading companies worldwide
      </p>

      {/* Infinite Smooth Dual-Track Marquee */}
      <div
        className="company-marquee-viewport py-2"
        role="region"
        aria-label="Leading hiring companies carousel"
      >
        <div
          className="company-marquee-track"
          style={{ '--marquee-duration': '26s' } as React.CSSProperties}
        >
          <div className="flex items-center shrink-0">
            {COMPANIES.map((company) => renderCompanyCard(company, 0))}
          </div>
          <div className="flex items-center shrink-0" aria-hidden="true">
            {COMPANIES.map((company) => renderCompanyCard(company, 1))}
          </div>
        </div>
      </div>
    </div>
  );
};
