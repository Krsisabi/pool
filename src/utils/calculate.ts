import { Ball } from '../interfaces';

const COLORS = [
  'ff0000',
  'ffff00',
  '0000ff',
  '800080',
  'ffa500',
  '008000',
  'a52a2a',
  '000000',
  'ffffff',
];


export const getBalls = (
  rows: number,
  startX: number,
  startY: number,
  ballSpacing: number
): Ball[] => {
  const MIN_RADIUS = 15;
  const RADIUS_RANGE = 5;
  
  const balls: Ball[] = [];

  const shuffledColors = [...COLORS].sort(() => Math.random() - 0.5);
  let colorIndex = 0;

  for (let row = 0; row < rows; row++) {
    for (let i = 0; i < row; i++) {
      const x = startX + row * ballSpacing;
      const y = startY + (i - row / 2) * ballSpacing;
      const radius = MIN_RADIUS + Math.random() * RADIUS_RANGE;
      const color = `#${shuffledColors[colorIndex++ % COLORS.length]}`;

      balls.push({
        x,
        y,
        vx: 0,
        vy: 0,
        radius,
        color,
        draw: function (ctx: CanvasRenderingContext2D) {
          ctx.beginPath();
          ctx.arc(
            this.x + this.radius * 0.3,
            this.y + this.radius * 0.3,
            this.radius,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();

          const grad = ctx.createRadialGradient(
            this.x - this.radius / 2,
            this.y - this.radius / 4,
            0,
            this.x,
            this.y,
            this.radius
          );

          grad.addColorStop(0, '#fff');
          grad.addColorStop(0.8, this.color);
          grad.addColorStop(1, this.color);
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.closePath();
        },
      });
    }
  }

  return balls;
};

export const handleBorderCollision = (
  ball: Ball,
  canvasWidth: number,
  canvasHeight: number
): void => {
  const { x, y, radius } = ball;

  if (y + radius > canvasHeight || y - radius < 0) {
    ball.vy *= -1;
  }

  if (x + radius > canvasWidth || x - radius < 0) {
    ball.vx *= -1;
  }
};
