import Image from "next/image"

export default function Logo({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={32}
      height={32}
      onError={(e) => {
        // Fallback to a default placeholder if image fails
        e.currentTarget.src = "/placeholder.svg"
      }}
    />
  )
}
