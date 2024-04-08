import { Ball } from '../interfaces';
import { handleBorderCollision } from './calculate';

const FRICTION = 0.99;

export const draw = (
  ctx: CanvasRenderingContext2D | null,
  balls: Ball[],
  canvas: HTMLCanvasElement,
  cueStickStart: { x: number; y: number } | null,
  cueStickEnd: { x: number; y: number } | null
) => {
  if (!ctx) return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.beginPath();

  balls.forEach((ball, index) => {
    ball.vx *= FRICTION;
    ball.vy *= FRICTION;
    ball.x += ball.vx;
    ball.y += ball.vy;
    handleBorderCollision(ball, canvas.width, canvas.height);

    for (let j = 0; j < balls.length; j++) {
      const dx = balls[index].x - balls[j].x;

      const dy = balls[index].y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (index !== j && distance < balls[index].radius + balls[j].radius) {
        const ball1 = ball;
        const ball2 = balls[j];
        const dx = ball2.x - ball1.x;
        const dy = ball2.y - ball1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball1.radius + ball2.radius) {
          const nx = dx / distance;
          const ny = dy / distance;
          const dvx = ball2.vx - ball1.vx;
          const dvy = ball2.vy - ball1.vy;
          const dotProduct = nx * dvx + ny * dvy;
          const impulse =
            (2 * dotProduct) / (1 / ball1.radius + 1 / ball2.radius);

          ball1.vx += (impulse * nx) / ball1.radius;
          ball1.vy += (impulse * ny) / ball1.radius;
          ball2.vx -= (impulse * nx) / ball2.radius;
          ball2.vy -= (impulse * ny) / ball2.radius;

          const overlap = (ball1.radius + ball2.radius - distance) / 2;
          const sepX = overlap * nx;
          const sepY = overlap * ny;

          ball1.x -= sepX;
          ball1.y -= sepY;
          ball2.x += sepX;
          ball2.y += sepY;

          while (
            Math.sqrt((ball2.x - ball1.x) ** 2 + (ball2.y - ball1.y) ** 2) <
            ball1.radius + ball2.radius
          ) {
            ball1.x -= sepX / 10;
            ball1.y -= sepY / 10;
            ball2.x += sepX / 10;
            ball2.y += sepY / 10;
          }
        }
      }
    }

    ball.draw(ctx);
  });

  if (cueStickStart && cueStickEnd) {
    ctx.beginPath();
    ctx.moveTo(cueStickStart.x, cueStickStart.y);
    ctx.lineTo(cueStickEnd.x, cueStickEnd.y); // Добавляем линию от начальной точки до конечной
    ctx.stroke(); 
  }
};
