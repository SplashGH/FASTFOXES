import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import Map from './Map';

const MapStage = ({ mapWidth = 3840, mapHeight = 2160 }) => {
  const stageRef = useRef(null);
  const [scale, setScale] = useState(0.4);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const MIN_SCALE = 0.4;
  const MAX_SCALE = 3;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  useEffect(() => {
    const centerX = (viewportWidth - mapWidth * scale) / 2;
    const centerY = (viewportHeight - mapHeight * scale) / 2;
    setPosition({ x: centerX, y: centerY });
  }, [scale]);

  const clampPosition = (pos, scale) => {
    const mapScaledWidth = mapWidth * scale;
    const mapScaledHeight = mapHeight * scale;

    const minX = Math.min(0, viewportWidth - mapScaledWidth);
    const maxX = 0;

    const minY = Math.min(0, viewportHeight - mapScaledHeight);
    const maxY = 0;

    return {
      x: Math.max(minX, Math.min(maxX, pos.x)),
      y: Math.max(minY, Math.min(maxY, pos.y)),
    };
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const oldScale = scale;
    const scaleBy = 1.05;

    const mousePoint = stage.getPointerPosition();
    const stageX = stage.x();
    const stageY = stage.y();

    const mousePointTo = {
      x: (mousePoint.x - stageX) / oldScale,
      y: (mousePoint.y - stageY) / oldScale,
    };

    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    const newPos = {
      x: mousePoint.x - mousePointTo.x * newScale,
      y: mousePoint.y - mousePointTo.y * newScale,
    };

    const clampedPos = clampPosition(newPos, newScale);
    setScale(newScale);
    setPosition(clampedPos);
  };

  const handleDragMove = (e) => {
    const newPos = {
      x: e.target.x(),
      y: e.target.y(),
    };
    const clamped = clampPosition(newPos, scale);
    stageRef.current.position(clamped);
    setPosition(clamped);
  };

  return (
    <Stage
      ref={stageRef}
      width={viewportWidth}
      height={viewportHeight}
      scaleX={scale}
      scaleY={scale}
      x={position.x}
      y={position.y}
      draggable
      onWheel={handleWheel}
      onDragMove={handleDragMove}
      style={{ background: '#000' }}
    >
      <Layer>
        <Map />
      </Layer>
    </Stage>
  );
};

export default MapStage;
