'use client';

import { useEffect, useRef, useState } from "react";

//Variation 1: Stock Chart Lines
export default function AnimatedBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const getColor = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#dc2626";

    // Create multiple chart lines
    const chartLines = Array.from({ length: 8 }, (_, i) => ({
      points: Array.from({ length: 15 }, (_, j) => ({
        x: (j / 14) * width,
        y: height * 0.3 + Math.sin((j + i) * 0.8) * 60 + Math.random() * 40,
        targetY: height * 0.3 + Math.sin((j + i) * 0.8) * 60 + Math.random() * 40,
      })),
      offset: i * 0.1,
      opacity: 0.1 + (i % 3) * 0.05,
    }));

    let time = 0;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = getColor();
      ctx.lineWidth = 1;

      time += 0.02;

      chartLines.forEach((line, lineIndex) => {
        ctx.globalAlpha = line.opacity;
        ctx.beginPath();
        
        line.points.forEach((point, i) => {
          point.targetY = height * 0.3 + 
            Math.sin((i + lineIndex + time) * 0.8) * 60 + 
            Math.sin((i + time) * 0.3) * 30;
          
          point.y += (point.targetY - point.y) * 0.1;
          
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
      aria-hidden
    />
  );
}

// Variation 2: Floating Currency Symbols
// export default function AnimatedBg() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let width = window.innerWidth;
//     let height = window.innerHeight;
//     canvas.width = width;
//     canvas.height = height;

//     const getColor = () =>
//       getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#dc2626";

//     const symbols = ['₹', '$', '€', '£', '¥', '%', '↗', '↖'];
    
//     const floatingSymbols = Array.from({ length: 25 }, () => ({
//       x: Math.random() * width,
//       y: Math.random() * height,
//       symbol: symbols[Math.floor(Math.random() * symbols.length)],
//       size: 12 + Math.random() * 8,
//       dx: (Math.random() - 0.5) * 0.3,
//       dy: (Math.random() - 0.5) * 0.3,
//       rotation: Math.random() * Math.PI * 2,
//       rotationSpeed: (Math.random() - 0.5) * 0.02,
//       opacity: 0.1 + Math.random() * 0.1,
//     }));

//     function animate() {
//       if (!ctx) return;
//       ctx.clearRect(0, 0, width, height);
//       ctx.fillStyle = getColor();
//       ctx.font = "16px Arial";
//       ctx.textAlign = "center";

//       floatingSymbols.forEach(symbol => {
//         symbol.x += symbol.dx;
//         symbol.y += symbol.dy;
//         symbol.rotation += symbol.rotationSpeed;

//         // Bounce off edges
//         if (symbol.x < 0 || symbol.x > width) symbol.dx *= -1;
//         if (symbol.y < 0 || symbol.y > height) symbol.dy *= -1;

//         ctx.save();
//         ctx.globalAlpha = symbol.opacity;
//         ctx.translate(symbol.x, symbol.y);
//         ctx.rotate(symbol.rotation);
//         ctx.font = `${symbol.size}px Arial`;
//         ctx.fillText(symbol.symbol, 0, 0);
//         ctx.restore();
//       });

//       requestAnimationFrame(animate);
//     }

//     animate();

//     const handleResize = () => {
//       width = window.innerWidth;
//       height = window.innerHeight;
//       canvas.width = width;
//       canvas.height = height;
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 w-full h-full pointer-events-none z-0"
//       style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
//       aria-hidden
//     />
//   );
// }

// Variation 3: Geometric Growth Patterns
// export default function AnimatedBg() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let width = window.innerWidth;
//     let height = window.innerHeight;
//     canvas.width = width;
//     canvas.height = height;

//     const getColor = () =>
//       getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#dc2626";

//     const shapes = Array.from({ length: 12 }, () => ({
//       x: Math.random() * width,
//       y: Math.random() * height,
//       size: 2 + Math.random() * 4,
//       maxSize: 20 + Math.random() * 30,
//       dx: (Math.random() - 0.5) * 0.4,
//       dy: (Math.random() - 0.5) * 0.4,
//       growing: true,
//       type: Math.floor(Math.random() * 3), // 0: triangle, 1: square, 2: hexagon
//     }));

//     function drawShape(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, type: number) {
//       ctx.beginPath();
//       switch (type) {
//         case 0: // Triangle
//           ctx.moveTo(x, y - size);
//           ctx.lineTo(x - size * 0.866, y + size * 0.5);
//           ctx.lineTo(x + size * 0.866, y + size * 0.5);
//           ctx.closePath();
//           break;
//         case 1: // Square
//           ctx.rect(x - size, y - size, size * 2, size * 2);
//           break;
//         case 2: // Hexagon
//           for (let i = 0; i < 6; i++) {
//             const angle = (i * Math.PI) / 3;
//             const px = x + size * Math.cos(angle);
//             const py = y + size * Math.sin(angle);
//             if (i === 0) ctx.moveTo(px, py);
//             else ctx.lineTo(px, py);
//           }
//           ctx.closePath();
//           break;
//       }
//     }

//     function animate() {
//       if (!ctx) return;
//       ctx.clearRect(0, 0, width, height);
//       ctx.globalAlpha = 0.15;
//       ctx.strokeStyle = getColor();
//       ctx.lineWidth = 1;

//       shapes.forEach(shape => {
//         shape.x += shape.dx;
//         shape.y += shape.dy;

//         // Bounce off edges
//         if (shape.x < 0 || shape.x > width) shape.dx *= -1;
//         if (shape.y < 0 || shape.y > height) shape.dy *= -1;

//         // Growth animation
//         if (shape.growing) {
//           shape.size += 0.2;
//           if (shape.size >= shape.maxSize) {
//             shape.growing = false;
//           }
//         } else {
//           shape.size -= 0.1;
//           if (shape.size <= 2) {
//             shape.growing = true;
//             shape.maxSize = 20 + Math.random() * 30;
//           }
//         }

//         drawShape(ctx, shape.x, shape.y, shape.size, shape.type);
//         ctx.stroke();
//       });

//       requestAnimationFrame(animate);
//     }

//     animate();

//     const handleResize = () => {
//       width = window.innerWidth;
//       height = window.innerHeight;
//       canvas.width = width;
//       canvas.height = height;
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 w-full h-full pointer-events-none z-0"
//       style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
//       aria-hidden
//     />
//   );
// }

// Variation 4: Network Connection Lines
// export default function AnimatedBg() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let width = window.innerWidth;
//     let height = window.innerHeight;
//     canvas.width = width;
//     canvas.height = height;

//     const getColor = () =>
//       getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#dc2626";

//     const nodes = Array.from({ length: 20 }, () => ({
//       x: Math.random() * width,
//       y: Math.random() * height,
//       dx: (Math.random() - 0.5) * 0.5,
//       dy: (Math.random() - 0.5) * 0.5,
//       radius: 2 + Math.random() * 2,
//     }));

//     function animate() {
//       if (!ctx) return;
//       ctx.clearRect(0, 0, width, height);
//       ctx.globalAlpha = 0.4;
//       ctx.fillStyle = getColor();
//       ctx.strokeStyle = getColor();

//       // Update positions
//       nodes.forEach(node => {
//         node.x += node.dx;
//         node.y += node.dy;

//         if (node.x < 0 || node.x > width) node.dx *= -1;
//         if (node.y < 0 || node.y > height) node.dy *= -1;
//       });

//       // Draw connections
//       ctx.globalAlpha = 0.1;
//       ctx.lineWidth = 0.5;
//       for (let i = 0; i < nodes.length; i++) {
//         for (let j = i + 1; j < nodes.length; j++) {
//           const dx = nodes[i].x - nodes[j].x;
//           const dy = nodes[i].y - nodes[j].y;
//           const distance = Math.sqrt(dx * dx + dy * dy);
          
//           if (distance < 150) {
//             ctx.beginPath();
//             ctx.moveTo(nodes[i].x, nodes[i].y);
//             ctx.lineTo(nodes[j].x, nodes[j].y);
//             ctx.stroke();
//           }
//         }
//       }

//       // Draw nodes
//       ctx.globalAlpha = 0.6;
//       nodes.forEach(node => {
//         ctx.beginPath();
//         ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
//         ctx.fill();
//       });

//       requestAnimationFrame(animate);
//     }

//     animate();

//     const handleResize = () => {
//       width = window.innerWidth;
//       height = window.innerHeight;
//       canvas.width = width;
//       canvas.height = height;
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 w-full h-full pointer-events-none z-0"
//       style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
//       aria-hidden
//     />
//   );
// }


// Variation 5: Floating Coins/Circles
// export default function AnimatedBg() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let width = window.innerWidth;
//     let height = window.innerHeight;
//     canvas.width = width;
//     canvas.height = height;

//     const getColor = () =>
//       getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#dc2626";

//     const coins = Array.from({ length: 35 }, () => ({
//       x: Math.random() * width,
//       y: Math.random() * height,
//       radius: 3 + Math.random() * 8,
//       dx: (Math.random() - 0.5) * 0.3,
//       dy: (Math.random() - 0.5) * 0.3,
//       rotation: Math.random() * Math.PI * 2,
//       rotationSpeed: (Math.random() - 0.5) * 0.03,
//       innerRadius: 0.3 + Math.random() * 0.4,
//     }));

//     function animate() {
//       if (!ctx) return;
//       ctx.clearRect(0, 0, width, height);
//       ctx.globalAlpha = 0.2;
//       ctx.strokeStyle = getColor();
//       ctx.lineWidth = 1;

//       coins.forEach(coin => {
//         coin.x += coin.dx;
//         coin.y += coin.dy;
//         coin.rotation += coin.rotationSpeed;

//         // Bounce off edges
//         if (coin.x < 0 || coin.x > width) coin.dx *= -1;
//         if (coin.y < 0 || coin.y > height) coin.dy *= -1;

//         // Draw outer circle
//         ctx.beginPath();
//         ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
//         ctx.stroke();

//         // Draw inner detail (like a coin)
//         ctx.beginPath();
//         ctx.arc(coin.x, coin.y, coin.radius * coin.innerRadius, 0, Math.PI * 2);
//         ctx.stroke();

//         // Draw cross pattern
//         ctx.save();
//         ctx.translate(coin.x, coin.y);
//         ctx.rotate(coin.rotation);
//         ctx.beginPath();
//         ctx.moveTo(-coin.radius * 0.5, 0);
//         ctx.lineTo(coin.radius * 0.5, 0);
//         ctx.moveTo(0, -coin.radius * 0.5);
//         ctx.lineTo(0, coin.radius * 0.5);
//         ctx.stroke();
//         ctx.restore();
//       });

//       requestAnimationFrame(animate);
//     }

//     animate();

//     const handleResize = () => {
//       width = window.innerWidth;
//       height = window.innerHeight;
//       canvas.width = width;
//       canvas.height = height;
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 w-full h-full pointer-events-none z-0"
//       style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
//       aria-hidden
//     />
//   );
// }

// Variation 1: Flowing Money (dot) Streams
// export default function AnimatedBg() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let width = window.innerWidth;
//     let height = window.innerHeight;
//     canvas.width = width;
//     canvas.height = height;

//     const getColor = () =>
//       getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#dc2626";

//     const streams = Array.from({ length: 8 }, (_, i) => ({
//       particles: Array.from({ length: 20 }, (_, j) => ({
//         x: -50 + j * 40,
//         y: 100 + i * 80 + Math.sin(j * 0.5) * 30,
//         size: 1 + Math.random() * 2,
//         speed: 0.5 + Math.random() * 0.5,
//         opacity: 0.1 + Math.random() * 0.15,
//         wave: Math.random() * Math.PI * 2,
//       })),
//       waveOffset: i * 0.5,
//     }));

//     let time = 0;

//     function animate() {
//       if (!ctx) return;
//       ctx.clearRect(0, 0, width, height);
//       ctx.fillStyle = getColor();
      
//       time += 0.02;

//       streams.forEach(stream => {
//         stream.particles.forEach(particle => {
//           particle.x += particle.speed;
//           particle.y += Math.sin(time + particle.wave) * 0.3;
          
//           if (particle.x > width + 50) {
//             particle.x = -50;
//           }

//           ctx.globalAlpha = particle.opacity;
//           ctx.beginPath();
//           ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
//           ctx.fill();
//         });
//       });

//       requestAnimationFrame(animate);
//     }

//     animate();

//     const handleResize = () => {
//       width = window.innerWidth;
//       height = window.innerHeight;
//       canvas.width = width;
//       canvas.height = height;
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 w-full h-full pointer-events-none z-0"
//       style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
//       aria-hidden
//     />
//   );
// }

// Variation 2: Portfolio Pie Segments
// export default function AnimatedBg() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let width = window.innerWidth;
//     let height = window.innerHeight;
//     canvas.width = width;
//     canvas.height = height;

//     const getColor = () =>
//       getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#dc2626";

//     const pieSegments = Array.from({ length: 12 }, (_, i) => ({
//       x: Math.random() * width,
//       y: Math.random() * height,
//       radius: 15 + Math.random() * 25,
//       startAngle: Math.random() * Math.PI * 2,
//       endAngle: Math.random() * Math.PI * 0.8,
//       dx: (Math.random() - 0.5) * 0.3,
//       dy: (Math.random() - 0.5) * 0.3,
//       rotationSpeed: (Math.random() - 0.5) * 0.02,
//       opacity: 0.08 + Math.random() * 0.1,
//     }));

//     function animate() {
//       if (!ctx) return;
//       ctx.clearRect(0, 0, width, height);
//       ctx.strokeStyle = getColor();
//       ctx.lineWidth = 2;

//       pieSegments.forEach(segment => {
//         segment.x += segment.dx;
//         segment.y += segment.dy;
//         segment.startAngle += segment.rotationSpeed;
//         segment.endAngle += segment.rotationSpeed;

//         if (segment.x < 0 || segment.x > width) segment.dx *= -1;
//         if (segment.y < 0 || segment.y > height) segment.dy *= -1;

//         ctx.globalAlpha = segment.opacity;
//         ctx.beginPath();
//         ctx.arc(segment.x, segment.y, segment.radius, segment.startAngle, segment.startAngle + segment.endAngle);
//         ctx.stroke();

//         // Add inner arc for depth
//         ctx.beginPath();
//         ctx.arc(segment.x, segment.y, segment.radius * 0.7, segment.startAngle, segment.startAngle + segment.endAngle);
//         ctx.stroke();
//       });

//       requestAnimationFrame(animate);
//     }

//     animate();

//     const handleResize = () => {
//       width = window.innerWidth;
//       height = window.innerHeight;
//       canvas.width = width;
//       canvas.height = height;
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 w-full h-full pointer-events-none z-0"
//       style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
//       aria-hidden
//     />
//   );
// }

// Variation 3: Digital Rain (Finance Numbers)
// export default function AnimatedBg() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let width = window.innerWidth;
//     let height = window.innerHeight;
//     canvas.width = width;
//     canvas.height = height;

//     const getColor = () =>
//       getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#dc2626";

//     const characters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '%', '₹', '$'];
//     const columns = Math.floor(width / 20);
//     const drops = Array.from({ length: columns }, () => ({
//       y: Math.random() * height,
//       speed: 1 + Math.random() * 3,
//       opacity: 0.1 + Math.random() * 0.1,
//     }));

//     function animate() {
//       if (!ctx) return;
//       ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
//       ctx.fillRect(0, 0, width, height);
      
//       ctx.fillStyle = getColor();
//       ctx.font = '12px monospace';

//       drops.forEach((drop, i) => {
//         const char = characters[Math.floor(Math.random() * characters.length)];
//         const x = i * 20;
        
//         ctx.globalAlpha = drop.opacity;
//         ctx.fillText(char, x, drop.y);
        
//         drop.y += drop.speed;
        
//         if (drop.y > height) {
//           drop.y = -20;
//           drop.speed = 1 + Math.random() * 3;
//         }
//       });

//       requestAnimationFrame(animate);
//     }

//     animate();

//     const handleResize = () => {
//       width = window.innerWidth;
//       height = window.innerHeight;
//       canvas.width = width;
//       canvas.height = height;
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 w-full h-full pointer-events-none z-0"
//       style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
//       aria-hidden
//     />
//   );
// }

// Variation 4: Hexagonal Grid Pattern
// export default function AnimatedBg() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let width = window.innerWidth;
//     let height = window.innerHeight;
//     canvas.width = width;
//     canvas.height = height;

//     const getColor = () =>
//       getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#dc2626";

//     const hexSize = 25;
//     type Hexagon = {
//       x: number;
//       y: number;
//       opacity: number;
//       pulseSpeed: number;
//       pulseOffset: number;
//     };
//     const hexagons: Hexagon[] = [];
    
//     for (let x = 0; x < width + hexSize * 2; x += hexSize * 1.5) {
//       for (let y = 0; y < height + hexSize * 2; y += hexSize * Math.sqrt(3)) {
//         hexagons.push({
//           x: x + (y % (hexSize * Math.sqrt(3) * 2) < hexSize * Math.sqrt(3) ? 0 : hexSize * 0.75),
//           y: y,
//           opacity: 0.02 + Math.random() * 0.08,
//           pulseSpeed: 0.02 + Math.random() * 0.03,
//           pulseOffset: Math.random() * Math.PI * 2,
//         });
//       }
//     }

//     let time = 0;

//     function drawHexagon(x: number, y: number, size: number) {
//       if (!ctx) return;
//       ctx.beginPath();
//       for (let i = 0; i < 6; i++) {
//         const angle = (i * Math.PI) / 3;
//         const px = x + size * Math.cos(angle);
//         const py = y + size * Math.sin(angle);
//         if (i === 0) ctx.moveTo(px, py);
//         else ctx.lineTo(px, py);
//       }
//       ctx.closePath();
//     }

//     function animate() {
//       if (!ctx) return;
//       ctx.clearRect(0, 0, width, height);
//       ctx.strokeStyle = getColor();
//       ctx.lineWidth = 1;
      
//       time += 0.02;

//       hexagons.forEach(hex => {
//         const pulse = Math.sin(time * hex.pulseSpeed + hex.pulseOffset);
//         ctx.globalAlpha = hex.opacity * (0.5 + pulse * 0.5);
        
//         drawHexagon(hex.x, hex.y, hexSize * 0.8);
//         ctx.stroke();
//       });

//       requestAnimationFrame(animate);
//     }

//     animate();

//     const handleResize = () => {
//       width = window.innerWidth;
//       height = window.innerHeight;
//       canvas.width = width;
//       canvas.height = height;
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 w-full h-full pointer-events-none z-0"
//       style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
//       aria-hidden
//     />
//   );
// }

// Variation 5: Particle Constellation
// export default function AnimatedBg() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let width = window.innerWidth;
//     let height = window.innerHeight;
//     canvas.width = width;
//     canvas.height = height;

//     const getColor = () =>
//       getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#dc2626";

//     const stars = Array.from({ length: 80 }, () => ({
//       x: Math.random() * width,
//       y: Math.random() * height,
//       size: 0.5 + Math.random() * 2,
//       dx: (Math.random() - 0.5) * 0.2,
//       dy: (Math.random() - 0.5) * 0.2,
//       twinkle: Math.random() * Math.PI * 2,
//       twinkleSpeed: 0.02 + Math.random() * 0.03,
//     }));

//     function animate() {
//       if (!ctx) return;
//       ctx.clearRect(0, 0, width, height);
//       ctx.fillStyle = getColor();
//       ctx.strokeStyle = getColor();

//       // Update positions
//       stars.forEach(star => {
//         star.x += star.dx;
//         star.y += star.dy;
//         star.twinkle += star.twinkleSpeed;

//         if (star.x < 0 || star.x > width) star.dx *= -1;
//         if (star.y < 0 || star.y > height) star.dy *= -1;
//       });

//       // Draw constellation lines
//       ctx.globalAlpha = 0.05;
//       ctx.lineWidth = 0.5;
//       for (let i = 0; i < stars.length; i++) {
//         for (let j = i + 1; j < stars.length; j++) {
//           const dx = stars[i].x - stars[j].x;
//           const dy = stars[i].y - stars[j].y;
//           const distance = Math.sqrt(dx * dx + dy * dy);
          
//           if (distance < 120) {
//             ctx.beginPath();
//             ctx.moveTo(stars[i].x, stars[i].y);
//             ctx.lineTo(stars[j].x, stars[j].y);
//             ctx.stroke();
//           }
//         }
//       }

//       // Draw stars with twinkling effect
//       stars.forEach(star => {
//         const twinkleAlpha = 0.1 + Math.sin(star.twinkle) * 0.05;
//         ctx.globalAlpha = twinkleAlpha;
//         ctx.beginPath();
//         ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
//         ctx.fill();
//       });

//       requestAnimationFrame(animate);
//     }

//     animate();

//     const handleResize = () => {
//       width = window.innerWidth;
//       height = window.innerHeight;
//       canvas.width = width;
//       canvas.height = height;
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 w-full h-full pointer-events-none z-0"
//       style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
//       aria-hidden
//     />
//   );
// }

//circle
// export default function AnimatedBg() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let width = window.innerWidth;
//     let height = window.innerHeight;
//     canvas.width = width;
//     canvas.height = height;

//     const getColor = () =>
//       getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#dc2626";

//     type Ripple = { radius: number; opacity: number; decay: number };
//     type Bubble = {
//       x: number;
//       y: number;
//       radius: number;
//       maxRadius: number;
//       dx: number;
//       dy: number;
//       growing: boolean;
//       growthSpeed: number;
//       opacity: number;
//       ripples: Ripple[];
//     };

//     const bubbles: Bubble[] = Array.from({ length: 25 }, () => ({
//       x: Math.random() * width,
//       y: Math.random() * height,
//       radius: 5 + Math.random() * 20,
//       maxRadius: 15 + Math.random() * 35,
//       dx: (Math.random() - 0.5) * 0.4,
//       dy: (Math.random() - 0.5) * 0.4,
//       growing: Math.random() > 0.5,
//       growthSpeed: 0.1 + Math.random() * 0.2,
//       opacity: 0.03 + Math.random() * 0.07,
//       ripples: [],
//     }));

//     function animate() {
//       if (!ctx) return;
//       ctx.clearRect(0, 0, width, height);
//       ctx.strokeStyle = getColor();
//       ctx.lineWidth = 1;

//       bubbles.forEach(bubble => {
//         bubble.x += bubble.dx;
//         bubble.y += bubble.dy;

//         // Bounce off edges
//         if (bubble.x < 0 || bubble.x > width) bubble.dx *= -1;
//         if (bubble.y < 0 || bubble.y > height) bubble.dy *= -1;

//         // Growth animation
//         if (bubble.growing) {
//           bubble.radius += bubble.growthSpeed;
//           if (bubble.radius >= bubble.maxRadius) {
//             bubble.growing = false;
//             // Create ripple effect
//             bubble.ripples.push({
//               radius: bubble.radius,
//               opacity: 0.3,
//               decay: 0.02,
//             });
//           }
//         } else {
//           bubble.radius -= bubble.growthSpeed * 0.5;
//           if (bubble.radius <= 5) {
//             bubble.growing = true;
//             bubble.maxRadius = 15 + Math.random() * 35;
//           }
//         }

//         // Draw main bubble
//         ctx.globalAlpha = bubble.opacity;
//         ctx.beginPath();
//         ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
//         ctx.stroke();

//         // Draw and update ripples
//         bubble.ripples = bubble.ripples.filter(ripple => {
//           ctx.globalAlpha = ripple.opacity;
//           ctx.beginPath();
//           ctx.arc(bubble.x, bubble.y, ripple.radius, 0, Math.PI * 2);
//           ctx.stroke();
          
//           ripple.radius += 2;
//           ripple.opacity -= ripple.decay;
          
//           return ripple.opacity > 0;
//         });
//       });

//       requestAnimationFrame(animate);
//     }

//     animate();

//     const handleResize = () => {
//       width = window.innerWidth;
//       height = window.innerHeight;
//       canvas.width = width;
//       canvas.height = height;
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 w-full h-full pointer-events-none z-0"
//       style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
//       aria-hidden
//     />
//   );
// }

// Variation 5: Bouncing Comets
// export default function AnimatedBg() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let width = window.innerWidth;
//     let height = window.innerHeight;
//     canvas.width = width;
//     canvas.height = height;

//     const getColor = () =>
//       getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#dc2626";

//     type TrailPoint = { x: number; y: number };
//     type Comet = {
//       x: number;
//       y: number;
//       dx: number;
//       dy: number;
//       trail: TrailPoint[];
//       maxTrailLength: number;
//       size: number;
//       opacity: number;
//       bounceCount: number;
//     };
//     const comets: Comet[] = Array.from({ length: 5 }, () => ({
//       x: Math.random() * width,
//       y: Math.random() * height,
//       dx: (Math.random() - 0.5) * 4,
//       dy: (Math.random() - 0.5) * 4,
//       trail: [] as TrailPoint[],
//       maxTrailLength: 20,
//       size: 2 + Math.random() * 2,
//       opacity: 0.3 + Math.random() * 0.3,
//       bounceCount: 0,
//     }));

//     function animate() {
//       if (!ctx) return;
//       ctx.clearRect(0, 0, width, height);

//       comets.forEach(comet => {
//         // Update position
//         comet.x += comet.dx;
//         comet.y += comet.dy;

//         // Bounce off walls with trail effect
//         if (comet.x <= 0 || comet.x >= width) {
//           comet.dx *= -0.9; // Slight energy loss
//           comet.bounceCount++;
//         }
//         if (comet.y <= 0 || comet.y >= height) {
//           comet.dy *= -0.9;
//           comet.bounceCount++;
//         }

//         // Keep within bounds
//         comet.x = Math.max(0, Math.min(width, comet.x));
//         comet.y = Math.max(0, Math.min(height, comet.y));

//         // Add to trail
//         comet.trail.push({ x: comet.x, y: comet.y });
//         if (comet.trail.length > comet.maxTrailLength) {
//           comet.trail.shift();
//         }

//         // Draw trail with gradient effect
//         for (let i = 0; i < comet.trail.length; i++) {
//           const trailPoint = comet.trail[i];
//           const alpha = (i / comet.trail.length) * comet.opacity;
//           const size = (i / comet.trail.length) * comet.size;

//           ctx.globalAlpha = alpha;
//           ctx.fillStyle = getColor();
//           ctx.beginPath();
//           ctx.arc(trailPoint.x, trailPoint.y, size, 0, Math.PI * 2);
//           ctx.fill();
//         }

//         // Draw comet head with glow
//         ctx.globalAlpha = comet.opacity;
//         ctx.fillStyle = getColor();
//         ctx.beginPath();
//         ctx.arc(comet.x, comet.y, comet.size, 0, Math.PI * 2);
//         ctx.fill();

//         // Add glow effect
//         ctx.globalAlpha = comet.opacity * 0.3;
//         ctx.beginPath();
//         ctx.arc(comet.x, comet.y, comet.size * 2.5, 0, Math.PI * 2);
//         ctx.fill();
//       });

//       requestAnimationFrame(animate);
//     }

//     animate();

//     const handleResize = () => {
//       width = window.innerWidth;
//       height = window.innerHeight;
//       canvas.width = width;
//       canvas.height = height;
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 w-full h-full pointer-events-none z-0"
//       style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
//       aria-hidden
//     />
//   );
// }
