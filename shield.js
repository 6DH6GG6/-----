
// shield.js

(function () {
  "use strict";

  // =========================
  // Disable Right Click
  // =========================
  document.addEventListener("contextmenu", e => {
    e.preventDefault();
  });

  // =========================
  // Disable Select
  // =========================
  document.addEventListener("selectstart", e => {
    e.preventDefault();
  });

  // =========================
  // Disable Copy
  // =========================
  document.addEventListener("copy", e => {
    e.preventDefault();
  });

  // =========================
  // DevTools Detect
  // =========================
  function detectDevTools() {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;

    if (widthThreshold || heightThreshold) {

      document.body.innerHTML = `
      <div style="
        position:fixed;
        inset:0;
        background:#000;
        color:red;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:30px;
        z-index:999999;
        font-family:sans-serif;
      ">
        ACCESS DENIED
      </div>
      `;

      while (true) {
        debugger;
      }
    }
  }

  setInterval(detectDevTools, 1000);

  // =========================
  // Fake Console Errors
  // =========================
  setInterval(() => {
    console.error(
      "Uncaught TypeError: Cannot read properties of undefined"
    );

    console.warn(
      "Error with Permissions-Policy header"
    );

    console.error(
      "Cannot set properties of null (setting 'style')"
    );

  }, 3000);

  // =========================
  // Block Hotkeys
  // =========================
  document.addEventListener("keydown", function (e) {

    // F12
    if (e.key === "F12") {
      e.preventDefault();
    }

    // CTRL+SHIFT+I
    if (e.ctrlKey && e.shiftKey && e.key === "I") {
      e.preventDefault();
    }

    // CTRL+SHIFT+J
    if (e.ctrlKey && e.shiftKey && e.key === "J") {
      e.preventDefault();
    }

    // CTRL+U
    if (e.ctrlKey && e.key === "u") {
      e.preventDefault();
    }

  });

  // =========================
  // Console Flood
  // =========================
  setInterval(() => {
    console.clear();

    for (let i = 0; i < 50; i++) {
      console.log(
        "%cSYSTEM SHIELD ACTIVE",
        "color:red;font-size:20px;font-weight:bold"
      );
    }

  }, 2000);

})();
