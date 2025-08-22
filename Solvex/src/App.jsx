import { useEffect, useRef, useState } from "react";

export default function App() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        
        // canvas.style.background = "black";

        // 🔥 Fill actual canvas background (not just CSS)
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        ctx.lineCap = "round";
        ctx.lineWidth = 3;
      }
    }
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "white";
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
      }
    }
  };

  // 🆕 Save canvas as image
  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL("image/png"); // get image as base64
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "my-drawing.png"; // filename
      link.click(); // trigger download
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* 🆕 Save button */}
      <button
        onClick={saveCanvas}
        className="absolute top-4 left-4 z-10 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
      >
        Save Drawing
      </button>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute top-0 left-0 w-full h-full"
        onMouseDown={startDrawing}
        onMouseOut={stopDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
      />
    </div>
  );
}
