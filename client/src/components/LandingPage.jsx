import React, { useState } from "react";

const LandingPage = ({ onStart }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #020617 100%)",
        color: "#ffffff",
        fontFamily: "'Inter', system-ui, sans-serif",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Background Ambience */}
      <div
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 50% 10%, rgba(74, 222, 128, 0.1) 0%, transparent 60%)",
        }}
      />

      {/* Main Container */}
      <main
        style={{
          zIndex: 1,
          maxWidth: "1200px",
          width: "100%",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "120px",
          paddingBottom: "80px",
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "80px",
            maxWidth: "800px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: "rgba(74, 222, 128, 0.1)",
              border: "1px solid rgba(74, 222, 128, 0.2)",
              borderRadius: "100px",
              color: "#4ade80",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "24px",
              letterSpacing: "1px",
            }}
          >
            AI-BUFFERED 3D JWT VISUALIZER
          </div>

          <h1
            style={{
              fontSize: "64px",
              fontWeight: "800",
              lineHeight: "1.1",
              margin: "0 0 24px 0",
              background: "linear-gradient(to right, #ffffff, #94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-2px",
            }}
          >
            Visualize the invisible. <br />
            <span style={{ color: "#4ade80", WebkitTextFillColor: "#4ade80" }}>
              Master auth flows in 60s.
            </span>
          </h1>

          <p
            style={{
              fontSize: "20px",
              lineHeight: "1.6",
              color: "#94a3b8",
              margin: "0 0 40px 0",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Forget static diagrams. Experience authentication as a cinematic,
            narrated 3D journey.
          </p>

          <button
            onClick={onStart}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: hovered ? "#22c55e" : "#4ade80",
              color: "#000000",
              border: "none",
              padding: "16px 48px",
              fontSize: "18px",
              fontWeight: "700",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: hovered
                ? "0 0 40px rgba(74, 222, 128, 0.4)"
                : "0 0 0 rgba(74, 222, 128, 0)",
              transform: hovered ? "translateY(-2px)" : "translateY(0)",
            }}
          >
            Launch Interactive Demo
          </button>
        </div>

        {/* Problem / Solution Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            width: "100%",
            marginBottom: "80px",
          }}
        >
          {/* The Problem */}
          <div
            style={{
              padding: "40px",
              background: "rgba(30, 41, 59, 0.4)",
              border: "1px solid rgba(148, 163, 184, 0.1)",
              borderRadius: "24px",
              backdropFilter: "blur(10px)",
            }}
          >
            <h3
              style={{
                fontSize: "24px",
                marginBottom: "16px",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "20px" }}>⚠</span> The Problem
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: "1.6" }}>
              Traditional learning relies on static diagrams and abstract
              documentation. Developers often struggle to visualize the precise
              sequence of events in authentication flows, leading to security
              vulnerabilities and implementation errors.
            </p>
          </div>

          {/* The Solution */}
          <div
            style={{
              padding: "40px",
              background: "rgba(30, 41, 59, 0.4)",
              border: "1px solid rgba(74, 222, 128, 0.2)",
              borderRadius: "24px",
              backdropFilter: "blur(10px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100px",
                height: "100px",
                background:
                  "radial-gradient(circle at top right, rgba(74, 222, 128, 0.2), transparent 70%)",
              }}
            />
            <h3
              style={{
                fontSize: "24px",
                marginBottom: "16px",
                color: "#4ade80",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "20px" }}>✨</span> The Solution
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: "1.6" }}>
              We replace abstract concepts with a tangible, cinematic reality.
              Watch credentials physically travel, guided by real-time AI
              narration and dynamic camera work that focuses your attention
              exactly where it matters.
            </p>
          </div>
        </div>

        {/* Features List */}
        <div style={{ width: "100%", marginBottom: "80px" }}>
          <h2
            style={{
              fontSize: "32px",
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            Core Architecture
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
            }}
          >
            {[
              {
                title: "Interactive 3D Engine",
                desc: "Built with React Three Fiber for high-performance graphics.",
              },
              {
                title: "Event-Driven Orchestration",
                desc: "Tightly coupled state management ensures synced visuals.",
              },
              {
                title: "Real-Time Synthesis",
                desc: "TTS integration delivers concise technical explanations.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "24px",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(148, 163, 184, 0.1)",
                  borderRadius: "16px",
                }}
              >
                <h4
                  style={{
                    color: "#e2e8f0",
                    fontSize: "18px",
                    marginBottom: "8px",
                  }}
                >
                  {item.title}
                </h4>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          width: "100%",
          padding: "24px",
          textAlign: "center",
          borderTop: "1px solid rgba(148, 163, 184, 0.1)",
          color: "#64748b",
          fontSize: "14px",
          background: "rgba(2, 6, 23, 0.5)",
        }}
      >
        <p>
          Forget reading about headers. <strong>Watch them happen.</strong>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
