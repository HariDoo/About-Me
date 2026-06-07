/**
 * Dynamic "BreathDearMedusae" (Jellyfish) Particle Grid Background.
 * Mathematical replica of the antigravity.google landing page background.
 *
 * Mobile & Responsiveness Updates:
 *   - Proportional jellyfish radius scaling based on viewport size (220px on desktop, 115px on mobile).
 *   - Global touchstart and touchmove support for reactive touches.
 *   - High-DPI screen scaling (devicePixelRatio) for crispness.
 *   - Static, tiny circular dots outside the hover zone.
 */
(function () {
  "use strict";

  var GRID_SPACING = 25; // Dense grid layout
  var SCALE = 85; // 85 pixels = 1 coordinate unit

  // Shaders Defaults
  var U_PARTICLE_BASE_SIZE = 0.007; // Tiny base size for sharp background dots
  var U_PARTICLE_ACTIVE_SIZE = 0.024; // Compact growth size under cursor
  var U_BLOB_SCALE_X = 1.0;
  var U_STRETCH_SCALE = 0.012;

  // Global mouse/touch state shared by all canvases to retain position across sections and scrolls
  if (!window.globalDotGridMouse) {
    window.globalDotGridMouse = {
      clientX: -9999,
      clientY: -9999,
      active: false,
    };

    window.addEventListener("mousemove", function (e) {
      window.globalDotGridMouse.clientX = e.clientX;
      window.globalDotGridMouse.clientY = e.clientY;
      window.globalDotGridMouse.active = true;
    });

    window.addEventListener("touchstart", function (e) {
      if (e.touches.length > 0) {
        window.globalDotGridMouse.clientX = e.touches[0].clientX;
        window.globalDotGridMouse.clientY = e.touches[0].clientY;
        window.globalDotGridMouse.active = true;
      }
    });

    window.addEventListener("touchmove", function (e) {
      if (e.touches.length > 0) {
        window.globalDotGridMouse.clientX = e.touches[0].clientX;
        window.globalDotGridMouse.clientY = e.touches[0].clientY;
        window.globalDotGridMouse.active = true;
      }
    });
  }

  // Google Brand Colors (Vibrant)
  var C_BASE = { r: 66, g: 133, b: 245 }; // Google Blue base
  var C_BLUE = { r: 66, g: 133, b: 245 }; // Google Blue
  var C_RED = { r: 235, g: 66, b: 54 }; // Google Red
  var C_YELLOW = { r: 250, g: 186, b: 3 }; // Google Yellow

  function smoothstep(edge0, edge1, x) {
    var t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  function mixColors(c1, c2, weight) {
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * weight),
      g: Math.round(c1.g + (c2.g - c1.g) * weight),
      b: Math.round(c1.b + (c2.b - c1.b) * weight),
    };
  }

  function initDotGrid(section) {
    var canvas = document.createElement("canvas");
    canvas.className = "dot-grid-canvas";
    section.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var w = 0,
      h = 0;
    var dots = [];
    var localMouse = { x: -9999, y: -9999, active: false };
    var currentMouseRadius = 220; // Default desktop radius

    function resize() {
      w = section.offsetWidth;
      h = section.offsetHeight;

      // Proportional active radius adjustment for mobile viewports
      currentMouseRadius = window.innerWidth < 768 ? 115 : 220;

      // High-DPI screen sharp scaling (devicePixelRatio support)
      var dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";

      ctx.restore();
      ctx.save();
      ctx.scale(dpr, dpr);

      // Reinitialize grid dots
      dots = [];
      var cols = Math.ceil(w / GRID_SPACING);
      var rows = Math.ceil(h / GRID_SPACING);

      var startX = (w - (cols - 1) * GRID_SPACING) / 2;
      var startY = (h - (rows - 1) * GRID_SPACING) / 2;

      for (var c = 0; c < cols; c++) {
        for (var r = 0; r < rows; r++) {
          var originX = startX + c * GRID_SPACING;
          var originY = startY + r * GRID_SPACING;
          dots.push({
            originX: originX,
            originY: originY,
            x: originX,
            y: originY,
            vx: 0,
            vy: 0,
            radius: 0,
            alpha: 0,
            phi: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    resize();
    window.addEventListener("resize", resize);

    // Intersection observer to pause calculations when section is out of screen
    var isVisible = false;
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(
        function (entries) {
          isVisible = entries[0].isIntersecting;
        },
        { threshold: 0 },
      );
      obs.observe(section);
    } else {
      isVisible = true;
    }

    function animate(time) {
      if (isVisible) {
        ctx.clearRect(0, 0, w, h);

        var timeSec = time * 0.001; // Seconds

        // Dynamic scroll-aware coordinate mapping
        var rect = canvas.getBoundingClientRect();
        localMouse.x = window.globalDotGridMouse.clientX - rect.left;
        localMouse.y = window.globalDotGridMouse.clientY - rect.top;
        localMouse.active = window.globalDotGridMouse.active;

        for (var i = 0; i < dots.length; i++) {
          var dot = dots[i];

          // 1. Calculate proximity using original static coordinates
          var rxOrigin = dot.originX / SCALE - localMouse.x / SCALE;
          var ryOrigin = dot.originY / SCALE - localMouse.y / SCALE;

          // Horizontal ellipse aspect ratio (scaleX = 1.3, scaleY = 1.0)
          var rxOriginScaled = rxOrigin / 1.3;
          var ryOriginScaled = ryOrigin / 1.0;
          var dMouseOrigin = Math.sqrt(
            rxOriginScaled * rxOriginScaled + ryOriginScaled * ryOriginScaled,
          );

          var b = Math.sin(timeSec * 0.8); // Breathing cycle
          var angle = Math.atan2(ryOrigin, rxOrigin);
          var shapeFactor =
            Math.sin(angle * 2.0 + timeSec * 0.4) * 0.5 +
            Math.cos(angle * 3.0 - timeSec * 0.2) * 0.25;
          var rCurrent = 2.4 + b * 0.5 + shapeFactor * 0.75; // Jellyfish bell radius

          // Convert current local viewport mouse radius to normalized coordinate unit
          var normalizedMouseRadius = currentMouseRadius / SCALE;

          // Active zone rim influence (smooth decay)
          var vSize = smoothstep(
            1.8,
            0.0,
            Math.abs(dMouseOrigin - rCurrent) * (2.2 / normalizedMouseRadius),
          );

          var finalX = dot.originX;
          var finalY = dot.originY;

          // Calculations are only applied inside active rim zone
          if (vSize > 0.001) {
            // Alive Flow (Drift)
            var tDrift = timeSec * 0.15;
            var pxUnit = dot.originX / SCALE;
            var pyUnit = dot.originY / SCALE;
            var dxDrift =
              Math.sin(tDrift + pyUnit * 0.5) +
              Math.sin(tDrift * 0.5 + pyUnit * 2.0);
            var dyDrift =
              Math.cos(tDrift + pxUnit * 0.5) +
              Math.cos(tDrift * 0.5 + pxUnit * 2.0);
            var driftX = dot.originX + dxDrift * 0.25 * SCALE * vSize;
            var driftY = dot.originY + dyDrift * 0.25 * SCALE * vSize;

            // Recalculate relative vector using drifted coordinates
            var rx = driftX / SCALE - localMouse.x / SCALE;
            var ry = driftY / SCALE - localMouse.y / SCALE;
            var distTrue = Math.sqrt(rx * rx + ry * ry);
            var dirX = distTrue > 0.0001 ? rx / distTrue : 1;
            var dirY = distTrue > 0.0001 ? ry / distTrue : 0;

            // Halo Push
            var pushAmt = (b * 0.25 + 0.25) * 0.5;
            var haloX = driftX + dirX * pushAmt * vSize * SCALE;
            var haloY = driftY + dirY * pushAmt * vSize * SCALE;

            // Outer Oscillation Waves
            var oscOuter = Math.sin(
              timeSec * 2.6 + (driftX / SCALE) * 0.6 + (driftY / SCALE) * 0.6,
            );
            finalX = haloX + dirX * oscOuter * 0.76 * vSize * SCALE;
            finalY = haloY + dirY * oscOuter * 0.76 * vSize * SCALE;
          }

          // 2. Particle Size and Shapes (Circle by default, stretches to ellipse on hover)
          var sBase =
            U_PARTICLE_BASE_SIZE +
            Math.sin(timeSec + dot.originX / SCALE) * 0.002 * vSize;
          var currentScale = sBase + vSize * U_PARTICLE_ACTIVE_SIZE;
          var sizePixels = currentScale * SCALE;

          var stretch =
            vSize * (U_STRETCH_SCALE * (currentMouseRadius / 220.0)) * SCALE;

          // Interpolate Y-scale from 1.0 (circle) to 0.6 (oval) based on rim influence vSize
          var currentBlobScaleY =
            mixColors({ r: 100, g: 0, b: 0 }, { r: 60, g: 0, b: 0 }, vSize).r /
            100.0;

          // 3. Smooth rotation wiggling (only active near cursor)
          var finalAngle = 0;
          if (vSize > 0.01) {
            var osc = 0.5 + 0.5 * Math.sin(timeSec * 0.6 + dot.phi);
            var speedScale =
              mixColors({ r: 55, g: 0, b: 0 }, { r: 135, g: 0, b: 0 }, osc).r /
              100.0;
            var jitterScale =
              mixColors({ r: 70, g: 0, b: 0 }, { r: 145, g: 0, b: 0 }, osc).r /
              100.0;
            var thetaJitter =
              Math.sin(
                timeSec * 0.1 * speedScale +
                  (dot.originX / SCALE) * 0.35 +
                  (dot.originY / SCALE) * 0.35,
              ) *
              (0.2 * jitterScale);
            finalAngle = angle + thetaJitter;
          }

          // 4. Alpha transition (0.18 base alpha, up to 0.90 rim alpha)
          var alphaTarget = localMouse.active ? smoothstep(0.1, 0.8, vSize) : 0;
          var finalAlpha =
            mixColors({ r: 18, g: 0, b: 0 }, { r: 90, g: 0, b: 0 }, alphaTarget)
              .r / 100.0;
          dot.alpha += (finalAlpha - dot.alpha) * 0.15;

          // 5. Draw the particle
          if (dot.alpha > 0.01) {
            ctx.save();
            ctx.translate(finalX, finalY);
            if (finalAngle !== 0) ctx.rotate(finalAngle);

            var rxDraw = (sizePixels + stretch) * U_BLOB_SCALE_X;
            var ryDraw = sizePixels * currentBlobScaleY;

            ctx.beginPath();
            ctx.ellipse(0, 0, rxDraw, ryDraw, 0, 0, Math.PI * 2);

            // Google brand colors animation cycle based on coordinates
            var p1 = Math.sin((finalX / SCALE) * 0.8 + timeSec * 1.2);
            var p2 = Math.sin((finalY / SCALE) * 0.8 + timeSec * 0.96 + p1);
            var w1 = p1 * 0.5 + 0.5;
            var w2 = p2 * 0.5 + 0.5;

            var activeColor = mixColors(C_BLUE, C_RED, w1);
            activeColor = mixColors(activeColor, C_YELLOW, w2);

            // Blend base color with active color based on rim influence
            var color = mixColors(C_BASE, activeColor, alphaTarget);

            // Solid core
            ctx.fillStyle =
              "rgba(" +
              color.r +
              "," +
              color.g +
              "," +
              color.b +
              "," +
              dot.alpha +
              ")";
            ctx.fill();

            // Glowing Outer Halo (draws dynamically when active)
            if (vSize > 0.01) {
              ctx.beginPath();
              ctx.ellipse(0, 0, rxDraw * 1.2, ryDraw * 1.2, 0, 0, Math.PI * 2);
              ctx.fillStyle =
                "rgba(" +
                color.r +
                "," +
                color.g +
                "," +
                color.b +
                "," +
                dot.alpha * 0.08 +
                ")";
              ctx.fill();
            }

            ctx.restore();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  function init() {
    var sections = document.querySelectorAll(".dot-grid-bg");
    sections.forEach(function (sec) {
      initDotGrid(sec);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
