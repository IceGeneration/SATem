import { Suspense } from "react"
import Hero from "@/components/hero"
import LostFoundTable from "@/components/lost-found-table"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">Welcome To</h1>
          <h2 className="text-5xl font-bold text-yellow-600">แหล่งของหาย</h2>
          <p className="text-blue-600 mt-4 text-lg">มาตามหาของหายไปด้วยกัน !!!</p>
        </div>
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-12">
              <div className="text-center text-blue-600">กำลังโหลด...</div>
            </div>
          }
        >
          <LostFoundTable />
        </Suspense>
      </div>
    </div>
  )
}
