(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Initiate the wowjs
  new WOW().init();

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 45) {
      $(".navbar").addClass("sticky-top shadow-sm");
    } else {
      $(".navbar").removeClass("sticky-top shadow-sm");
    }
  });

  // Dropdown on mouse hover
  const $dropdown = $(".dropdown");
  const $dropdownToggle = $(".dropdown-toggle");
  const $dropdownMenu = $(".dropdown-menu");
  const showClass = "show";

  $(window).on("load resize", function () {
    if (this.matchMedia("(min-width: 992px)").matches) {
      $dropdown.hover(
        function () {
          const $this = $(this);
          $this.addClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "true");
          $this.find($dropdownMenu).addClass(showClass);
        },
        function () {
          const $this = $(this);
          $this.removeClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "false");
          $this.find($dropdownMenu).removeClass(showClass);
        }
      );
    } else {
      $dropdown.off("mouseenter mouseleave");
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    center: true,
    margin: 24,
    dots: true,
    loop: true,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });
})(jQuery);

// Handle form
const resultSection = document.getElementById("result-section");
resultSection.style.display = "none";
const adviceForm = document.getElementById("advice-form");
const submitBtn = document.getElementById("submit-btn");
const outputResult = document.getElementById("output-result");

const handleForm = (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.innerHTML = "Loading...";
  const formData = new FormData(adviceForm);
  const data = Object.fromEntries(formData.entries());
  const { ydestination, ylocation, ybudget, duration, message } = data;
  const promptObject = {
    ydestination,
    ylocation,
    ybudget,
    duration,
    message,
  };
  try {
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promptObject),
      redirect: "follow",
    };

    fetch("https://go-trip-api.onrender.com/generate", requestOptions)
      .then(async (response) => await response.text())
      .then((result) => {
        var formattedResponse = result.replace(/\"/g, "").replace(/\*/g, "");
        $(outputResult).html(formattedResponse);
        resultSection.style.display = "block";
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Plan My Trip";
      })
      .catch((error) => {
        console.log("error", error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Plan My Trip";
      });
  } catch (error) {
    console.log(error);
    submitBtn.disabled = false;
    submitBtn.innerHTML = "Plan My Trip";
  }
};

adviceForm.addEventListener("submit", handleForm);
