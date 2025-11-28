import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function App() {
  const [text, setText] = useState("");
  const screenRef = useRef(null); // reference to the screen div

  const letterImages = import.meta.glob(
    "/src/assets/images/letter_*.webp",
    { eager: true, import: "default" }
  );

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const downloadScreen = async () => {
    if (!screenRef.current) return;
    const canvas = await html2canvas(screenRef.current);
    const link = document.createElement("a");
    link.download = "screen.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="app" style={styles.app}>
      <div className="screen" style={styles.screen} ref={screenRef}>
        {text.length === 0 ? (
          <p style={{ color: "#888" }}>Type any text below...</p>
        ) : (
          [...text].map((char, i) => {
            const lower = char.toLowerCase();
            const key = `/src/assets/images/letter_${lower}.webp`;
            const imageUrl = letterImages[key];
            console.log(letterImages);
            return (
              <img
                key={i}
                src={imageUrl}
                alt={char}
                style={styles.image}
                onError={(e) => {
                  // replace with a transparent "space" div
                  e.target.replaceWith(
                    Object.assign(document.createElement("div"), {
                      style: `max-height: 30%; aspect-ratio: 1/3; height: 100%;`,
                    })
                  );
                }}
              />
            );
          })
        )}
      </div>

      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Yasminify your text here! 🌸"
        style={styles.input}
      />

      <button onClick={downloadScreen} style={styles.button}>
        Download Image
      </button>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f0f0",
  },
  screen: {
    height: "75%",
    aspectRatio: 4 / 3,
    border: "2px solid #ccc",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
  },
  image: {
    maxHeight: "30%",
  },
  input: {
    width: "300px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
