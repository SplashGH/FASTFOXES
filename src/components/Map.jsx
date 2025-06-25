import React, { useEffect, useState } from 'react';
import { Image as KonvaImage } from 'react-konva';
import mapBase from '../assets/WorldMap.png'; 

const Map = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = mapBase; 
    img.onload = () => setImage(img);
  }, []);

  return image ? <KonvaImage image={image} x={0} y={0} /> : null;
};

export default Map;
