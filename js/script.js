//********************LOADER************************//
$(window).on("load", function () {
  "use strict";
  setTimeout(function () {
    $(".loader1").fadeOut(800);
  }, 1000);
});

/////////////////////////
// Facts fetching logic (with animation restart)
/////////////////////////
$(function () {
  "use strict";

  // Selectors for the two text pieces to replace
  var $label = $(".admission-text .sub-heading");
  var $factEl = $(".admission-text .main-heading");
  var $btn = $(".admission-text .blue-btn");

  // Accessibility: announce updates to screen readers
  $factEl.attr("role", "status").attr("aria-live", "polite");

  // Helper to update UI label
  function setLabel(isRandom) {
    $label.text(isRandom ? "Random Fact" : "Today's Fact");
  }

  // Helper that sets text AND restarts the CSS animation
  function animateAndSetFact(text) {
    if (!$factEl.length) return;

    // Remove animation classes so they can be re-triggered
    $factEl.removeClass("animated fadeInUp");

    // Update the text content
    $factEl.text(text);

    // Force reflow to allow re-adding the classes to restart animation
    // Accessing offsetWidth forces a reflow
    // eslint-disable-next-line no-unused-expressions
    $factEl[0].offsetWidth;

    // Re-add the animation classes (animation will run again)
    $factEl.addClass("animated fadeInUp");
  }

  // Generic fetch helper
  function fetchFact(url, isRandom) {
    // show temporary state
    setLabel(isRandom);
    animateAndSetFact("Loading fact...");

    // disable button while fetching
    $btn.prop("disabled", true).addClass("disabled");

    // Add language param to ensure English text
    var fetchUrl =
      url.indexOf("?") === -1 ? url + "?language=en" : url + "&language=en";

    fetch(fetchUrl)
      .then(function (res) {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(function (data) {
        if (data && data.text) {
          animateAndSetFact(data.text);
        } else {
          animateAndSetFact("No fact found in the response.");
          console.warn("Unexpected API response:", data);
        }
      })
      .catch(function (err) {
        console.error("Failed to fetch fact:", err);
        animateAndSetFact("Could not fetch fact. Please try again.");
      })
      .finally(function () {
        $btn.prop("disabled", false).removeClass("disabled");
      });
  }

  // 1) On page load: fetch today's fact
  fetchFact("https://uselessfacts.jsph.pl/api/v2/facts/today", false);

  // 2) On clicking "Another Fact": fetch a random fact
  $btn.on("click", function (e) {
    e.preventDefault();
    fetchFact("https://uselessfacts.jsph.pl/api/v2/facts/random", true);
  });
});
