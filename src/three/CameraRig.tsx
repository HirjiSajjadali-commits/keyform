import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { BOARD_HORIZONTAL_RADIUS_MM, BOARD_VERTICAL_HALF_HEIGHT_MM, SCENE_SCALE } from './dimensions';
import type { CameraPose } from '../hooks/useCameraPose';

const HORIZONTAL_RADIUS = BOARD_HORIZONTAL_RADIUS_MM * SCENE_SCALE;
const VERTICAL_HALF_HEIGHT = BOARD_VERTICAL_HALF_HEIGHT_MM * SCENE_SCALE;
const FOV_DEG = 35;
// Same front-3/4-elevated look established in Phase 2, now just a direction — distance is
// computed per pose/viewport so the board is never cropped, however narrow the screen.
const CAMERA_DIRECTION = new THREE.Vector3(0.35, 0.28, 0.55).normalize();

const POSE_MARGIN: Record<CameraPose, number> = { wide: 1.35, close: 1.15 };

/** Distance needed to fit the board's real (flat, wide) envelope in frame — checked
 * separately per axis rather than via one blended bounding sphere. A sphere sized off the
 * board's diagonal would size the *vertical* fit as if the board were as tall as it is
 * wide (it's roughly 2.5:1, wide and flat), which both overstates distance and makes the
 * board's on-screen size stop growing with a wider viewport once the vertical FOV alone
 * is satisfied. Fitting width against horizontal FOV and height against vertical FOV
 * separately — then taking whichever needs more room — stays just as crop-safe while
 * actually using extra width on a wide screen. */
function fitDistance(aspect: number, margin: number) {
  const vFov = THREE.MathUtils.degToRad(FOV_DEG);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
  const distanceForWidth = (HORIZONTAL_RADIUS * margin) / Math.sin(hFov / 2);
  const distanceForHeight = (VERTICAL_HALF_HEIGHT * margin) / Math.sin(vFov / 2);
  return Math.max(distanceForWidth, distanceForHeight);
}

interface CameraRigProps {
  pose: CameraPose;
  isMobile: boolean;
  reducedMotion: boolean;
}

export function CameraRig({ pose, isMobile, reducedMotion }: CameraRigProps) {
  const { camera, size, invalidate } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  // The single source of truth for "camera at the right distance for this pose/viewport".
  // Takes the live controls instance as a parameter rather than reading controlsRef.current
  // itself, because the two call sites that need this (the pose-change effect below, and
  // the <OrbitControls> ref callback) each have their own most-trustworthy reference to it
  // at the moment they run — see the ref callback's comment for why that distinction matters.
  function applyFit(controls: OrbitControlsImpl | null) {
    const aspect = size.width / size.height;
    const distance = fitDistance(aspect, POSE_MARGIN[pose]);
    camera.position.copy(CAMERA_DIRECTION).multiplyScalar(distance);
    camera.lookAt(0, 0, 0);
    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }
    invalidate();
  }

  // Hard reset on pose change: this is a deliberate "look at the board this way now" cut,
  // so any zoom/pan the user applied to the previous pose should not leak into this one.
  // useLayoutEffect (not useEffect) so this lands before the next paint — no one-frame
  // flash of the camera at its previous pose's position.
  useLayoutEffect(() => {
    applyFit(controlsRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pose]);

  // Resize-only safety net: never let a narrower/shorter viewport crop the board. Only
  // pushes the camera OUT when the current framing would now be too tight — never pulls
  // a deliberately zoomed-out user back in.
  useEffect(() => {
    const aspect = size.width / size.height;
    const minSafeDistance = fitDistance(aspect, POSE_MARGIN[pose]);
    if (camera.position.length() < minSafeDistance) {
      camera.position.setLength(minSafeDistance);
      invalidate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height]);

  const baseDistance = fitDistance(size.width / size.height, POSE_MARGIN[pose]);

  return (
    <OrbitControls
      ref={(instance: OrbitControlsImpl | null) => {
        controlsRef.current = instance;
        // OrbitControls seeds its internal spherical state from the camera's position at
        // the moment IT mounts — which can happen before the pose-change layout effect
        // above ever gets a chance to run (React doesn't guarantee this sibling's effect
        // fires before that ref attaches). If that first read catches the camera at
        // Object3D's default (0,0,0) — a zero-length offset from the target — the controls
        // clamp their internal radius/polar angle to their min bounds and, since later
        // update() calls apply deltas to that internal state rather than re-deriving it
        // from camera.position, our later direct position writes get overwritten right
        // back to those clamped mins on the next frame. Re-applying the fit right here,
        // the instant the instance exists, guarantees the very first spherical read
        // OrbitControls ever does already sees the correct position.
        if (instance) applyFit(instance);
      }}
      enablePan={false}
      enableZoom={!isMobile}
      minDistance={baseDistance * 0.7}
      maxDistance={baseDistance * 1.4}
      minPolarAngle={0.6}
      maxPolarAngle={1.45}
      enableDamping
      dampingFactor={0.08}
      autoRotate={!reducedMotion && autoRotate}
      autoRotateSpeed={0.6}
      onStart={() => setAutoRotate(false)}
    />
  );
}
