// GoogleIcon.tsx
import React from "react";

export const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#EA4335"
      d="M12 10.2v3.6h5.09c-.22 1.2-.87 2.21-1.86 2.88l3 2.33c1.76-1.62 2.77-4 2.77-6.87 0-.59-.06-1.16-.17-1.7H12Z"
    />
    <path
      fill="#34A853"
      d="M6.54 13.6a5.99 5.99 0 0 1 0-3.2L3.46 8.07a9.977 9.977 0 0 0 0 7.86l3.08-2.33Z"
    />
    <path
      fill="#FBBC05"
      d="M12 5.34c1.27 0 2.41.44 3.31 1.31l2.48-2.48C16.41 2.68 14.33 2 12 2 8.69 2 5.78 3.92 3.46 6.93l3.08 2.33A5.98 5.98 0 0 1 12 5.34Z"
    />
    <path
      fill="#4285F4"
      d="M12 22c2.33 0 4.41-.77 6.05-2.09l-3-2.33c-.83.57-1.9.92-3.05.92-2.54 0-4.68-1.72-5.45-4.07l-3.08 2.33C5.78 20.08 8.69 22 12 22Z"
    />
  </svg>
);
