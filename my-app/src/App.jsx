import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Model } from '../Avatar';
import HandTrackingComponent from './HandTrackingComponent';

const App = () => {
  const [handLandmarks, setHandLandmarks] = useState(null);
  const videoRef = useRef(null);

  const handleHandsUpdate = (landmarks) => {
    setHandLandmarks(landmarks);
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.play().catch((err) => {
        console.error('Error starting video:', err);
      });
    }
  }, [videoRef]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '70%', height: '100%' }}>
        <Canvas camera={{ position: [0, 1.5, 2.5], fov: 50 }}>
          <OrbitControls />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Model handLandmarks={handLandmarks} />
        </Canvas>
      </div>
      <div style={{ width: '30%', height: '100%' }}>
        <HandTrackingComponent onHandsUpdate={handleHandsUpdate} videoRef={videoRef} />
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: 'auto',
            transform: 'scaleX(-1)', // Mirror the video
          }}
          autoPlay
          playsInline
          muted
        />
      </div>
    </div>
  );
};

export default App;