import { useState, useEffect, useRef } from "react";
import DisclaimerModal from "./DisclaimerModal.jsx";
import html2canvas from "html2canvas";

import StandImage from "./assets/images/stand.webp";
import SideEyeImage from "./assets/images/side_eye.webp";

import letterMetrics from "./assets/fonts/letterMetrics.json";

export default function App() {
  const [text, setText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [autocaps, setAutocaps] = useState(true);

  const screenRef = useRef(null);
  const [screenDimensions, setScreenDimensions] = useState(0);

  const [screenAspect, setScreenAspect] = useState("4:3");

  const letterImages = import.meta.glob(
    "/src/assets/images/*.webp",
    { eager: true, import: "default" }
  );

  const handleChange = (e) => setText(e.target.value);

  const handleClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (!screenRef.current) return;
    const el = screenRef.current;

    const observer = new ResizeObserver(() => {
      const factor = screenAspect == "4:3" ? 4/3 : 16/9;
      const height = el.offsetHeight;
      const width = height * factor;
      setScreenDimensions({ width, height });
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [screenAspect]);

  function toggleScreenAspect() {
    setScreenAspect(screenAspect == "4:3" ? "16:9" : "4:3");
  };

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

        <div className="hidden md:block px-4 py-2 text-base rounded-lg border border-gray-300
              shadow-sm w-80 h-full resize-none">
          {/* TODO:
          <ul>
            <li>choose background</li>
            <li>add aspect ratio</li>
          </ul> */}
        </div>

        {/* main canvas */}
        <div
          ref={screenRef}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #d1d5db",
            borderRadius: ".75rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            width: screenDimensions.width,
          }}
          className="
            h-full overflow-hidden
            flex items-center justify-center
          "
        >
          <div className="
            whitespace-pre-wrap text-center
          ">
            {text.length === 0 ? (
              <p className="text-gray-400 text-lg">Your stylized text will show here...</p>
            ) : (
              [...(autocaps ? text.toUpperCase() : text)].map((c, i) => {
                const key = letterMetrics[c]?.filename;

                if (c === '\n') {
                  return <br key={i} />;
                }

                const imageUrl = letterImages[key];
                const charCount = [...text].filter(c => c in letterMetrics).length;

                const parentHeight = screenDimensions.height;
                const height = Math.max(parentHeight * .1, parentHeight * (100 / charCount / 100));

                return imageUrl ? (
                  <img
                    key={i}
                    src={imageUrl}
                    alt={c}
                    style={{ height: `${height}px`, maxHeight: parentHeight * 0.3 + "px" }}
                    className={`max-h-[${(parentHeight * .3)}px] inline-block my-2`}
                  />
                ) : (
                  <div
                    key={i}
                    className="w-8 max-h-[30%] aspect-1/3 inline-block"
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
              onChange={handleChange}
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


          <div className="flex gap-2 self-start">
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

      <DisclaimerModal isOpen={modalOpen} onClose={handleClose} />
    </div>
  );
}
