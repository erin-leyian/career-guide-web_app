// DARK MODE TOGGLE
const themeSwitch = document.getElementById("themeSwitch");

// Only run if the toggle exists on the page
if (themeSwitch) {

    // Load saved theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        themeSwitch.checked = true;
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

}
