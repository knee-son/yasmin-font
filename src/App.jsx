import { useState, useRef } from "react";
import DisclaimerModal from "./DisclaimerModal.jsx";
import html2canvas from "html2canvas";

import StandImage from "./assets/images/stand.webp";
import SideEyeImage from "./assets/images/side_eye.webp";

export default function App() {
  const [text, setText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const screenRef = useRef(null);

  const letterImages = import.meta.glob(
    "/src/assets/images/letter_*.webp",
    { eager: true, import: "default" }
  );

  const handleChange = (e) => setText(e.target.value);

  const handleClose = () => {
    setModalOpen(false);
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
      <div className="h-1/6 flex items-center justify-center">
        <h1
          style={{
            fontFamily: "Rouge Script",
            textShadow: "-2px 4px 1px rgba(0,0,0,0.20)",
            color: "rgba(8, 1, 20, 1)",
          }}
          className="text-7xl font-bold"
        >
          Kween Yasmin Font Maker!
        </h1>

        <img
          src={SideEyeImage}
          alt="Kween Yasmin looking away"
          className="w-35 self-start"
        />
      </div>

      {/* Bottom: 4/5 height */}
      <div className="h-5/6 flex flex-row justify-center">
        {/* main canvas */}
        <div
          ref={screenRef}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #d1d5db",
            borderRadius: ".75rem",     // matches rounded-xl
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // matches shadow-md
          }}
          className="
            flex items-center justify-center
            h-[80vh] aspect-4/3 overflow-hidden ml-auto mr-8
          "
        >
          {text.length === 0 ? (
            <p className="text-gray-400 text-lg">Your stylized text will show here...</p>
          ) : (
            [...text].map((char, i) => {
              const lower = char.toLowerCase();
              const key = `/src/assets/images/letter_${lower}.webp`;
              const imageUrl = letterImages[key];

              return imageUrl ? (
                <img
                  key={i}
                  src={imageUrl}
                  alt={char}
                  className="max-h-[30%]"
                />
              ) : (
                <div
                  key={i}
                  className="w-8 max-h-[30%] aspect-1/3"
                />
              );
            })
          )}
        </div>

        {/* input */}
        <div className="flex flex-col gap-4 items-center mr-16">
          <textarea
            value={text}
            onChange={handleChange}
            placeholder="Yasminify your text here! 🌸"
            className="
              px-4 py-2 text-base rounded-lg border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-pink-300
              shadow-sm w-80 h-40 resize-none z-10
            "
            autoFocus
          />

          <button
            onClick={downloadScreen}
            className="
          px-5 py-2 rounded-lg text-white bg-pink-400
          hover:bg-pink-500 active:bg-pink-600
          transition shadow-md self-start
        "
          >
            Download Image
          </button>
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
