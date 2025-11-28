import { useState, useEffect } from "react";

export default function DisclaimerModal({ isOpen, onClose }) {
  const [show, setShow] = useState(false);

  // Animate when modal opens
  useEffect(() => {
    if (isOpen) setShow(true);
    else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function fadeOut() {
    setShow(false); // trigger fade out
    setTimeout(() => onClose(), 200);
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center
      bg-[rgb(1,1,1,0.5)] z-50 transition-all duration-300
      ${show ? "opacity-100" : "opacity-0"}
      `}
      onClick={fadeOut} // closes when clicking the overlay

    >
      <div
        className={`
          bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative
          transform transition-all duration-300
          ${show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()} // prevents closing when clicking the modal itself
      >
        <button
          onClick={fadeOut}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-xl"
        >
          ×
        </button>

        <div className="flex flex-col">

          <h2 className="text-2xl font-bold mb-4">About Kween Yasmin Font Maker</h2>
          <div className="border border-gray-500 mb-4"></div>
          <p className="text-gray-700 text-justify">
            This is a Web App for generating texts using{" "}
            <a
              href="https://public.canva.site/allpurposekween"
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Canva's 'All-Purpose Kween'
            </a>{" "}
            assets. I do not take credit for creating any of the images and I also do not sell any of these images.
          </p>
          <br />
          <p className="text-gray-700 text-justify">
            Some images and design assets displayed in this web application are created using
            third-party tools, including Canva. These assets are used under the terms of their
            respective licenses. This app is not affiliated with or endorsed by Canva.
          </p>
        </div>
      </div>
    </div>
  );
}
