import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function App() {
  const [text, setText] = useState("");
  const [currentLetter, setCurrentLetter] = useState("");
  const screenRef = useRef(null); // reference to the screen div

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
          <p style={{ color: "#888" }}>Type a letter below...</p>
        ) : (
          [...text].map((char, i) => {
            const lower = char.toLowerCase();
            const imageUrl = `/assets/letter_${lower}.webp`;
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
        placeholder="Type here..."
        style={styles.input}
      />

      <button onClick={downloadScreen} style={styles.button}>
        Download Screen
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
