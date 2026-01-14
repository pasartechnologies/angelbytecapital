document.addEventListener("DOMContentLoaded", () => {
  console.log("AdNova Website Loaded");

  // Smooth Scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Mobile Menu
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileBtn) {
    mobileBtn.addEventListener("click", () => {
      mobileBtn.classList.toggle("active");
      navLinks.classList.toggle("active");
      document.body.style.overflow = navLinks.classList.contains("active")
        ? "hidden"
        : "";
    });
  }

  // Close mobile menu when clicking a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        mobileBtn.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  // Intersection Observer for Fade-in effects
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });

  // Market Section Observer
  const marketSection = document.getElementById("market");
  let marketAnimated = false;

  const marketObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !marketAnimated) {
          marketAnimated = true;
          animateCounters();
          drawMarketChart();
        }
      });
    },
    { threshold: 0.3 }
  );

  if (marketSection) {
    marketObserver.observe(marketSection);
  }

  function animateCounters() {
    const counters = document.querySelectorAll(".stat-number");
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const duration = 2000; // ms
      const increment = target / (duration / 16);

      let current = 0;
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.innerText = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target;
        }
      };
      updateCounter();
    });
  }

  function drawMarketChart() {
    const canvas = document.getElementById("market-chart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    // Simple sizing
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const dataPoints = [10, 30, 55, 90, 160, 250];
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const stepX = chartWidth / (dataPoints.length - 1);
    const maxVal = Math.max(...dataPoints); // 250

    let progress = 0;

    function animateLine() {
      if (progress > 1) progress = 1;

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, width * progress, height);
      ctx.clip();

      // Draw Gradient Area
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(79, 172, 254, 0.4)");
      gradient.addColorStop(1, "rgba(79, 172, 254, 0)");

      ctx.beginPath();
      ctx.moveTo(padding, height - padding);

      for (let i = 0; i < dataPoints.length; i++) {
        const x = padding + i * stepX;
        const y = height - padding - (dataPoints[i] / maxVal) * chartHeight;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(padding + (dataPoints.length - 1) * stepX, height - padding);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw Line
      ctx.beginPath();
      for (let i = 0; i < dataPoints.length; i++) {
        const x = padding + i * stepX;
        const y = height - padding - (dataPoints[i] / maxVal) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#4facfe";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      ctx.restore();

      if (progress < 1) {
        progress += 0.015;
        requestAnimationFrame(animateLine);
      }
    }

    animateLine();
  }
});
// Contact Form Submission Logic
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get values
    const name = document.getElementById("name").value;
    // Profession is not in the email template provided, but user asked to replace 'profession' variable.
    // The template only has: Name, Email, Phone Number, LinkedIn, Proposed Investment Amount.
    // I will incoporate profession if it fits, otherwise stick to template.
    // The prompt said: "replace the varible names name profession , linkedin , and etc"
    // But the template: "Name: [Investor Full Name] ... " doesn't explicitly have profession.
    // I will add Profession to the body for completeness as requested.

    const profession = document.getElementById("profession").value;
    const email = document.getElementById("email").value;
    const countryCode = document.getElementById("country-code").value;
    const phoneNumber = document.getElementById("phone").value;
    const fullPhone = `${countryCode} ${phoneNumber}`;
    const linkedin = document.getElementById("linkedin").value;
    const investment = document.getElementById("investment").value;

    const subject = "Expression of Interest in Investing in AdTech";

    const body = `Dear Sir/Madam,

I am writing to formally express my interest in exploring investment opportunities with your company. The vision of building a unified AdTech marketplace that addresses inefficiencies, fraud, and fragmented advertising platforms is compelling, and I believe AdTech has strong potential in the evolving digital economy.

Please find my details below:

Name: ${name}

Profession: ${profession}

Email: ${email}

Phone Number: ${fullPhone}

LinkedIn Profile: ${linkedin}

Proposed Investment Amount: ${investment}

I would be glad to schedule a call or meeting at your convenience to discuss your current stage of development, financial projections, and the structure of the pre‑seed round.

Looking forward to your response.

Warm regards,
${name}
`;

    const mailtoLink = `mailto:contact@angelbytecapital.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  });
}
