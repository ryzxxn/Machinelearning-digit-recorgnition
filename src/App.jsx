import React, { useState, useRef } from 'react';
import axios from 'axios';

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { offsetX, offsetY } = event.nativeEvent;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { offsetX, offsetY } = event.nativeEvent;
    
    // Fill canvas with white color
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    ctx.lineWidth = 10; // Set pen size
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const saveAndSendImage = async () => {
    const canvas = canvasRef.current;
    // Convert canvas image to JPEG format
    const image = canvas.toDataURL('image/jpeg', 1.0); // Quality parameter is optional and ranges from 0.0 to 1.0
    try {
      // Send image to backend using API
      const response = await axios.post('http://localhost:5000/saveImage', { image });
      // Handle response here
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Error saving image. Please try again later.');
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        style={{ backgroundColor: 'white', border: '1px solid black' }}
      />
      <br />
      <button onClick={saveAndSendImage}>Save and Send Image</button>
    </div>
  );
};

export default DrawingCanvas;
