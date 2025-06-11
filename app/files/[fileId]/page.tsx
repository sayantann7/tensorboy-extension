"use client";
import Link from "next/link";
import parse from "html-react-parser";

export default function Home() {
  const htmlContent = `
<div style="margin: 20px 0; padding: 20px; border-radius: 8px;">
  <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">Hey there, fellow code-crazy humans,

Welcome to the very first issue of <span style="font-weight: bold;">Tensor Protocol</span>, the newsletter where we demystify AI, dig into the <span style="font-weight: bold;">latest hackathons, spotlight juicy internship opportunities, and share mind-bending tech insights</span>—all with the kind of sarcastic edge you’ve come to expect from yours truly, <span style="font-weight: bold;">Tensorboy.</span></h3>
  <p style="margin: 0; color: #666; line-height: 1.6;"></p>
</div>

<div style="margin: 20px 0; padding: 20px; border-radius: 8px; border-left: 4px solid #b8460e;">
  <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">Why the delay?</h3>
  <p style="margin: 0; color: #333; line-height: 1.6;">Let’s be real: I had grand plans to launch Tensor Protocol ages ago. I got sidetracked debugging a rogue neural net at 3 AM, binge-watching Kaggle kernels, and—truth be told—procrastinating on that launch button. But hey, good things come to those who wait, and this inaugural edition is gonna be worth the extra minute (or two… or ten…)</p>
</div>

<span style="font-weight: bold; color: #333; font-size: 18px;">But now I am back.</span>

<br>
<br>

<div style="margin: 20px 0; padding: 20px; border-radius: 8px; border-left: 4px solid #b8460e;">
  <span style="font-weight: bold; color: #333; font-size: 16px;">so what are we going to do in Tensor Protocol?</span>
  <p style="margin: 0; color: #333; line-height: 1.6;">Every issue delivers bite-sized AI/ML explainers, insider hackathon tips, hand-picked internship leads, code-packed toolbox goodies, and a spotlight on our community’s best projects—all wrapped in Tensorboy’s trademark sarcasm.</p>

<li style="margin: 0; color: #333; line-height: 1.6;"><span style="font-weight: bold;">AI & ML Deep Dives:</span> Quick model breakdowns + “Tensorboy Tips” for max GPU gains</li>
<li style="margin: 0; color: #333; line-height: 1.6;"><span style="font-weight: bold;">Hackathon Hacks:</span> Can’t-miss events, winner post-mortems & pitch advice
</li>
<li style="margin: 0; color: #333; line-height: 1.6;"><span style="font-weight: bold;">Internship Intel:</span> Top AI lab openings + application dos & don’ts</li>
<li style="margin: 0; color: #333; line-height: 1.6;"><span style="font-weight: bold;">Toolbox Treasures:</span> Snippets, open-source finds, extensions & “Red Pill” cheat-sheets</li>
<li style="margin: 0; color: #333; line-height: 1.6;"><span style="font-weight: bold;">Community Corner:</span> Shout-outs to standout projects & your questions answered</li>
</div>

<span style="font-weight: bold; color: #333; font-size: 18px;">Thanks for hopping aboard the Protocol. Buckle up—this ride’s about to get wild.</span>
<br>
<span style=" color: #333; font-size: 18px;">Catch you in issue #2 (which, admittedly, will be on schedule 😉),</span>

<br>
<br>

<span style=" color: #333; font-size: 14px; font-weight: bold;">Still not subscribed? or want to Share with your friends?</span>

<br>

<a href="https://tensorboy.com" target="_blank" rel="noopener noreferrer" style="margin-top=10px;">
  <button style="
    background: #b8460e;
    color: #fff;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  "
  onmouseover="this.style.background='#a03c0c';"
  onmouseout="this.style.background='#b8460e';">
    Visit Here
  </button>
</a>
`;

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      {/* Fixed Background Layers */}
      <div className="fixed inset-0 z-0">
        <div
          className="
            absolute inset-0
            bg-[url('/background.png')]
            bg-cover bg-center bg-no-repeat
            filter grayscale-[50%] brightness-65 contrast-100
          "
        />
        <div className="absolute inset-0 bg-black/30" />
        <video
          src="/bg-video.mp4"
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover opacity-3"
        />
      </div>

      {/* Scrollable Content */}
      <div className="absolute top-1/20 left-8 flex flex-col gap-2 z-30">
        <Link href="/"><h1 className="text-white text-4xl pixelated-font mb-8">{'<-'} Go Back</h1></Link>
      </div>
      <div className="relative z-10 max-w-3xl mx-auto py-16 px-8 space-y-8">

        <div className="bg-white/60 pixelated-font backdrop-blur-sm border border-white/20 p-8 rounded-lg text-gray-100 leading-relaxed space-y-4">
          {parse(htmlContent)}
        </div>
      </div>
    </div>
  );
}
