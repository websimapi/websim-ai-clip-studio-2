import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Player } from "@websim/remotion/player";
import { MyClip } from "./composition.jsx";
const room = new WebsimSocket();
const defaultVoice = "en-male";
function App() {
  const [tab, setTab] = useState("create");
  const [mode, setMode] = useState("tts");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [voice, setVoice] = useState(defaultVoice);
  const [bgUrl, setBgUrl] = useState("");
  const [bgType, setBgType] = useState("image");
  const [genPrompt, setGenPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioSec, setAudioSec] = useState(6);
  const [previewSeed, setPreviewSeed] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const clips = React.useSyncExternalStore(
    room.collection("clip_v1").subscribe,
    room.collection("clip_v1").getList
  );
  useEffect(() => {
    if (!title) setTitle("Untitled Clip");
  }, [title]);
  async function computeAudioDuration(fileOrUrl) {
    try {
      const { Input, ALL_FORMATS, UrlSource } = await import("mediabunny");
      const source = typeof fileOrUrl === "string" ? new UrlSource(fileOrUrl) : fileOrUrl;
      const input = new Input({ source, formats: ALL_FORMATS });
      const seconds = await input.computeDuration();
      return Math.max(1, Math.round(seconds));
    } catch {
      return 6;
    }
  }
  async function handleTTS() {
    if (!text.trim()) return;
    setGenerating(true);
    try {
      const res = await websim.textToSpeech({ text, voice });
      setAudioUrl(res.url);
      const sec = await computeAudioDuration(res.url);
      setAudioSec(sec);
    } finally {
      setGenerating(false);
    }
  }
  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      try {
        const file = new File([blob], "mic.webm", { type: "audio/webm" });
        const url = await websim.upload(file);
        setAudioUrl(url);
        const sec = await computeAudioDuration(url);
        setAudioSec(sec);
      } catch (e) {
        console.error(e);
      }
    };
    mr.start();
    setIsRecording(true);
  }
  function stopRecording() {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") {
      mr.stop();
      mr.stream.getTracks().forEach((t) => t.stop());
    }
    setIsRecording(false);
  }
  async function handleBgUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const isVideo = f.type.startsWith("video/");
    const url = await websim.upload(f);
    setBgUrl(url);
    setBgType(isVideo ? "video" : "image");
  }
  async function handleBgGenerate() {
    if (!genPrompt.trim()) return;
    setGenerating(true);
    try {
      const result = await websim.imageGen({
        prompt: genPrompt,
        aspect_ratio: "1:1"
      });
      setBgUrl(result.url);
      setBgType("image");
    } finally {
      setGenerating(false);
    }
  }
  function canSave() {
    return Boolean(audioUrl && bgUrl && text.trim());
  }
  async function saveClip() {
    if (!canSave()) return;
    const record = await room.collection("clip_v1").create({
      title: title || "Untitled Clip",
      mode,
      text,
      voice,
      audio_url: audioUrl,
      bg_url: bgUrl,
      bg_type: bgType,
      duration_s: audioSec,
      seed: previewSeed
    });
    setTab("gallery");
    window.history.replaceState({}, "", `${window.baseUrl}?recordType=clip_v1&recordId=${record.id}`);
  }
  const currentProps = useMemo(
    () => ({
      title: title || "Untitled Clip",
      text,
      audioUrl,
      bgUrl,
      bgType,
      seed: previewSeed
    }),
    [title, text, audioUrl, bgUrl, bgType, previewSeed]
  );
  return /* @__PURE__ */ jsxDEV("div", { className: "app", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "header", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "brand", children: "AI Clip Studio" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 154,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "tabs", children: [
        /* @__PURE__ */ jsxDEV("button", { className: `tab ${tab === "create" ? "active" : ""}`, onClick: () => setTab("create"), children: "Create" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 156,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: `tab ${tab === "gallery" ? "active" : ""}`, onClick: () => setTab("gallery"), children: "Gallery" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 157,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 155,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 153,
      columnNumber: 7
    }, this),
    tab === "create" && /* @__PURE__ */ jsxDEV("div", { className: "panel", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "section", children: [
        /* @__PURE__ */ jsxDEV("h3", { children: "Clip Setup" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 164,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "row", children: /* @__PURE__ */ jsxDEV("input", { className: "input", placeholder: "Title", value: title, onChange: (e) => setTitle(e.target.value) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 166,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 165,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "row", style: { marginTop: 8 }, children: /* @__PURE__ */ jsxDEV("textarea", { rows: "3", className: "input", placeholder: "What should be said?", value: text, onChange: (e) => setText(e.target.value) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 169,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 168,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "hr" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 172,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "row", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "badge", children: "Audio" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 174,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "row", style: { gap: 6 }, children: [
            /* @__PURE__ */ jsxDEV("button", { className: `button ${mode === "tts" ? "primary" : ""}`, onClick: () => setMode("tts"), children: "Use TTS" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 176,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("button", { className: `button ${mode === "mic" ? "primary" : ""}`, onClick: () => setMode("mic"), children: "Use Mic" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 177,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 175,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 173,
          columnNumber: 13
        }, this),
        mode === "tts" && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV("div", { className: "row", style: { marginTop: 8 }, children: [
            /* @__PURE__ */ jsxDEV("select", { className: "select", value: voice, onChange: (e) => setVoice(e.target.value), children: [
              /* @__PURE__ */ jsxDEV("option", { value: "en-male", children: "English Male" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 185,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "en-female", children: "English Female" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 186,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "es-male", children: "Spanish Male" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 187,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "fr-female", children: "French Female" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 188,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "de-male", children: "German Male" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 189,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 184,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("button", { className: "button primary", onClick: handleTTS, disabled: generating || !text.trim(), children: generating ? "Generating..." : "Generate TTS" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 191,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 183,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "small", children: [
            "Duration: ~",
            audioSec,
            "s"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 195,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 182,
          columnNumber: 15
        }, this),
        mode === "mic" && /* @__PURE__ */ jsxDEV("div", { className: "row", style: { marginTop: 8 }, children: [
          !isRecording ? /* @__PURE__ */ jsxDEV("button", { className: "button primary", onClick: startRecording, children: [
            /* @__PURE__ */ jsxDEV("span", { className: "kbd", children: "\u25CF" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 202,
              columnNumber: 79
            }, this),
            " Start Recording"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 202,
            columnNumber: 19
          }, this) : /* @__PURE__ */ jsxDEV("button", { className: "button", onClick: stopRecording, children: "Stop" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 204,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "help", children: "Tip: Keep it under 20 seconds for best results." }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 206,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 200,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "hr" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 210,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "row", children: /* @__PURE__ */ jsxDEV("span", { className: "badge", children: "Background" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 212,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 211,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "row", style: { marginTop: 8 }, children: /* @__PURE__ */ jsxDEV("input", { className: "input", type: "file", accept: "image/*,video/*", onChange: handleBgUpload }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 215,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 214,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "row", style: { marginTop: 8 }, children: [
          /* @__PURE__ */ jsxDEV("input", { className: "input", placeholder: "Or generate an image\u2026 e.g. 'Moody neon city at night'", value: genPrompt, onChange: (e) => setGenPrompt(e.target.value) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 218,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("button", { className: "button ghost", onClick: handleBgGenerate, disabled: generating || !genPrompt.trim(), children: generating ? "Generating..." : "Generate" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 219,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 217,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "hr" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 224,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "row split", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "row", style: { gap: 8 }, children: [
            /* @__PURE__ */ jsxDEV("span", { className: "badge", children: "Seed" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 227,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("input", { className: "input", style: { width: 96 }, type: "number", min: "1", max: "9999", value: previewSeed, onChange: (e) => setPreviewSeed(parseInt(e.target.value || "1", 10)) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 228,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 226,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("button", { className: "button primary", onClick: saveClip, disabled: !canSave(), children: "Save to Gallery" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 230,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 225,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 163,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "section", children: [
        /* @__PURE__ */ jsxDEV("h3", { children: "Preview" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 237,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "playerBox", children: /* @__PURE__ */ jsxDEV(
          Player,
          {
            component: MyClip,
            durationInFrames: Math.max(90, audioSec * 30),
            fps: 30,
            compositionWidth: 720,
            compositionHeight: 720,
            loop: true,
            controls: true,
            inputProps: currentProps,
            style: { width: "100%", height: "100%" }
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 239,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 238,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "row", style: { marginTop: 10 }, children: [
          /* @__PURE__ */ jsxDEV("div", { className: "progress", style: { flex: 1 }, children: /* @__PURE__ */ jsxDEV("span", { style: { width: audioUrl ? "100%" : "0%" } }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 253,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 252,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "small", style: { marginLeft: 8 }, children: audioUrl ? "Audio ready" : "Awaiting audio\u2026" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 255,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 251,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 236,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 162,
      columnNumber: 9
    }, this),
    tab === "gallery" && /* @__PURE__ */ jsxDEV("div", { className: "section", children: [
      /* @__PURE__ */ jsxDEV("h3", { children: "Gallery" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 263,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid", children: clips.map((c) => /* @__PURE__ */ jsxDEV(ClipCard, { clip: c }, c.id, false, {
        fileName: "<stdin>",
        lineNumber: 266,
        columnNumber: 15
      }, this)) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 264,
        columnNumber: 11
      }, this),
      clips.length === 0 && /* @__PURE__ */ jsxDEV("div", { className: "small", style: { marginTop: 8 }, children: "No clips yet. Create one!" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 269,
        columnNumber: 34
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 262,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 152,
    columnNumber: 5
  }, this);
}
function ClipCard({ clip }) {
  const shareUrl = `${window.baseUrl}?recordType=clip_v1&recordId=${clip.id}`;
  return /* @__PURE__ */ jsxDEV("div", { className: "card", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "thumb", children: /* @__PURE__ */ jsxDEV(MiniPlayer, { clip }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 281,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 280,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "row split", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("div", { style: { fontWeight: 600, fontSize: 14 }, children: clip.title }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 285,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "small", children: [
          clip.mode.toUpperCase(),
          " \u2022 ",
          clip.duration_s || 6,
          "s"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 286,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 284,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("img", { src: `https://images.websim.com/avatar/${clip.username}`, alt: "", width: "28", height: "28", style: { borderRadius: 999 } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 288,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 283,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "row", style: { gap: 8 }, children: [
      /* @__PURE__ */ jsxDEV("a", { className: "button ghost", href: shareUrl, children: "Open" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 291,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "button", onClick: () => navigator.clipboard.writeText(shareUrl), children: "Copy Link" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 292,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 290,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 279,
    columnNumber: 5
  }, this);
}
function MiniPlayer({ clip }) {
  return /* @__PURE__ */ jsxDEV(
    Player,
    {
      component: MyClip,
      durationInFrames: Math.max(90, (clip.duration_s || 6) * 30),
      fps: 30,
      compositionWidth: 400,
      compositionHeight: 400,
      loop: true,
      inputProps: {
        title: clip.title,
        text: clip.text,
        audioUrl: clip.audio_url,
        bgUrl: clip.bg_url,
        bgType: clip.bg_type,
        seed: clip.seed || 1
      },
      style: { width: "100%", height: "100%" }
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 300,
      columnNumber: 5
    },
    this
  );
}
export {
  App
};
