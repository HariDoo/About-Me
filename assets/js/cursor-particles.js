/**
 * Cursor-reactive particle background for the home/hero section.
 * Particles float, glow, and respond to mouse movement.
 */
(function () {
  "use strict";

  /* ── CONFIG ── */
  var PARTICLE_COUNT = 90;
  var CONNECT_DIST = 140; // px – max distance to draw lines between particles
  var MOUSE_RADIUS = 180; // px – cursor influence radius
  var MOUSE_FORCE = 0.06; // strength of attraction toward cursor
  var BASE_SPEED = 0.35;
  var COLORS = [
    "rgba(104,195,163,", // #68c3a3  (green accent)
    "rgba(82,179,217,", // #52b3d9  (blue accent)
    "rgba(255,255,255,", // white
    "rgba(149,165,166,", // grey
  ];

  /* ── STATE ── */
  var canvas, ctx, w, h;
  var particles = [];
  var mouse = { x: -9999, y: -9999, active: false };
  var animId;
  var heroSection;

  /* ── PARTICLE CLASS ── */
  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * BASE_SPEED * 2;
    this.vy = (Math.random() - 0.5) * BASE_SPEED * 2;
    this.radius = Math.random() * 2.5 + 1;
    this.baseRadius = this.radius;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.5 + 0.3;
    this.baseAlpha = this.alpha;
    // For the subtle pulse
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
    this.pulsePhase = Math.random() * Math.PI * 2;
  };

  Particle.prototype.update = function (time) {
    /* Pulse */
    var pulse = Math.sin(time * this.pulseSpeed + this.pulsePhase);
    this.radius = this.baseRadius + pulse * 0.6;
    this.alpha = this.baseAlpha + pulse * 0.1;

    /* Mouse interaction */
    if (mouse.active) {
      var dx = mouse.x - this.x;
      var dy = mouse.y - this.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        // Gentle attraction
        var force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
        this.vx += dx * force;
        this.vy += dy * force;
        // Brighten near cursor
        this.alpha = Math.min(
          1,
          this.baseAlpha + (1 - dist / MOUSE_RADIUS) * 0.5,
        );
        this.radius = this.baseRadius + (1 - dist / MOUSE_RADIUS) * 2;
      }
    }

    /* Damping */
    this.vx *= 0.98;
    this.vy *= 0.98;

    /* Enforce a minimum drift so particles never fully stop */
    var speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed < BASE_SPEED * 0.3) {
      this.vx += (Math.random() - 0.5) * 0.15;
      this.vy += (Math.random() - 0.5) * 0.15;
    }

    this.x += this.vx;
    this.y += this.vy;

    /* Wrap edges */
    if (this.x < -10) this.x = w + 10;
    if (this.x > w + 10) this.x = -10;
    if (this.y < -10) this.y = h + 10;
    if (this.y > h + 10) this.y = -10;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0.5, this.radius), 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha + ")";
    ctx.fill();

    /* Glow */
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha * 0.08 + ")";
    ctx.fill();
  };

  /* ── DRAW CONNECTIONS ── */
  function drawConnections() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          var opacity = (1 - dist / CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(104,195,163," + opacity + ")";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    /* Lines from cursor to nearby particles */
    if (mouse.active) {
      for (var k = 0; k < particles.length; k++) {
        var dx2 = mouse.x - particles[k].x;
        var dy2 = mouse.y - particles[k].y;
        var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (dist2 < MOUSE_RADIUS) {
          var opacity2 = (1 - dist2 / MOUSE_RADIUS) * 0.3;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(particles[k].x, particles[k].y);
          ctx.strokeStyle = "rgba(82,179,217," + opacity2 + ")";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  /* ── ANIMATION LOOP ── */
  function animate(time) {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
      particles[i].update(time);
      particles[i].draw();
    }
    drawConnections();
    animId = requestAnimationFrame(animate);
  }

  /* ── SIZING ── */
  function resize() {
    heroSection = document.getElementById("home");
    if (!heroSection || !canvas) return;
    w = heroSection.offsetWidth;
    h = heroSection.offsetHeight;
    canvas.width = w;
    canvas.height = h;
  }

  /* ── INIT ── */
  function init() {
    heroSection = document.getElementById("home");
    if (!heroSection) return;

    canvas = document.createElement("canvas");
    canvas.id = "cursor-particles-canvas";
    canvas.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;";
    heroSection.appendChild(canvas);
    ctx = canvas.getContext("2d");

    resize();

    /* Create particles */
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    /* Mouse events – listen on the hero section */
    heroSection.addEventListener("mousemove", function (e) {
      var rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    heroSection.addEventListener("mouseleave", function () {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    });

    /* Touch support */
    heroSection.addEventListener("touchmove", function (e) {
      var rect = heroSection.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.active = true;
    });
    heroSection.addEventListener("touchend", function () {
      mouse.active = false;
    });

    window.addEventListener("resize", function () {
      resize();
      /* Re-distribute particles when window size changes */
      for (var i = 0; i < particles.length; i++) {
        if (particles[i].x > w || particles[i].y > h) {
          particles[i].reset();
        }
      }
    });

    animate(0);
  }

  /* Start when DOM is ready */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
