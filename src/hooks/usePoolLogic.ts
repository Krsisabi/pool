import { RefObject, useRef, useCallback, useState } from "react";
import { Ball } from "../interfaces";

interface CueStickPosition {
  start: { x: number; y: number } | null;
  end: { x: number; y: number } | null;
}

export const usePoolLogic = (
  canvasRef: RefObject<HTMLCanvasElement>,
  ballsRef: React.MutableRefObject<Ball[]>
) => {
  const cueStickPosition = useRef<CueStickPosition>({ start: null, end: null });
  const clickedIndex = useRef<number | null>(null);
  const [ballColor, setBallColor] = useState<
    number | null
  >(null);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const clickedBallIndex = ballsRef.current.findIndex((ball) => {
        const dx = ball.x - mouseX;
        const dy = ball.y - mouseY;
        return Math.sqrt(dx ** 2 + dy ** 2) <= ball.radius;
      });

      if (clickedBallIndex !== -1) {
        clickedIndex.current = clickedBallIndex;
        const selectedBall = ballsRef.current[clickedBallIndex];
        selectedBall.vx = 0;
        selectedBall.vy = 0;
        cueStickPosition.current = {
          start: { x: selectedBall.x, y: selectedBall.y },
          end: null,
        };
      }
    },
    [ballsRef, canvasRef]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!canvasRef.current || clickedIndex.current === null) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      cueStickPosition.current = {
        ...cueStickPosition.current,
        end: { x: mouseX, y: mouseY },
      };
    },
    [canvasRef]
  );

  const handleMouseUp = useCallback(() => {
    if (clickedIndex.current === null) {
      if (ballColor) {
        setBallColor(null);
        clickedIndex.current = null;
        cueStickPosition.current = { start: null, end: null };
      }
      return;
    }

    const selectedBall = ballsRef.current[clickedIndex.current];

    if (cueStickPosition.current.start && cueStickPosition.current.end) {
      const dx =
        cueStickPosition.current.start.x - cueStickPosition.current.end.x;
      const dy =
        cueStickPosition.current.start.y - cueStickPosition.current.end.y;
      const force = 0.1;
      selectedBall.vx = dx * force;
      selectedBall.vy = dy * force;
    }

    if (cueStickPosition.current.end === null) {
      if (ballColor) {
        setBallColor(null);
        clickedIndex.current = null;
        cueStickPosition.current = { start: null, end: null };
      } else {
        setBallColor(clickedIndex.current);
        cueStickPosition.current = { start: null, end: null };
      }
    }

    clickedIndex.current = null;
    cueStickPosition.current = { start: null, end: null };
  }, [ballsRef, ballColor]);

  return {
    cueStickPosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clickedIndex,
    ballColor,
    setBallColor,
  };
};
