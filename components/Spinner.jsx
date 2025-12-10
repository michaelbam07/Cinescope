"use client"

export default function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-(--color-muted-foreground) border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </div>
  )
}
