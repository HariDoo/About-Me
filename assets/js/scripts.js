/*
Theme Name: IAMX
Author: Trendy Theme
Author URL: trendytheme.net
*/

/*
    = Preloader
    = Animated scrolling / Scroll Up
    = Full Screen Slider
    = Sticky Menu
    = Back To Top
    = Countup
    = Progress Bar
    = More skill
    = Shuffle
    = Magnific Popup
    = Vidio auto play
    = Fit Vids

*/

jQuery(function ($) {
  "use strict";

  /* ---------------------------------------------- /*
     * Preloader
    /* ---------------------------------------------- */

  $(window).ready(function () {
    $("#pre-status").fadeOut();
    $("#tt-preloader").delay(350).fadeOut("slow");
  });

  // -------------------------------------------------------------
  // Animated scrolling / Scroll Up
  // -------------------------------------------------------------

  (function () {
    $("a[href*=#]").bind("click", function (e) {
      var anchor = $(this);
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $(anchor.attr("href")).offset().top,
          },
          1000,
        );
      e.preventDefault();
    });
  })();

  // -------------------------------------------------------------
  // Full Screen Slider
  // -------------------------------------------------------------
  (function () {
    $(".tt-fullHeight").height($(window).height());

    $(window).resize(function () {
      $(".tt-fullHeight").height($(window).height());
    });
  })();

  // -------------------------------------------------------------
  // Sticky Menu
  // -------------------------------------------------------------

  (function () {
    $(".header").sticky({
      topSpacing: 0,
    });

    $("body").scrollspy({
      target: ".navbar-custom",
      offset: 70,
    });
  })();

  // -------------------------------------------------------------
  // Back To Top
  // -------------------------------------------------------------

  (function () {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $(".scroll-up").fadeIn();
      } else {
        $(".scroll-up").fadeOut();
      }
    });
  })();

  // -------------------------------------------------------------
  // Countup
  // -------------------------------------------------------------
  $(".count-wrap").bind(
    "inview",
    function (event, visible, visiblePartX, visiblePartY) {
      if (visible) {
        $(this)
          .find(".timer")
          .each(function () {
            var $this = $(this);
            $({ Counter: 0 }).animate(
              { Counter: $this.text() },
              {
                duration: 2000,
                easing: "swing",
                step: function () {
                  $this.text(Math.ceil(this.Counter));
                  // Force browser repaint/reflow to fix WebKit background-clip text bug
                  $this.css("display", "inline-block");
                  var reflow = $this[0].offsetHeight;
                },
              },
            );
          });
        $(this).unbind("inview");
      }
    },
  );

  // -------------------------------------------------------------
  // Progress Bar
  // -------------------------------------------------------------

  $(".skill-progress").bind(
    "inview",
    function (event, visible, visiblePartX, visiblePartY) {
      if (visible) {
        $.each($("div.progress-bar"), function () {
          $(this).css("width", $(this).attr("aria-valuenow") + "%");
        });
        $(this).unbind("inview");
      }
    },
  );

  // -------------------------------------------------------------
  // More skill (Disabled - Unused Asset)
  // -------------------------------------------------------------
  /*
  $(".more-skill").bind("inview", function(
    event,
    visible,
    visiblePartX,
    visiblePartY
  ) {
    if (visible) {
      $(".chart").easyPieChart({
        //your configuration goes here
        easing: "easeOut",
        delay: 3000,
        barColor: "#68c3a3",
        trackColor: "rgba(255,255,255,0.2)",
        scaleColor: false,
        lineWidth: 8,
        size: 140,
        animate: 2000,
        onStep: function(from, to, percent) {
          this.el.children[0].innerHTML = Math.round(percent);
        }
      });
      $(this).unbind("inview");
    }
  });
  */

  // -------------------------------------------------------------
  // Shuffle (Disabled - Unused Asset)
  // -------------------------------------------------------------

  /*
  (function() {
    var $grid = $("#grid");

    $grid.shuffle({
      itemSelector: ".portfolio-item"
    });

    // reshuffle when user clicks a filter item
    $("#filter a").click(function(e) {
      e.preventDefault();

      // set active class
      $("#filter a").removeClass("active");
      $(this).addClass("active");

      // get group name from clicked item
      var groupName = $(this).attr("data-group");

      // reshuffle grid
      $grid.shuffle("shuffle", groupName);
    });
  })();
  */

  // -------------------------------------------------------------
  // Magnific Popup
  // -------------------------------------------------------------

  (function () {
    $(".image-link").magnificPopup({
      gallery: {
        enabled: true,
      },
      removalDelay: 300, // Delay in milliseconds before popup is removed
      mainClass: "mfp-with-zoom", // this class is for CSS animation below
      type: "image",
    });
  })();

  (function () {
    $(".popup-video").magnificPopup({
      disableOn: 700,
      type: "iframe",
      mainClass: "mfp-with-zoom",
      removalDelay: 300,
      preloader: false,
      fixedContentPos: false,
    });
  })();

  // -------------------------------------------------------------
  // Fit Vids (Disabled - Unused Asset)
  // -------------------------------------------------------------
  /*
  (function() {
    $(".video-container").fitVids();
  })();
  */

  // -------------------------------------------------------------
  // Vidio auto play (Disabled - Unused Asset)
  // -------------------------------------------------------------
  /*
  (function() {
    // Vimeo API: http://developer.vimeo.com/player/js-api

    var iframe = document.getElementById("nofocusvideo");
    // $f == Froogaloop
    var player = $(iframe);

    $(".modal").on("hidden.bs.modal", function() {
      player.api("pause");
    });

    $(".modal").on("shown.bs.modal", function() {
      player.api("play");
    });
  })();
  */

  // -------------------------------------------------------------
  // STELLAR FOR BACKGROUND SCROLLING
  // -------------------------------------------------------------

  $(window).load(function () {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    ) {
    } else {
      $.stellar({
        horizontalScrolling: false,
        responsive: true,
      });
    }
  });

  // -------------------------------------------------------------
  // WOW JS
  // -------------------------------------------------------------

  (function () {
    new WOW({
      mobile: false,
    }).init();
  })();

  // -------------------------------------------------------------
  // Contact Form
  // -------------------------------------------------------------

  (function () {
    var $form = $("#contactForm");
    if (!$form.length) return;

    var $submitBtn = $form.find("button[type='submit']");
    $submitBtn.prop("disabled", true);

    function checkFormValidity() {
      var nameVal = $.trim($("#name").val());
      var emailVal = $.trim($("#email").val());
      var messageVal = $.trim($("#message").val());
      var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      var isFormValid =
        nameVal.length > 0 &&
        emailRegex.test(emailVal) &&
        messageVal.length > 0;
      $submitBtn.prop("disabled", !isFormValid);
      if (isFormValid) {
        $submitBtn.addClass("valid-pulse");
      } else {
        $submitBtn.removeClass("valid-pulse");
      }
    }

    // Monitor all inputs in real-time, checking on input, change, typing, focus, and blur
    $("#name, #email, #message").on(
      "input change keyup keydown focus blur click",
      function () {
        checkFormValidity();
      },
    );

    // Run verification on load to support browser autocomplete/autofill
    $(window).on("load", function () {
      checkFormValidity();
    });

    // Check periodically for the first 3 seconds to catch delayed browser autofill
    var checkCount = 0;
    var autofillInterval = setInterval(function () {
      checkFormValidity();
      checkCount++;
      if (checkCount > 6) clearInterval(autofillInterval);
    }, 500);

    // Inline validation feedback on blur
    $("#name").on("blur", function () {
      var nameVal = $.trim($(this).val());
      if (!nameVal) {
        $(this).closest(".form-group").addClass("has-error");
        $(this).css("border-color", "#e74c3c");
        $("#nameError").text("Name is required.").show();
      } else {
        $(this).closest(".form-group").removeClass("has-error");
        $(this).css("border-color", "");
        $("#nameError").hide();
      }
    });

    $("#email").on("blur", function () {
      var emailVal = $.trim($(this).val());
      var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailVal) {
        $(this).closest(".form-group").addClass("has-error");
        $(this).css("border-color", "#e74c3c");
        $("#emailError").text("Email address is required.").show();
      } else if (!emailRegex.test(emailVal)) {
        $(this).closest(".form-group").addClass("has-error");
        $(this).css("border-color", "#e74c3c");
        $("#emailError")
          .text("Please enter a valid email address (e.g. user@example.com).")
          .show();
      } else {
        $(this).closest(".form-group").removeClass("has-error");
        $(this).css("border-color", "");
        $("#emailError").hide();
      }
    });

    // Clear errors as soon as they type valid inputs
    $("#name").on("input", function () {
      if ($.trim($(this).val())) {
        $(this).closest(".form-group").removeClass("has-error");
        $(this).css("border-color", "");
        $("#nameError").hide();
      }
    });

    $("#email").on("input", function () {
      var emailVal = $.trim($(this).val());
      var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (emailRegex.test(emailVal)) {
        $(this).closest(".form-group").removeClass("has-error");
        $(this).css("border-color", "");
        $("#emailError").hide();
      }
    });

    // Form Submission
    $form.on("submit", function (e) {
      e.preventDefault();

      var $this = $(this);

      // Clear old alerts
      $this.prevAll(".alert").remove();

      var nameVal = $.trim($("#name").val());
      var emailVal = $.trim($("#email").val());
      var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      var isValid = true;

      if (!nameVal) {
        $("#name").closest(".form-group").addClass("has-error");
        $("#name").css("border-color", "#e74c3c");
        $("#nameError").text("Name is required.").show();
        isValid = false;
      }

      if (!emailVal || !emailRegex.test(emailVal)) {
        $("#email").closest(".form-group").addClass("has-error");
        $("#email").css("border-color", "#e74c3c");
        $("#emailError").text("Please enter a valid email address.").show();
        isValid = false;
      }

      if (!isValid) {
        $this.find(".has-error:first .form-control").focus();
        return false;
      }

      var originalBtnText = $submitBtn.text();
      $submitBtn.text("Sending...").prop("disabled", true);

      $.ajax({
        url: $this.prop("action"),
        type: "POST",
        data: $this.serialize(),
        dataType: "json",
        headers: {
          Accept: "application/json",
        },
        success: function (response) {
          var successMsg =
            '<div class="alert alert-success" style="text-align:center; padding: 30px; font-size: 16px;"><strong>Thank You!</strong><br/> Your message has been sent successfully.<br/> I will get back to you soon!</div>';
          $this.before(successMsg);
          $this.slideUp(300);
        },
        error: function (xhr, status, error) {
          $this.before(
            '<div class="alert alert-danger"><strong>Error!</strong>&nbsp; Could not send message. Please try again or contact directly: harido2580@gmail.com</div>',
          );
          $submitBtn.text(originalBtnText).prop("disabled", false);
        },
      });

      return false;
    });
  })();

  // -------------------------------------------------------------
  // Share Portfolio Widget Interaction
  // -------------------------------------------------------------
  (function () {
    var $sharePageBtn = $("#sharePageBtn");
    var $shareDropdown = $("#shareDropdown");
    if (!$sharePageBtn.length || !$shareDropdown.length) return;

    var currentUrl = window.location.href;
    var pageTitle = "Hari Prasath V | AEM Developer Portfolio";
    var shareText =
      "Check out Hari Prasath's AEM Developer and Web Portfolio: " + currentUrl;

    // Update social link hrefs dynamically
    $("#shareWhatsAppBtn").attr(
      "href",
      "https://api.whatsapp.com/send?text=" + encodeURIComponent(shareText),
    );
    $("#shareLinkedInBtn").attr(
      "href",
      "https://www.linkedin.com/sharing/share-offsite/?url=" +
        encodeURIComponent(currentUrl),
    );
    $("#shareTwitterBtn").attr(
      "href",
      "https://twitter.com/intent/tweet?url=" +
        encodeURIComponent(currentUrl) +
        "&text=" +
        encodeURIComponent(pageTitle),
    );

    // Toggle dropdown on share button click
    $sharePageBtn.on("click", function (e) {
      e.stopPropagation();
      $shareDropdown.toggleClass("show");
    });

    // Close dropdown if clicked outside
    $(document).on("click", function (e) {
      if (!$(e.target).closest(".share-widget").length) {
        $shareDropdown.removeClass("show");
      }
    });

    // Copy portfolio link to clipboard
    $("#copyLinkBtn").on("click", function (e) {
      e.preventDefault();
      var urlToCopy = window.location.href;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(urlToCopy).then(function() {
          showShareTooltip("Link copied to clipboard!");
          $shareDropdown.removeClass("show");
        }).catch(function() {
          showShareTooltip("Could not copy link. Please copy manually.");
          $shareDropdown.removeClass("show");
        });
      } else {
        // Fallback for older browsers
        var tempInput = document.createElement("textarea");
        tempInput.value = urlToCopy;
        
        // Prevent scrolling to element by positioning it fixed at the top-left of viewport
        tempInput.style.position = "fixed";
        tempInput.style.top = "0";
        tempInput.style.left = "0";
        tempInput.style.width = "2px";
        tempInput.style.height = "2px";
        tempInput.style.padding = "0";
        tempInput.style.border = "none";
        tempInput.style.outline = "none";
        tempInput.style.boxShadow = "none";
        tempInput.style.background = "transparent";
        tempInput.style.opacity = "0";
        tempInput.setAttribute("readonly", ""); // Prevent keyboard popup
        
        document.body.appendChild(tempInput);
        
        tempInput.select();
        tempInput.setSelectionRange(0, 99999); // For mobile
        
        var successful = false;
        try {
          successful = document.execCommand("copy");
        } catch (err) {}
        
        document.body.removeChild(tempInput);
        
        if (successful) {
          showShareTooltip("Link copied to clipboard!");
        } else {
          showShareTooltip("Could not copy link. Please copy manually.");
        }
        $shareDropdown.removeClass("show");
      }
    });

    function showShareTooltip(msg) {
      // Remove existing tooltip if any
      $(".share-tooltip").remove();

      var $tooltip = $('<div class="share-tooltip">' + msg + "</div>");
      $(".share-widget").append($tooltip);

      // Trigger reflow/animation
      setTimeout(function () {
        $tooltip.addClass("show");
      }, 50);

      // Hide and remove after 2.5 seconds
      setTimeout(function () {
        $tooltip.removeClass("show");
        setTimeout(function () {
          $tooltip.remove();
        }, 300);
      }, 2500);
    }
  })();

  // -------------------------------------------------------------
  // Soulful Hover Animations Trigger
  // -------------------------------------------------------------
  (function () {
    // Make the words celebrate when hovering the Get In Touch button
    $(".project-cta-btn")
      .on("mouseenter", function () {
        $(".project-cta-banner").addClass("celebrate");
      })
      .on("mouseleave", function () {
        $(".project-cta-banner").removeClass("celebrate");
      });
  })();
});
