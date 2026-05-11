import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  }
};

export const cinematicReveal: Variants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.5, ease: [0.25, 1, 0.5, 1] }
  }
};

export const softFloat: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
    }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const imageDepthReveal: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.8, ease: "easeOut" }
  }
};
