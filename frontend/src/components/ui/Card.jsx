import { motion } from "framer-motion";
import { cn } from "../../utils/helpers";

export function Card({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn("glass-panel rounded-3xl p-5", className)}
    >
      {children}
    </motion.div>
  );
}
