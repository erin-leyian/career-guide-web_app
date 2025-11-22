// js/sidebar.js
// DARK MODE TOGGLE (robust)
(function () {
    const themeSwitch = document.getElementById("themeSwitch");

    // Only run if the toggle exists on the page
    if (!themeSwitch) return;

    // Load saved theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        themeSwitch.checked = true;
    } else {
        // ensure if not set we remove any leftover
        document.body.classList.remove("dark");
    }

    // Toggle event
    themeSwitch.addEventListener("change", () => {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
})();
