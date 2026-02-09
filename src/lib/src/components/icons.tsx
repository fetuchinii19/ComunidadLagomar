import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 17a5 5 0 0 0-5-5h10a5 5 0 0 0-5 5z" />
      <path d="M12 7V5" />
      <path d="M5.22 8.22l1.42 1.42" />
      <path d="M18.78 8.22l-1.42 1.42" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  ),
  menu: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  ),
};