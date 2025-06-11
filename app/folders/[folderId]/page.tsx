import FileIcon from "@/components/FileIcon";
import Link from "next/link";


export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      
      {/* ——— Background image layer ——— */}
      <div
        className="
          absolute inset-0
          bg-[url('/background.png')]
          bg-cover bg-center bg-no-repeat

          /* only this layer is B/W + darker + more contrast */
          filter grayscale-[50%] brightness-65 contrast-100

          z-0
        "
      />

      {/* ——— Optional tint on top of the image ——— */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* ——— Video layer (untouched by the image filter) ——— */}
      <video
        src="/bg-video.mp4"
        autoPlay
        loop
        muted
        className="
          absolute inset-0
          w-full h-full object-cover
          z-20
          opacity-3
        "
      />

      {/* ——— Folders ——— */}
      <div className="absolute top-1/20 right-8 flex flex-col gap-10 z-30">
        <FileIcon text="ai news"     url="http://localhost:3000/files/ai-news" />
        <FileIcon text="internships" url="http://localhost:3000/files/internships" />
        <FileIcon text="hackathons"  url="http://localhost:3000/files/hackathons" />
      </div>

      {/* ——— Intro Text ——— */}
      <div className="absolute top-1/20 left-8 flex flex-col gap-2 z-30">
        <Link href="/"><h1 className="text-white text-4xl pixelated-font mb-8">{'<-'} Go Back</h1></Link>
        <h1 className="text-white text-xl pixelated-font">welcome to the world of ai news</h1>
        <h1 className="text-white text-xl pixelated-font">a place to increase your knowledge</h1>
      </div>

      {/* ——— Timer ——— */}
      <div className="absolute top-[200px] left-155 flex flex-col gap-0 z-30">
        <h1 className="text-white text-[140px] pixelated-font p-0">38<span className="text-[40px]">.552677</span></h1>
        <h1 className="text-white text-[30px] pixelated-font">days till the next drop</h1>
      </div>
    </div>
  );
}
