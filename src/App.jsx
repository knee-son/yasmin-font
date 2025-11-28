import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function App() {
  const [text, setText] = useState("");
  const screenRef = useRef(null);

  const letterImages = import.meta.glob(
    "/src/assets/images/letter_*.webp",
    { eager: true, import: "default" }
  );

  const handleChange = (e) => setText(e.target.value);

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
    link.download = "screen.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100 px-4">
      <div
        ref={screenRef}
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #d1d5db",
          borderRadius: "0.75rem",     // matches rounded-xl
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // matches shadow-md
        }}
        className="
            flex items-center justify-center
            w-[80vw] max-w-[600px] aspect-[4/3] mb-6 overflow-hidden
          "
      >
        {text.length === 0 ? (
          <p className="text-gray-400 text-lg">Type any text below...</p>
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
                className="max-h-[30%] aspect-1/3"
              />
            );
          })
        )}
      </div>

      <div>
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Yasminify your text here! 🌸"
          className="
          w-72 px-4 py-2 text-base rounded-lg border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-pink-300
          mr-4 shadow-sm
        "
        />

        <button
          onClick={downloadScreen}
          className="
          px-5 py-2 rounded-lg text-white bg-pink-500
          hover:bg-pink-600 active:bg-pink-700
          transition shadow-md
        "
        >
          Download Image
        </button>
      </div>

    </div>
  );
}
