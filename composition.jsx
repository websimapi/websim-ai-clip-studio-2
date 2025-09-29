import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, OffthreadVideo, Audio } from "remotion";
function Words({ text, seed }) {
  const words = text.trim().split(/\s+/).slice(0, 80);
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const total = Math.max(1, words.length);
  const per = Math.floor(durationInFrames / total);
  return /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxWidth: 640 }, children: words.map((w, i) => {
    const appear = i * per;
    const v = spring({ fps, frame: frame - appear, config: { damping: 200 } });
    const y = interpolate(v, [0, 1], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const op = interpolate(v, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return /* @__PURE__ */ jsxDEV("span", { style: { transform: `translateY(${y}px)`, opacity: op, fontSize: 32, fontWeight: 800, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,.5)" }, children: w }, i, false, {
      fileName: "<stdin>",
      lineNumber: 20,
      columnNumber: 11
    }, this);
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 13,
    columnNumber: 5
  }, this);
}
const MyClip = ({ title, text, audioUrl, bgUrl, bgType, seed = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleIn = spring({ fps, frame, config: { damping: 200 } });
  const titleY = interpolate(titleIn, [0, 1], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const overlay = interpolate(frame, [0, 10, 20], [0.5, 0.35, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: [
    /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "#000" }, children: bgUrl ? bgType === "video" ? /* @__PURE__ */ jsxDEV(OffthreadVideo, { src: bgUrl, style: { width: "100%", height: "100%", objectFit: "cover" } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 41,
      columnNumber: 13
    }) : /* @__PURE__ */ jsxDEV(Img, { src: bgUrl, style: { width: "100%", height: "100%", objectFit: "cover" } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 43,
      columnNumber: 13
    }) : null }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 38,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { background: `rgba(0,0,0,${overlay})` } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 48,
      columnNumber: 7
    }),
    audioUrl ? /* @__PURE__ */ jsxDEV(Audio, { src: audioUrl }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 50,
      columnNumber: 19
    }) : null,
    /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { justifyContent: "center", alignItems: "center", padding: 32 }, children: [
      /* @__PURE__ */ jsxDEV("div", { style: { position: "absolute", top: 24, left: 24, right: 24, textAlign: "center", color: "#fff", opacity: 0.9, transform: `translateY(${titleY}px)` }, children: /* @__PURE__ */ jsxDEV("div", { style: { fontSize: 18, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }, children: title }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 54,
        columnNumber: 11
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 53,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(Words, { text: text || "", seed }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 56,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 52,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 37,
    columnNumber: 5
  });
};
export {
  MyClip
};
