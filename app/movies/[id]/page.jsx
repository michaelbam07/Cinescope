import { notFound } from "next/navigation"
import { movies } from "@/data/movie"
import MovieDetailClient from "./MovieDetailClient"

/**
 * GENERATE DYNAMIC METADATA
 * This makes the movie look professional when shared on social media.
 */
export async function generateMetadata({ params }) {
  const { id } = await params
  const movie = movies.find((m) => Number(m.id) === Number(id))

  if (!movie) return { title: "Movie Not Found | CineScope" }

  return {
    title: `${movie.title} (${movie.dateReleased}) | CineScope`,
    description: movie.epilogue,
    openGraph: {
      title: movie.title,
      description: movie.epilogue,
      images: [
        {
          url: movie.poster,
          width: 1200,
          height: 630,
          alt: movie.title,
        },
      ],
    },
  }
}

/**
 * STATIC PARAMS GENERATION
 * This "pre-builds" all movie pages at build time for instant loading.
 */
export async function generateStaticParams() {
  return movies.map((movie) => ({
    id: movie.id.toString(),
  }))
}

export default async function MovieDetailPage({ params }) {
  const { id } = await params
  const movie = movies.find((m) => Number(m.id) === Number(id))

  if (!movie) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      {/* We pass the movie data to the Client Component 
         which handles all the cinematic animations.
      */}
      <MovieDetailClient movie={movie} />
    </main>
  )
}