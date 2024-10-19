import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simulated MediaPipe output
const simulateMediaPipeOutput = (time) => {
  const baseHandLandmarks = [
    {"x": 0.5, "y": 0.5, "z": 0},    // 0: Wrist
    {"x": 0.46, "y": 0.54, "z": 0},  // 1: Thumb CMC
    {"x": 0.42, "y": 0.58, "z": 0},  // 2: Thumb MCP
    {"x": 0.38, "y": 0.62, "z": 0},  // 3: Thumb IP
    {"x": 0.34, "y": 0.66, "z": 0},  // 4: Thumb tip
    {"x": 0.52, "y": 0.62, "z": 0},  // 5: Index finger MCP
    {"x": 0.54, "y": 0.70, "z": 0},  // 6: Index finger PIP
    {"x": 0.56, "y": 0.76, "z": 0},  // 7: Index finger DIP
    {"x": 0.58, "y": 0.82, "z": 0},  // 8: Index finger tip
    {"x": 0.56, "y": 0.62, "z": 0},  // 9: Middle finger MCP
    {"x": 0.58, "y": 0.72, "z": 0},  // 10: Middle finger PIP
    {"x": 0.60, "y": 0.80, "z": 0},  // 11: Middle finger DIP
    {"x": 0.62, "y": 0.88, "z": 0},  // 12: Middle finger tip
    {"x": 0.60, "y": 0.60, "z": 0},  // 13: Ring finger MCP
    {"x": 0.62, "y": 0.68, "z": 0},  // 14: Ring finger PIP
    {"x": 0.64, "y": 0.74, "z": 0},  // 15: Ring finger DIP
    {"x": 0.66, "y": 0.80, "z": 0},  // 16: Ring finger tip
    {"x": 0.64, "y": 0.56, "z": 0},  // 17: Pinky MCP
    {"x": 0.66, "y": 0.62, "z": 0},  // 18: Pinky PIP
    {"x": 0.68, "y": 0.66, "z": 0},  // 19: Pinky DIP
    {"x": 0.70, "y": 0.70, "z": 0}   // 20: Pinky tip
  ];

  const t = (Math.sin(time * 2) + 1) / 2; // Value between 0 and 1

  return baseHandLandmarks.map(landmark => ({
    x: landmark.x,
    y: landmark.y + Math.sin(time * 2) * 0.1 * t, // Add some vertical movement
    z: landmark.z + Math.cos(time * 2) * 0.1 * t  // Add some depth movement
  }));
};

const HandAnimationComponent = ({ nodes }) => {
  const animationRef = useRef({ time: 0 });

  const animateHand = (landmarks) => {
    const fingerJoints = [
      { name: 'RightHandThumb1', base: 1, tip: 2 },
      { name: 'RightHandThumb2', base: 2, tip: 3 },
      { name: 'RightHandThumb3', base: 3, tip: 4 },
      { name: 'RightHandIndex1', base: 5, tip: 6 },
      { name: 'RightHandIndex2', base: 6, tip: 7 },
      { name: 'RightHandIndex3', base: 7, tip: 8 },
      { name: 'RightHandMiddle1', base: 9, tip: 10 },
      { name: 'RightHandMiddle2', base: 10, tip: 11 },
      { name: 'RightHandMiddle3', base: 11, tip: 12 },
      { name: 'RightHandRing1', base: 13, tip: 14 },
      { name: 'RightHandRing2', base: 14, tip: 15 },
      { name: 'RightHandRing3', base: 15, tip: 16 },
      { name: 'RightHandPinky1', base: 17, tip: 18 },
      { name: 'RightHandPinky2', base: 18, tip: 19 },
      { name: 'RightHandPinky3', base: 19, tip: 20 },
    ];

    fingerJoints.forEach(joint => {
      if (nodes[joint.name]) {
        const basePos = new THREE.Vector3(landmarks[joint.base].x, landmarks[joint.base].y, landmarks[joint.base].z);
        const tipPos = new THREE.Vector3(landmarks[joint.tip].x, landmarks[joint.tip].y, landmarks[joint.tip].z);
        const direction = new THREE.Vector3().subVectors(tipPos, basePos).normalize();

        // Calculate rotation to align with the direction
        const rotationMatrix = new THREE.Matrix4().lookAt(basePos, tipPos, new THREE.Vector3(0, 1, 0));
        const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(rotationMatrix);

        // Apply rotation
        nodes[joint.name].quaternion.slerp(targetQuaternion, 0.1); // Smooth transition
      }
    });
  };

  useFrame((state, delta) => {
    animationRef.current.time += delta;
    const landmarks = simulateMediaPipeOutput(animationRef.current.time);
    animateHand(landmarks);
  });

  return null;
};

export default HandAnimationComponent;