import { motion } from "framer-motion"

export function NuruSkeleton({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`bg-gray-200/40 rounded-xl ${className}`}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  )
}