import { useState, useEffect, useRef, useMemo } from "react";
import DisclaimerModal from "./DisclaimerModal.jsx";
import html2canvas from "html2canvas";

import StandImage from "./assets/images/stand.webp";
import SideEyeImage from "./assets/images/side_eye.webp";

import fontMap from "./assets/fonts/font-map.json";
import kerning from "./assets/fonts/kerning.json";

export default function App() {
  const [text, setText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [autocaps, setAutocaps] = useState(true);
  const [background, setBackground] = useState("bg-white");

  const screenRef = useRef(null);
  const [screenDimensions, setScreenDimensions] = useState(0);

  const [screenAspect, setScreenAspect] = useState("4:3");

  const casedText = useMemo(() => {
    return autocaps ? [...text.toUpperCase()] : [...text];
  }, [text, autocaps]);

  const charCount = useMemo(
    () => casedText.filter((ch) => !!fontMap[ch]).length,
    [casedText, fontMap]
  );

  const letterImages = import.meta.glob(
    "/src/assets/images/*.webp",
    { eager: true, import: "default" }
  );

  const screenBackgrounds = [
    "bg-white",
    "bg-red-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-slate-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-orange-200",
    "bg-teal-200",
  ];

  const handleTextInput = (e) => setText(e.target.value);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const factor = 0.8;
      const aspect = screenAspect === "4:3" ? 4 / 3 : 16 / 9;

      let height = window.innerHeight * 0.8;
      let width = height * aspect;

      if (width > window.innerWidth * factor) {
        if (window.innerWidth < 768) {
          width = window.innerWidth * 0.7;
        } else {
          width = window.innerWidth * 0.5;
        }
        height = width / aspect;
      }

      setScreenDimensions({ width, height });
    };

    handleResize(); // run once on mount

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [screenAspect]);

  function toggleScreenAspect() {
    setScreenAspect(screenAspect == "4:3" ? "16:9" : "4:3");
  };

  function cubicBezier(p0, p1, p2, p3, t) {
    const cX = 3 * p0;
    const bX = 3 * (p2 - p1) - cX;
    const aX = 1 - cX - bX;
    return aX * t ** 3 + bX * t ** 2 + cX * t;
  }

  function easeOut(t) {
    return cubicBezier(0.33, 1, 0.68, 1, t);
  }

  function computeUnitHeight(parentHeight, charCount) {
    const min = parentHeight * 0.1;
    const max = parentHeight * 0.3;

    const t = Math.max(0, Math.min(1, -charCount / 10 + 1)); // normalized input
    const eased = easeOut(t);

    return min + (max - min) * eased;
  }

  const downloadScreen = async () => {
    if (!screenRef.current) return;

    const el = screenRef.current;

    // Save original inline styles
    const original = {
      border: el.style.border,
      borderRadius: el.style.borderRadius,
      boxShadow: el.style.boxShadow,
    };

    // Temporarily remove problematic styles
    el.style.border = "none";
    el.style.borderRadius = "0";
    el.style.boxShadow = "none";

    // Wait a tick so layout updates
    await new Promise((r) => requestAnimationFrame(r));

    // Capture
    const canvas = await html2canvas(el);

    // Restore original styles
    el.style.border = original.border;
    el.style.borderRadius = original.borderRadius;
    el.style.boxShadow = original.boxShadow;

    // Save
    const link = document.createElement("a");
    link.download = "yas_kween.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      {/* Top: 1/5 height */}
      <div className="h-1/6 flex items-center justify-center px-8">
        <h1
          style={{
            fontFamily: "Rouge Script",
            textShadow: "-2px 4px 1px rgba(0,0,0,0.20)",
            color: "rgba(8, 1, 20, 1)",
          }}
          className="text-5xl md:text-7xl font-bold"
        >
          Kween Yasmin Font Maker!
        </h1>

        <img
          src={SideEyeImage}
          alt="Kween Yasmin looking away"
          className="w-24 md:w-35 self-start"
        />
      </div>

      {/* bottom of page / main body */}
      <div className="h-5/6 flex flex-col md:flex-row justify-evenly pb-8 gap-4">

        {/* background picker */}
        <div className="hidden md:block text-base rounded-lg border border-gray-300
          shadow-sm w-80 h-full resize-none">
          {/* Title (fixed at top of this card) */}
          <div className="p-3 border-b border-gray-100 bg-gray-200 shadow-inner">
            <h3 className="text-base font-medium">Choose background</h3>
            <p className="text-sm text-gray-500">Pick any of the free images below:</p>
          </div>

          <div className="px-4 py-2 overflow-y-auto overflow-x-hidden h-[calc(100%-64px)]">
            <h3 className="text-base font-medium pb-2">Colors</h3>
            <ul className="grid grid-cols-2 gap-2 pb-4">
              {screenBackgrounds.map((bg, i) => (
                <li
                  key={i}
                  onClick={() => setBackground(bg)}
                  className={`
                  aspect-4/3
                  ${bg}
                  rounded-xl
                  shadow-inner
                  cursor-pointer
                  transition
                  outline-1
                  ${background === bg ? "outline-blue-400 outline-offset-2" : "outline-transparent outline-offset-0"}
                `}
                ></li>
              ))}
            </ul>
          </div>

        </div>

        {/* main canvas */}
        <div
          ref={screenRef}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: ".75rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            height: screenDimensions.height,
            width: screenDimensions.width,
          }}
          className={`
            ${background}
            overflow-hidden
            flex items-center justify-center
            shrink-0
            md:self-start
            self-center
          `}
        >
          {/* glyphs */}
          <div className="
            whitespace-pre-wrap text-center
          ">
            {casedText.length === 0 ? (
              <p className="text-gray-400 text-lg">Your stylized text will show here...</p>
            ) : (
              casedText.map((c, i) => {
                const key = fontMap[c]?.filename;

                if (c === '\n') {
                  return <br key={i} />;
                }
                const imageUrl = letterImages[key];

                const parentHeight = screenDimensions.height;
                const unitHeight = computeUnitHeight(parentHeight, charCount);

                if (!imageUrl) {
                  return (
                    <div
                      key={i}
                      style={{ width: `${unitHeight * .5}px` }}
                      className="inline-block"
                    />
                  );
                }

                const height = unitHeight * fontMap[c]?.height || 5;
                const dy = unitHeight * fontMap[c]?.distance || 0;

                const b = casedText[i - 1];
                let dx = 0;
                if (i != 0 && kerning[b] && kerning[b][c]) {
                  dx = -kerning[b][c] * unitHeight * 0.9;
                  console.log(dx);
                }

                return (
                  <img
                    key={i}
                    src={imageUrl}
                    alt={c}
                    style={{
                      height: `${height}px`,
                      translate: `0px ${dy}px`,
                      marginLeft: `${dx}px`,
                    }}
                    className={`inline-block my-2 align-bottom`}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* input */}
        <div className="flex flex-col gap-4 items-center">
          <div className="relative w-80">
            <textarea
              value={text}
              onChange={handleTextInput}
              placeholder="Yasminify your text here! 🌸"
              className="
                px-4 py-2 text-base rounded-lg border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-pink-300
                bg-linear-to-b from-white to-gray-100
                shadow-sm w-full h-40 resize-none z-10
              "
              autoFocus
            />

            {/* Autocaps checkbox */}
            <label className="
                absolute bottom-2 right-2 flex items-center
                gap-1 text-xs mb-1 text-gray-500"
              style={{
                fontFamily: "Consolas",
              }}
            >
              {autocaps ? "AUTOCAPS" : "autocaps"}
              <input
                type="checkbox"
                checked={autocaps}
                onChange={(e) => setAutocaps(e.target.checked)}
                className="w-4 h-4 rounded border-gray-400"
              />
            </label>
          </div>


          <div className="flex gap-2 self-center md:self-start">
            <button
              onClick={downloadScreen}
              className="
                px-5 py-2 rounded-lg text-white bg-pink-400
                hover:bg-pink-500 active:bg-pink-600
                transition shadow-md
              "
            >
              Download Image
            </button>

            <button
              onClick={toggleScreenAspect}
              className="
                px-5 py-2 rounded-lg text-white bg-purple-950
                hover:bg-purple-900 active:bg-purple-800
                transition shadow-md
              "
            >
              {screenAspect}
            </button>
          </div>
        </div>
      </div>

      {/* footer */}
      <div
        className="
        absolute bottom-2 right-2 text-gray-500 
        text-xs cursor-pointer hover:underline
      "
        onClick={() => setModalOpen(true)}
      >
        what's this about?
      </div>

      <DisclaimerModal isOpen={modalOpen} onClose={handleModalClose} />
    </div>
  );
}
