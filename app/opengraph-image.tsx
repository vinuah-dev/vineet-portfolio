import { ImageResponse } from "next/og";

export const alt = "Vineet Rohit Shah: AI & Full-stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#08080a",
          color: "#ededeb",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#a3a3a0", letterSpacing: 3 }}>
          <span>COMPUTER SCIENCE × AI × SOFTWARE</span>
          <span style={{ color: "#ff6b35" }}>NAGPUR, IN</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 112, fontWeight: 700, letterSpacing: -5, lineHeight: 0.95 }}>
          <span>Software that sees,</span>
          <span>
            listens &amp;&nbsp;<span style={{ color: "#ff6b35" }}>thinks.</span>
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28 }}>
          <span>Vineet Rohit Shah</span>
          <span style={{ color: "#a3a3a0" }}>AI · Computer Vision · Full-stack</span>
        </div>
      </div>
    ),
    size,
  );
}
