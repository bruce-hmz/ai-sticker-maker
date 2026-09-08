import { ImageResponse } from "next/og";

export const alt = "StickerSit - Free AI WhatsApp Sticker Maker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#7c3aed",
          backgroundImage: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #7c3aed 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 64, marginRight: 16 }}>🌸</span>
          <span style={{ fontSize: 64, marginRight: 16 }}>🎮</span>
          <span style={{ fontSize: 64, marginRight: 16 }}>✨</span>
          <span style={{ fontSize: 64 }}>🎀</span>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            marginBottom: 16,
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          Free AI WhatsApp Sticker Maker
        </div>
        <div
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.85)",
            marginBottom: 32,
          }}
        >
          No App &middot; No Sign Up &middot; Just Type &amp; Create
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <span>💬 WhatsApp</span>
          <span>✈️ Telegram</span>
          <span>🍎 iMessage</span>
          <span>🎮 Discord</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
