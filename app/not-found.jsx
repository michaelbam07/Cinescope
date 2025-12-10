import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-background) text-(--color-foreground)">
      <div className="max-w-xl text-center p-8 bg-(--color-card) rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-(--color-muted-foreground) mb-6">We couldn't find the page you were looking for.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="px-4 py-2 rounded-md bg-(--color-primary) text-(--color-primary-foreground) font-semibold">Home</Link>
          <Link href="/movies" className="px-4 py-2 rounded-md bg-(--color-muted) text-(--color-foreground)">Browse Movies</Link>
        </div>
      </div>
    </div>
  )
}
