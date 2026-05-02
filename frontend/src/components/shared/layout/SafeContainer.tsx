export function SafeContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="max-w-xl mx-auto px-4 py-6">{children}</div>
}