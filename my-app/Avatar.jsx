import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Model({ handLandmarks }) {
  const group = useRef();
  const { nodes, materials } = useGLTF('/avatar.glb');

  const animateHand = (landmarks) => {
    if (!landmarks) return;

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

    fingerJoints.forEach((joint) => {
      const bone = group.current.getObjectByName(joint.name);
      if (bone) {
        const basePos = new THREE.Vector3(
          landmarks[joint.base].x,
          -landmarks[joint.base].y,
          landmarks[joint.base].z
        );
        const tipPos = new THREE.Vector3(
          landmarks[joint.tip].x,
          -landmarks[joint.tip].y,
          landmarks[joint.tip].z
        );

        const direction = new THREE.Vector3().subVectors(tipPos, basePos);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction.normalize()
        );

        bone.quaternion.slerp(quaternion, 0.5);
      }
    });

    // Update wrist position
    const wrist = group.current.getObjectByName('RightHand');
    if (wrist) {
      wrist.position.set(
        landmarks[0].x * 0.1,
        -landmarks[0].y * 0.1,
        landmarks[0].z * 0.1
      );
    }
  };

  useFrame(() => {
    if (handLandmarks) {
      animateHand(handLandmarks);
    }
  });

  useEffect(() => {
    console.log('Model Nodes:', Object.keys(nodes));
  }, [nodes]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Hips} />
      {/* Mesh components for avatar parts */}
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload('/avatar.glb');
export default Model;