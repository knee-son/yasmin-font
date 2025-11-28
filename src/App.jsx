import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function App() {
  const [text, setText] = useState("");
  const [currentLetter, setCurrentLetter] = useState("");
  const screenRef = useRef(null); // reference to the screen div

  const handleChange = (e) => {
    const val = e.target.value;
    setText(val);
    setCurrentLetter(val.slice(-1).toLowerCase());
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
        {currentLetter ? (
          <img
            src={`/assets/letter_${currentLetter}.webp`}
            alt={currentLetter}
            style={styles.image}
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <p style={{ color: "#888" }}>Type a letter below...</p>
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
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f0f0",
  },
  screen: {
    width: "300px",
    height: "300px",
    border: "2px solid #ccc",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
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
