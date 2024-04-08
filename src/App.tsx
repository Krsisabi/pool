import React, { useRef, useEffect } from 'react';
import { Ball } from '~/interfaces';
import { getBalls } from '~/utils/calculate';
import { usePoolLogic } from '~/hooks/usePoolLogic';
import { draw } from '~/utils/draw';
import { ColorPicker } from './components/ColorPicker';

interface BilliardProps {
  width: number;
  height: number;
}

export const App: React.FC<BilliardProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>(getBalls(5, 450, 250, 40));
  const {
    cueStickPosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    ballColor,
    setBallColor,
  } = usePoolLogic(canvasRef, ballsRef);
  const rafRef = useRef<number>(0);

  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;
    const animationLoop = () => {
      draw(
        ctx,
        ballsRef.current,
        canvas,
        cueStickPosition.current.start,
        cueStickPosition.current.end
      );
      rafRef.current = requestAnimationFrame(animationLoop);
    };
    animationLoop();

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [
    cueStickPosition,
    cueStickPosition.current.end,
    cueStickPosition.current.start,
  ]);

  const tableWidth = window.innerWidth;
  const tableHeight = window.innerHeight;

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (ballColor !== null) {
      const selectedBall = ballsRef.current[ballColor];
      selectedBall.color = event.target.value;
      setBallColor(null);
    }
  };


  return (
    <>
      <canvas
        ref={canvasRef}
        width={tableWidth}
        height={tableHeight}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{ backgroundColor: 'rgb(20, 98,91)' }}
      />
      {ballColor !== null && canvasRef.current && (
        <ColorPicker
          position={{
            x:
              ballsRef.current[ballColor].x + canvasRef.current.offsetLeft + 20,
            y: ballsRef.current[ballColor].y + canvasRef.current.offsetTop - 15,
          }}
          onColorChange={handleColorChange}
        />
      )}
    </>
  );
};


export default App;
