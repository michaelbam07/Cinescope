import { notFound } from "next/navigation"
import { movies } from "@/data/movie"
import MovieDetailClient from "./MovieDetailClient"

export default async function MovieDetailPage({ params }) {
  const { id } = await params
  const movieId = Number(id)
  const movie = movies.find((m) => Number(m.id) === movieId)

  if (!movie) {
    notFound()
  }

  return <MovieDetailClient movie={movie} />
}
