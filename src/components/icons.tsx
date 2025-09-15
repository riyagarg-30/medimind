import React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9.5 7.5c.5-2 2.34-3.5 4.5-3.5s4 1.5 4.5 3.5" />
    <path d="M14 19.5c-2.16 0-4-1.5-4.5-3.5" />
    <path d="M9.5 16.5c-.5 2-2.34 3.5-4.5 3.5S1 20 .5 18" />
    <path d="M14 4.5c2.16 0 4 1.5 4.5 3.5" />
    <path d="M4.5 11.5c0-2.16 1.5-4 3.5-4.5" />
    <path d="M19.5 12.5c0 2.16-1.5 4-3.5 4.5" />
    <path d="M12 12a2.5 2.5 0 0 1-2.5-2.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5A2.5 2.5 0 0 1 12 12Z" />
  </svg>
);
