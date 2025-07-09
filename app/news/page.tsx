import { Suspense } from "react"
import Hero from "@/components/hero"
import NewsSection from "@/components/news-section"

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">ข่าวสาร</h1>
          <h2 className="text-3xl font-bold text-yellow-600">Satri Angthong</h2>
          <p className="text-blue-600 mt-4 text-lg">ติดตามข่าวสารและประกาศต่างๆ</p>
        </div>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <NewsSection />
        </Suspense>
      </main>
    </div>
  )
}
