import Image from "next/image"

export default function Hero() {
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <Image
        src="/placeholder.svg?height=400&width=1200"
        alt="School Building"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">School Name</h1>
          <p className="text-lg md:text-xl drop-shadow-md">Lost & Found Center</p>
        </div>
      </div>
    </div>
  )
}
