import { useEffect, useRef } from 'react';

export default function StarfieldCanvas() {
  const canvasRef = useRef(null);
  const constellationsRef = useRef([]);

  useEffect(() => {
    // Add cache buster so the browser always loads the fresh JSON without requiring a hard refresh
    fetch('/constellation_data.json?v=' + Date.now())
      .then(res => res.json())
      .then(data => {
        // Pre-calculate lines for performance to avoid O(N^2) in the draw loop
        data.forEach(c => {
          c.lines = [];
          const maxDist = 0.012; 
          for(let i=0; i<c.points.length; i++) {
            for(let j=i+1; j<c.points.length; j++) {
              const dx = c.points[i][0] - c.points[j][0];
              const dy = c.points[i][1] - c.points[j][1];
              if (dx*dx + dy*dy < maxDist*maxDist) {
                c.lines.push([i, j]);
              }
            }
          }
        });
        constellationsRef.current = data;
      })
      .catch(err => console.error('Failed to load constellation data:', err));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const STAR_COUNT = 6000;
    
    // Initialize stars
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      baseX: Math.random() * width,
      baseY: Math.random() * height,
      tx: 0,
      ty: 0,
      speed: Math.random() * 0.1 + 0.05,
      radius: Math.random() * 0.8 + 0.2,
      brightness: Math.random(),
      offset: Math.random() * 100,
      twinkle: Math.random() * 0.02 + 0.01,
    }));

    let isHovering = false;
    let assemblyPhase = 0;
    let activeData = null;
    let targetIndex = 0;
    let cx = 0;
    let cy = 0;
    const constellationSpeed = 0.15; // Matches average background star speed

    const onMouseMove = (e) => {
      // If hovering over the modal form itself, disperse the constellation
      if (e.target.closest('.auth-modal')) {
        isHovering = false;
        return;
      }

      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const dataArr = constellationsRef.current;
      
      if (dataArr.length === 0) return;

      if (!isHovering) {
        isHovering = true;
        // Pick a completely random character instead of sequential
        activeData = dataArr[Math.floor(Math.random() * dataArr.length)];
        cx = mouseX;
        cy = mouseY;
        
        // Randomly pick stars from the entire background to avoid creating a dark void
        stars.sort(() => Math.random() - 0.5);
        
        // Ensure fluid vertical morphing by sorting the chosen stars by Y coordinate
        if (activeData && activeData.points) {
          const activeCount = activeData.points.length;
          const activeStars = stars.slice(0, activeCount);
          activeStars.sort((a, b) => a.y - b.y);
          for (let i = 0; i < activeCount; i++) {
            stars[i] = activeStars[i];
          }
        }
      } else {
        // If mouse moves far away from the current constellation, break it and form a new one
        const dist = Math.hypot(mouseX - cx, mouseY - cy);
        if (dist > 350) {
          assemblyPhase = 0.1; // Drops phase to hide lines and make it morph smoothly
          // Pick a completely random character instead of sequential
          activeData = dataArr[Math.floor(Math.random() * dataArr.length)];
          cx = mouseX;
          cy = mouseY;
          
          // Randomly pick stars from the entire background so the old face scatters
          // and the new face assembles from all over the screen
          stars.sort(() => Math.random() - 0.5);
          
          // Ensure fluid vertical morphing
          if (activeData && activeData.points) {
            const activeCount = activeData.points.length;
            const activeStars = stars.slice(0, activeCount);
            activeStars.sort((a, b) => a.y - b.y);
            for (let i = 0; i < activeCount; i++) {
              stars[i] = activeStars[i];
            }
          }
        }
      }
    };
    
    const onMouseLeave = () => {
      isHovering = false;
    };
    
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);

    let animId;
    let time = 0;

    const draw = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#121316';
      ctx.fillRect(0, 0, width, height);

      time += 1;

      // Lerp assembly phase for smooth transitions
      if (isHovering) {
        assemblyPhase += (1 - assemblyPhase) * 0.05;
      } else {
        assemblyPhase += (0 - assemblyPhase) * 0.05;
      }

      // Drift the entire constellation to the left with the background
      if (activeData && isHovering) {
        cx -= constellationSpeed;
        cx = (cx % width + width) % width; // Smoothly bound cx
        
        const size = Math.min(width, height) * 0.65;
        const aspect = activeData.aspect || 1;
        const drawW = size * aspect;
        const drawH = size;
        const ox = cx - drawW * 0.5;
        const oy = cy - drawH * 0.5;

        // Dynamically update target coordinates so they move left
        for (let i = 0; i < stars.length; i++) {
          if (i < activeData.points.length) {
            let tx = ox + activeData.points[i][0] * drawW;
            let ty = oy + activeData.points[i][1] * drawH;
            
            // Seamless wrap for individual stars
            stars[i].tx = (tx % width + width) % width;
            stars[i].ty = ty;
          } else {
            stars[i].tx = stars[i].baseX;
            stars[i].ty = stars[i].baseY;
          }
        }
      }

      // 1. Update and draw stars
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Always update background drift
        s.baseX -= s.speed;
        if (s.baseX < -5) {
          s.baseX = width + 5;
          s.baseY = Math.random() * height;
        }

        // Interpolate position with fast, snappy spring physics
        const isFaceStar = isHovering && activeData && i < activeData.points.length;
        
        if (isFaceStar) {
          let dx = s.tx - s.x;
          let dy = s.ty - s.y;
          
          // Shortest path interpolation to handle seamless wrapping
          // Only do this when the face is mostly assembled, otherwise background stars
          // will glitch and teleport across the screen when first flying in!
          if (assemblyPhase > 0.8) {
            if (dx > width * 0.5) {
              s.x += width;
              dx = s.tx - s.x;
            } else if (dx < -width * 0.5) {
              s.x -= width;
              dx = s.tx - s.x;
            }
          }
          
          // Maximally simple and smooth easing (no bounce, no twitching)
          s.x += dx * 0.25;
          s.y += dy * 0.25;
          s.vx = 0;
          s.vy = 0;
        } else {
          // If star wrapped around screen, snap immediately so it doesn't fly across
          if (Math.abs(s.x - s.baseX) > width * 0.5) {
            s.x = s.baseX;
            s.y = s.baseY;
          }
          // Smoothly dissolve back to background
          s.x += (s.baseX - s.x) * 0.25; 
          s.y += (s.baseY - s.y) * 0.25;
          s.vx = 0;
          s.vy = 0;
        }

        const tw = Math.sin(time * s.twinkle + s.offset) * 0.4 + 0.6;
        // Make the face stars significantly brighter
        const faceGlow = isFaceStar ? assemblyPhase * 0.7 : 0;
        const alpha = s.brightness * tw + faceGlow;

        ctx.beginPath();
        // Slightly enlarge the stars that make up the face
        const radiusMult = 1 + (isFaceStar ? assemblyPhase * 1.0 : assemblyPhase * 0.2);
        ctx.arc(s.x, s.y, s.radius * radiusMult, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 230, 255, ${Math.min(1, Math.max(0, alpha))})`;
        ctx.fill();
      }

      // 2. Draw connective lines ONLY when assembled
      if (assemblyPhase > 0.1 && activeData) {
        ctx.globalAlpha = assemblyPhase;
        
        for (const [i, j] of activeData.lines) {
          if (i >= stars.length || j >= stars.length) continue;
          
          const s1 = stars[i];
          const s2 = stars[j];
          
          const dist1 = Math.abs(s1.x - s1.tx) + Math.abs(s1.y - s1.ty);
          const dist2 = Math.abs(s2.x - s2.tx) + Math.abs(s2.y - s2.ty);
          
          if (dist1 < 30 && dist2 < 30) {
            // Prevent drawing lines across the entire screen when wrapped
            if (Math.abs(s1.x - s2.x) < width * 0.5) {
              ctx.beginPath();
              ctx.moveTo(s1.x, s1.y);
              ctx.lineTo(s2.x, s2.y);
              // Added a subtle magical blue/purple glow to the lines to make them look better
              ctx.strokeStyle = `rgba(160, 190, 255, ${assemblyPhase * 0.25})`; 
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1.0;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Allow clicks to pass through to the form
        background: '#121316'
      }}
    />
  );
}
