import Image from "next/image"

export default function Hero() {
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <Image
        src="/images/hero-background.jpeg"
        alt="Decorative floral background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">Satri Angthong</h1>
          <p className="text-lg md:text-xl drop-shadow-md">ศูนย์รวมของหาย</p>
        </div>
      </div>
    </div>
  )
}
