import FolderIcon from "@/components/FolderIcon";

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

      {/* ——— Your content ——— */}
      <div className="absolute top-1/20 right-8 flex flex-col gap-10 z-30">
        <FolderIcon text="AI News"     url="/ai-news" />
        <FolderIcon text="Internships" url="/internships" />
        <FolderIcon text="Hackathons"  url="/hackathons" />
      </div>
    </div>
  );
}
