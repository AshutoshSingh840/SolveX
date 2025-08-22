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


  // const dataURL = canvas.toDataURL("image/png");

  //       // The function is now async, so 'await' is valid
  //       const response = await fetch("http://localhost:8000/process_drawing/", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         // Send the Base64 string inside a JSON object
  //         body: JSON.stringify({ image_data: dataURL }),
  //       });

  //       if (response.ok) {
  //           const data = await response.json();
  //           console.log("Image sent and processed successfully:", data);
  //           alert("Drawing sent for processing!");
  //       } else {
  //           console.error("Failed to send image:", response.statusText);
  //           alert("Failed to save drawing.");
  //       }

  //     }

  const sendImageDirectly = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // 1. Convert the canvas content to a Blob (binary data)
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error("Canvas to Blob conversion failed.");
          return;
        }

        // 2. Create a FormData object
        const formData = new FormData();
        // 3. Append the Blob to the FormData object with a filename
        formData.append("drawing", blob, "my-drawing.png");

        try {
          // 4. Send the FormData object via a POST request
          const response = await fetch("http://localhost:8000/answer/", {
            method: "POST",
            body: formData,
            // ❗ Important: Do NOT set the 'Content-Type' header.
            // The browser will automatically set it to 'multipart/form-data'
            // and include the correct boundary.
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Image sent successfully:", data);
            alert("Drawing sent for processing!");
          } else {
            console.error("Failed to send image:", response.statusText);
            alert("Failed to send drawing.");
          }
        } catch (error) {
          console.error("Network error:", error);
          alert("Network error. Could not send drawing.");
        }
      }, "image/png"); // Specify the image format
    }
  };

  // 🆕 Save canvas as image
  const saveCanvas = async () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const dataURL=canvas.toDataURL("image/png");
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
      <button
        onClick={sendImageDirectly}
        className="absolute top-4 left-4 z-10 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
      >
        Generate
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
