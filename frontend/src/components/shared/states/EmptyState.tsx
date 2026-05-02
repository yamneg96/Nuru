import { motion } from "framer-motion"

export function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center py-16 px-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="h-14 w-14 rounded-full bg-blue-100 mb-4" />

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="text-sm text-muted-foreground mt-2 max-w-xs">
        {description}
      </p>
    </motion.div>
  )
}