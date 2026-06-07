/**
 * Certification Cards — Interactive Effects
 * 3D tilt, cursor-following glow, scroll reveal, and ambient particles.
 */
(function () {
  "use strict";

  /* ============================================================
     1. 3D TILT EFFECT — Cards tilt toward cursor on hover
     ============================================================ */
  function initTilt() {
    var cards = document.querySelectorAll(".cert-card[data-tilt]");
    var MAX_TILT = 12; // degrees

    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var cx = rect.width / 2;
        var cy = rect.height / 2;

        var rotateY = ((x - cx) / cx) * MAX_TILT;
        var rotateX = ((cy - y) / cy) * MAX_TILT;

        card.style.transform =
          "rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg) scale3d(1.03, 1.03, 1.03)";

        /* Move the glow spotlight */
        var glow = card.querySelector(".card-glow");
        if (glow) {
          glow.style.left = x + "px";
          glow.style.top = y + "px";
        }
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "rotateX(0) rotateY(0) scale3d(1, 1, 1)";
        var glow = card.querySelector(".card-glow");
        if (glow) {
          glow.style.opacity = "0";
        }
      });

      card.addEventListener("mouseenter", function () {
        var glow = card.querySelector(".card-glow");
        if (glow) {
          glow.style.opacity = "1";
        }
      });
    });
  }

  /* ============================================================
     2. SCROLL REVEAL — Cards animate in on scroll
     ============================================================ */
  function initScrollReveal() {
    var wrappers = document.querySelectorAll(".cert-card-wrapper");
    if (!wrappers.length) return;

    // Use IntersectionObserver if available, otherwise show all
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );

      wrappers.forEach(function (w) {
        observer.observe(w);
      });
    } else {
      // Fallback: just show them
      wrappers.forEach(function (w) {
        w.classList.add("visible");
      });
    }
  }

  /* ============================================================
     3. AMBIENT FLOATING PARTICLES for cert section
     ============================================================ */
  function initCertParticles() {
    var canvas = document.getElementById("cert-particles-canvas");
    if (!canvas) return;

    var section = document.getElementById("certificates");
    if (!section) return;

    var ctx = canvas.getContext("2d");
    var particles = [];
    var PARTICLE_COUNT = 40;
    var w, h;

    function resize() {
      w = section.offsetWidth;
      h = section.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    }
    resize();
    window.addEventListener("resize", resize);

    function Particle() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.radius = Math.random() * 1.8 + 0.5;
      this.alpha = Math.random() * 0.3 + 0.1;
      this.color = Math.random() > 0.5
        ? "rgba(104,195,163,"
        : "rgba(82,179,217,";
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    Particle.prototype.update = function (t) {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = w;
      if (this.x > w) this.x = 0;
      if (this.y < 0) this.y = h;
      if (this.y > h) this.y = 0;
      this.alpha = 0.15 + Math.sin(t * 0.001 + this.pulsePhase) * 0.1;
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + Math.max(0, this.alpha) + ")";
      ctx.fill();
    };

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    // Draw connections
    function drawConnections() {
      var CONNECT = 120;
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT) {
            var opacity = (1 - dist / CONNECT) * 0.06;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "rgba(104,195,163," + opacity + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        particles[i].update(t);
        particles[i].draw();
      }
      drawConnections();
      requestAnimationFrame(animate);
    }

    // Only animate when section is in viewport for performance
    var isVisible = false;
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(
        function (entries) {
          isVisible = entries[0].isIntersecting;
        },
        { threshold: 0 }
      );
      obs.observe(section);
    } else {
      isVisible = true;
    }

    (function loop(t) {
      if (isVisible) {
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < particles.length; i++) {
          particles[i].update(t);
          particles[i].draw();
        }
        drawConnections();
      }
      requestAnimationFrame(loop);
    })(0);
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    initTilt();
    initScrollReveal();
    initCertParticles();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
