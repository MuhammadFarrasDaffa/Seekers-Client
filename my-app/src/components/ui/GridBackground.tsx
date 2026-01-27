export default function GridBackground({ color }: { color?: string }) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Base background - clean white/light gray */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />

      {/* Centered gradient blob - pink/purple radial gradient */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Main radial gradient - centered */}
        <div
          className="absolute w-[800px] h-[600px]"
          style={{
            background: `
              radial-gradient(ellipse at center, 
                rgba(251, 207, 232, 0.6) 0%,
                rgba(244, 184, 228, 0.5) 15%,
                rgba(221, 170, 232, 0.4) 30%,
                rgba(196, 181, 253, 0.3) 45%,
                rgba(216, 180, 254, 0.2) 60%,
                transparent 80%
              )
            `,
          }}
        />

        {/* Secondary softer glow for depth */}
        <div
          className="absolute w-[1000px] h-[700px]"
          style={{
            background: `
              radial-gradient(ellipse at center, 
                rgba(253, 242, 248, 0.8) 0%,
                rgba(250, 232, 255, 0.4) 30%,
                transparent 70%
              )
            `,
          }}
        />
      </div>

      {/* Vertical lines grid - centered with fade effect */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="absolute w-[900px] h-[600px]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(219, 188, 249, 0.35) 1px, transparent 1px)
            `,
            backgroundSize: "50px 100%",
            maskImage: `
              radial-gradient(ellipse at center, 
                rgba(0,0,0,1) 0%, 
                rgba(0,0,0,0.6) 40%,
                rgba(0,0,0,0) 70%
              )
            `,
            WebkitMaskImage: `
              radial-gradient(ellipse at center, 
                rgba(0,0,0,1) 0%, 
                rgba(0,0,0,0.6) 40%,
                rgba(0,0,0,0) 70%
              )
            `,
          }}
        />
      </div>

      {/* Subtle noise texture for depth */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
