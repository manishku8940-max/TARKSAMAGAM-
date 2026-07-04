const canvas = document.getElementById("research-canvas");
const ctx = canvas.getContext("2d");
let points = [];
let width = 0;
let height = 0;

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  points = Array.from({ length: Math.max(32, Math.floor(width / 32)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    z: Math.random() * 1.8 + 0.3,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18
  }));
}

function drawNetwork() {
  ctx.clearRect(0, 0, width, height);
  points.forEach((point) => {
    point.x += point.vx * point.z;
    point.y += point.vy * point.z;

    if (point.x < -20) point.x = width + 20;
    if (point.x > width + 20) point.x = -20;
    if (point.y < -20) point.y = height + 20;
    if (point.y > height + 20) point.y = -20;
  });

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i];
      const b = points[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 155) {
        const alpha = (1 - distance / 155) * 0.2;
        ctx.strokeStyle = `rgba(12, 79, 120, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  points.forEach((point) => {
    ctx.fillStyle = point.z > 1.3 ? "rgba(233, 144, 49, 0.48)" : "rgba(22, 139, 156, 0.38)";
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.z * 1.7, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawNetwork);
}

function animateCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number(element.dataset.counter);
        const duration = 1300;
        const started = performance.now();

        function tick(now) {
          const progress = Math.min((now - started) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = Math.floor(target * eased).toLocaleString("en-IN");
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(element);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function setupRegistrationForm() {
  const form = document.getElementById("registration-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const details = {
      name: data.get("name"),
      aadhaar: data.get("aadhaar"),
      phone: data.get("phone"),
      email: data.get("email"),
      year: data.get("year"),
      subject: data.get("subject")
    };

    const message = [
      "Tark Sangam Registration",
      `Name: ${details.name}`,
      `Aadhaar: ${details.aadhaar}`,
      `Phone: ${details.phone}`,
      `Email: ${details.email}`,
      `Masters/Graduation Year: ${details.year}`,
      `Subject Interest: ${details.subject}`
    ].join("\n");

    const whatsapp = `https://wa.me/916200902995?text=${encodeURIComponent(message)}`;
    const email = `mailto:tarksangam@gamil.com?subject=${encodeURIComponent(
      "Tark Sangam Registration"
    )}&body=${encodeURIComponent(message)}`;

    window.open(whatsapp, "_blank", "noopener,noreferrer");
    window.location.href = email;
    status.textContent = "Registration prepared for WhatsApp and email.";
    form.reset();
  });
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawNetwork();
animateCounters();
setupRegistrationForm();
