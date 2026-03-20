// Czekamy na przetworzenie HTML, by nie blokować renderowania tekstu (FCP)
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d", { alpha: false });

  let w, h;
  let hue = 0;

  // Offscreen canvas - inicjalizacja
  const smokeCanvas = document.createElement('canvas');
  const sCtx = smokeCanvas.getContext('2d');
  const smokeSize = 256; 
  smokeCanvas.width = smokeSize;
  smokeCanvas.height = smokeSize;

  const createSmokeTexture = () => {
    const center = smokeSize / 2;
    const grad = sCtx.createRadialGradient(center, center, 0, center, center, center);
    grad.addColorStop(0, "rgba(255,255,255,0.3)");
    grad.addColorStop(0.3, "rgba(180,180,180,0.1)");
    grad.addColorStop(0.6, "rgba(60,60,60,0.02)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    sCtx.fillStyle = grad;
    sCtx.filter = "blur(14px)"; 
    sCtx.beginPath();
    sCtx.arc(center, center, smokeSize / 3.2, 0, Math.PI * 2);
    sCtx.fill();
  };
  createSmokeTexture();

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  
  // OPTYMALIZACJA: Dodano passive flag dla płynności przeglądarki
  window.addEventListener("resize", resize, { passive: true });
  resize();

  class SmokeParticle {
    constructor() { this.reset(true); }
    reset(isInitial = false) {
      this.x = w / 2;
      this.y = h + 100;
      const angle = (-Math.PI / 2) + (Math.random() - 0.5) * Math.PI * 1.6;
      const speed = 0.5 + Math.random() * 1.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      
      this.radius = 120 + Math.random() * 150; 
      this.opacity = 0.08 + Math.random() * 0.15; 
      
      this.rotation = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.01;
      this.life = 0;
      this.maxLife = 400 + Math.random() * 500;
      
      if(isInitial) {
          const skip = Math.random() * 0.9;
          this.life = this.maxLife * skip;
          this.x += this.vx * this.life;
          this.y += this.vy * this.life;
          this.radius += 0.6 * this.life; 
      }
    }
    update() {
      this.life++;
      this.x += this.vx;
      this.y += this.vy;
      this.radius += 0.6; 
      this.rotation += this.spin;
      if (this.life >= this.maxLife) this.reset(false);
    }
    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.setTransform(1, 0, 0, 1, this.x, this.y);
      ctx.rotate(this.rotation);
      
      // OPTYMALIZACJA: Przeliczenie rozmiaru raz na klatkę, zamiast dwa
      const size = this.radius * 2;
      ctx.drawImage(smokeCanvas, -this.radius, -this.radius, size, size);
    }
  }

  const maxParticles = (w < 768) ? 35 : 100;
  const particles = Array.from({ length: maxParticles }, () => new SmokeParticle());

  // OPTYMALIZACJA: Prekalkulacja spreadów linii, by nie liczyć tego w każdej klatce animacji
  const lineCount = 15;
  const lineSpreads = new Float32Array(lineCount);
  for (let i = 0; i < lineCount; i++) {
    lineSpreads[i] = (i / (lineCount - 1) - 0.5) * 2;
  }

  function drawLines() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 0.3;
    const startX = w / 2;
    const startY = h + 120;
    ctx.lineWidth = 1;
    ctx.strokeStyle = `hsl(${hue}, 80%, 50%)`;
    
    const maxSpread = w * 1.5; 
    
    // OPTYMALIZACJA: Ścieżkę i rysowanie (stroke) wykonujemy tylko RAZ, a nie 15 razy
    ctx.beginPath();
    for (let i = 0; i < lineCount; i++) {
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + lineSpreads[i] * maxSpread, -500);
    }
    ctx.stroke();
  }

  function animate() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < maxParticles; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    ctx.globalCompositeOperation = 'source-over';
    drawLines();
    
    hue = (hue + 0.15) % 360;
    requestAnimationFrame(animate);
  }

  // OPTYMALIZACJA: Podwójny requestAnimationFrame pozwala przeglądarce 
  // wyrenderować pierwszy widok HTML w 100% zanim JS obciąży wątek Canvasem
  requestAnimationFrame(() => {
    requestAnimationFrame(animate);
  });

  document.getElementById('waitlistForm').onsubmit = (e) => {
    e.preventDefault();
    alert('Dziękujemy! Poinformujemy Cię o starcie Autosfery.');
  };
});
