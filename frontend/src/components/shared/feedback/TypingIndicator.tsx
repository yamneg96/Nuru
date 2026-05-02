import { motion } from "framer-motion"

export function TypingIndicator() {
  return (
    <div className="flex gap-1 px-3 py-2 bg-muted rounded-xl w-fit">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 bg-blue-500 rounded-full"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}