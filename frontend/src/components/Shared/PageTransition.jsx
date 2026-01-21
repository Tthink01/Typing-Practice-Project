import React from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

const pageVariants = {
  initial: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
  }),
  animate: {
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }, 
  },
  exit: (direction) => ({
    x: direction < 0 ? "100%" : "-100%",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const PageTransition = ({ children, direction = 0 }) => {
  return (
    <motion.div
      custom={direction}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute top-0 left-0 w-full h-full min-h-screen bg-[#0a0a0a] overflow-hidden shadow-2xl"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;