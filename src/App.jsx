import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css'

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let { offsetX, offsetY } = event.nativeEvent;

    // Handle touch events
    if (event.type === 'touchstart') {
      const touch = event.touches[0];
      offsetX = touch.clientX - canvas.offsetLeft;
      offsetY = touch.clientY - canvas.offsetTop;

      // Set passive option to false for touchstart event listener
      canvas.addEventListener('touchmove', draw, { passive: false });
      canvas.addEventListener('touchend', endDrawing, { passive: false });
    }

    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);

    // Set passive option to false for mousedown event listener
    canvas.addEventListener('mousemove', draw, { passive: false });
    canvas.addEventListener('mouseup', endDrawing, { passive: false });
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let { offsetX, offsetY } = event.nativeEvent;

    // Handle touch events
    if (event.type === 'touchmove') {
      event.preventDefault();
      const touch = event.touches[0];
      offsetX = touch.clientX - canvas.offsetLeft;
      offsetY = touch.clientY - canvas.offsetTop;
    }

    // Fill canvas with white color
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 10; // Set pen size
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);

    // Remove event listeners
    const canvas = canvasRef.current;
    canvas.removeEventListener('touchmove', draw);
    canvas.removeEventListener('touchend', endDrawing);
    canvas.removeEventListener('mousemove', draw);
    canvas.removeEventListener('mouseup', endDrawing);
  };

  const saveAndSendImage = async () => {
    const canvas = canvasRef.current;
    // Convert canvas image to JPEG format
    const image = canvas.toDataURL('image/jpeg', 1.0); // Quality parameter is optional and ranges from 0.0 to 1.0
    try {
      // Send image to backend using API
      const response = await axios.post('https://ai-nr.onrender.com/saveImage', { image });
      // Handle response here
      console.log('Response:', response.data.message);
      alert(response.data.message)
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Error saving image. Please try again later.');
    }
  };

  return (
    <div className='screen_container'>
      <div className='screen'>
        <canvas className='canvas'
          ref={canvasRef}
          width={500}
          height={500}
          onMouseDown={startDrawing}
          onTouchStart={startDrawing}
          onMouseMove={draw}
          onTouchMove={draw}
          onMouseUp={endDrawing}
          onTouchEnd={endDrawing}
          onMouseOut={endDrawing}
          style={{ backgroundColor: 'white', border: '1px solid black' }}
        />
        <br />
        <button onClick={saveAndSendImage}>Save and Send Image</button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
