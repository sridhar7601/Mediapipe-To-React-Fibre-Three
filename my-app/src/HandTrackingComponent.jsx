import React, { useEffect } from 'react';
import * as mediapipe from '@mediapipe/hands';
import * as cam from '@mediapipe/camera_utils';

const HandTrackingComponent = ({ onHandsUpdate, videoRef }) => {
  useEffect(() => {
    const hands = new mediapipe.Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    hands.onResults(onResults);

    const videoElement = videoRef.current;
    if (videoElement) {
      const camera = new cam.Camera(videoElement, {
        onFrame: async () => {
          await hands.send({ image: videoElement });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, [videoRef]);

  const onResults = (results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const rightHand = results.multiHandLandmarks[0];
      onHandsUpdate(rightHand);
    }
  };

  return null;
};

export default HandTrackingComponent;