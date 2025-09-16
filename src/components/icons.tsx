import { motion } from 'framer-motion';
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
    <motion.path
      d="M9.5 7.5c.5-2 2.34-3.5 4.5-3.5s4 1.5 4.5 3.5"
      initial={{ pathLength: 0, pathOffset: 1 }}
      animate={{ pathLength: 1, pathOffset: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    />
    <motion.path
      d="M14 19.5c-2.16 0-4-1.5-4.5-3.5"
      initial={{ pathLength: 0, pathOffset: 1 }}
      animate={{ pathLength: 1, pathOffset: 0 }}
      transition={{ duration: 1, ease: 'easeInOut', delay: 0.2 }}
    />
    <motion.path
      d="M9.5 16.5c-.5 2-2.34 3.5-4.5 3.5S1 20 .5 18"
      initial={{ pathLength: 0, pathOffset: 1 }}
      animate={{ pathLength: 1, pathOffset: 0 }}
      transition={{ duration: 1, ease: 'easeInOut', delay: 0.4 }}
    />
    <motion.path
      d="M14 4.5c2.16 0 4 1.5 4.5 3.5"
      initial={{ pathLength: 0, pathOffset: 1 }}
      animate={{ pathLength: 1, pathOffset: 0 }}
      transition={{ duration: 1, ease: 'easeInOut', delay: 0.6 }}
    />
    <motion.path
      d="M4.5 11.5c0-2.16 1.5-4 3.5-4.5"
      initial={{ pathLength: 0, pathOffset: 1 }}
      animate={{ pathLength: 1, pathOffset: 0 }}
      transition={{ duration: 1, ease: 'easeInOut', delay: 0.8 }}
    />
    <motion.path
      d="M19.5 12.5c0 2.16-1.5 4-3.5 4.5"
      initial={{ pathLength: 0, pathOffset: 1 }}
      animate={{ pathLength: 1, pathOffset: 0 }}
      transition={{ duration: 1, ease: 'easeInOut', delay: 1 }}
    />
    <motion.path
      d="M12 12a2.5 2.5 0 0 1-2.5-2.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5A2.5 2.5 0 0 1 12 12Z"
      initial={{ pathLength: 0, pathOffset: 1 }}
      animate={{ pathLength: 1, pathOffset: 0 }}
      transition={{ duration: 1, ease: 'easeInOut', delay: 1.2 }}
    />
  </svg>
);
