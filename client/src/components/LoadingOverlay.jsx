import { useState, useEffect } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence

const phrases = [
  "Scanning ocean surface temperature...",
  "Analyzing tidal patterns...",
  "Collecting plankton data...",
  "Mapping seafloor topography...",
  "Calibrating sonar signals...",
  "Running deep-sea simulations...",
];

const LoadingOverlay = ({ duration = 15000, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = 100; // progress update every 100ms
    const increment = (100 / (duration / interval));

    // progress timer
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(progressTimer);
          clearInterval(phraseTimer); // Clear phrase timer as well
          if (onComplete) onComplete();
          return 100;
        }
        return next;
      });
    }, interval);

    // phrase timer: change phrase every 2.5s
    const phraseTimer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2500);

    return () => {
      clearInterval(progressTimer);
      clearInterval(phraseTimer);
    };
  }, [duration, onComplete]);

  // Variant for the phrase animation
  const phraseVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }} // Increased duration for a smoother overall fade
    >
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: "rgba(0,0,0,0.9)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000,
          px: 4,
        }}
      >
        <AnimatePresence mode="wait"> {/* Use AnimatePresence to animate phrases in/out */}
          <motion.div
            key={phraseIndex} // Key changes to trigger exit/enter animation
            variants={phraseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }} // Animation duration for phrase change
          >
            <Typography variant="h6" sx={{ color: "#fff", mb: 2, textAlign: "center" }}>
              {phrases[phraseIndex]}
            </Typography>
          </motion.div>
        </AnimatePresence>

        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <LinearProgress
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: "#333",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#00bcd4",
              },
            }}
            variant="determinate"
            value={progress}
          />
        </Box>
      </Box>
    </motion.div>
  );
};

export default LoadingOverlay;