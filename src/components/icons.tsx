import { motion } from 'framer-motion';
import React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  const outerCircleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1, ease: 'easeInOut' },
    },
  };

  const innerPathVariants = {
    hidden: { pathLength: 0, pathOffset: 1, opacity: 0 },
    visible: {
      pathLength: 1,
      pathOffset: 0,
      opacity: 1,
      transition: { duration: 1, ease: 'easeInOut' },
    },
  };
  
  const centerDotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 260, damping: 20, delay: 1.5 },
    },
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Outer rotating circle */}
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        strokeDasharray="4 4"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        variants={outerCircleVariants}
      />
      
      {/* Central static circle */}
      <motion.circle
        cx="12"
        cy="12"
        r="2.5"
        strokeWidth="1"
        variants={innerPathVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1 }}
      />
      
      {/* The "S" shapes */}
      <motion.path
        d="M9.5 7.5c.5-2 2.34-3.5 4.5-3.5s4 1.5 4.5 3.5"
        variants={innerPathVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      />
      <motion.path
        d="M14 19.5c-2.16 0-4-1.5-4.5-3.5"
        variants={innerPathVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      />
      <motion.path
        d="M9.5 16.5c-.5 2-2.34 3.5-4.5 3.5S1 20 .5 18"
        variants={innerPathVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
      />
      <motion.path
        d="M14 4.5c2.16 0 4 1.5 4.5 3.5"
        variants={innerPathVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
      />

      {/* The connecting lines */}
       <motion.path
        d="M4.5 11.5c0-2.16 1.5-4 3.5-4.5"
        variants={innerPathVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.0 }}
      />
      <motion.path
        d="M19.5 12.5c0 2.16-1.5 4-3.5 4.5"
        variants={innerPathVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.2 }}
      />
      
       {/* Central dot that pops in */}
      <motion.circle
        cx="12"
        cy="12"
        r="1"
        fill="currentColor"
        variants={centerDotVariants}
        initial="hidden"
        animate="visible"
      />
    </svg>
  );
};
