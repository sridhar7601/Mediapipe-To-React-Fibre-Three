import React, { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import handData from './handKeyPoints.json'; // Import your JSON file

const FingerAnimationComponent = ({ nodes }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [animationSequence, setAnimationSequence] = useState([]);

  useEffect(() => {
    // Load the animation sequence from JSON
    setAnimationSequence(handData.fingerAnimationSequence);
  }, []);

  useFrame(() => {
    if (!animationSequence || animationSequence.length === 0) return;

    const currentStep = animationSequence.find(seq => seq.time === currentTime);
    
    if (currentStep && currentStep.handKeyPoints) {
      const fingerJoints = Object.keys(currentStep.handKeyPoints);

      // Apply the key points to the 3D model's joints
      fingerJoints.forEach(key => {
        if (nodes[key] && currentStep.handKeyPoints[key]) {
          const { x, y, z } = currentStep.handKeyPoints[key];
          nodes[key].position.set(x, y, z);
        }
      });
    }

    // Increment time for the next frame (simulate animation step by step)
    if (currentTime < animationSequence.length - 1) {
      setCurrentTime(currentTime + 1);
    } else {
      setCurrentTime(0); // Loop the animation if you want it to repeat
    }
  });

  return null;
};

export default FingerAnimationComponent;