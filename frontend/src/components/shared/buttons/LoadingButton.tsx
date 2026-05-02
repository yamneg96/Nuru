import { motion } from "framer-motion"

export function LoadingButton({
  loading,
  children,
  className = "",
  ...props
}: any) {
  return (
    <button
      {...props}
      disabled={loading}
      className={`relative flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-60 ${className}`}
    >
      {loading && (
        <motion.div
          className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      )}

      <span>{children}</span>
    </button>
  )
}