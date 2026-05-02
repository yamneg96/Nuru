import { motion } from "framer-motion"

export default function NuruLoader({
  message = "Preparing something safe for you...",
}: {
  message?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <motion.div
        className="relative h-16 w-16 rounded-full bg-blue-500/20"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-500/40 blur-xl"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <motion.p
        className="text-sm text-muted-foreground text-center max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {message}
      </motion.p>
    </div>
  )
}