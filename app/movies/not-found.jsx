import Link from "next/link"

export default function MoviesNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-background) text-(--color-foreground)">
      <div className="max-w-lg text-center p-8 bg-(--color-card) rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-3">Movie Not Found</h2>
        <p className="text-(--color-muted-foreground) mb-6">The movie you're looking for doesn't exist or may have been removed.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/movies" className="px-4 py-2 rounded-md bg-(--color-primary) text-(--color-primary-foreground) font-semibold">Browse Movies</Link>
          <Link href="/" className="px-4 py-2 rounded-md bg-(--color-muted) text-(--color-foreground)">Home</Link>
        </div>
      </div>
    </div>
  )
}
