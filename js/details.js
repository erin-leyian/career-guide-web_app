// js/details.js

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("careerSearch");
    const searchBtn = document.getElementById("apiSearchBtn");
    const resultsContainer = document.getElementById("job-results");

    let careers = [];

    // Reusable error message UI
    function showError(message) {
        resultsContainer.innerHTML = `
            <div class="error-box">
                <p>⚠️ ${message}</p>
            </div>
        `;
    }

    // Load careers.json with error handling
    fetch("data/careers.json")
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to load careers.json");
            }
            return res.json();
        })
        .then(data => {
            if (!data || !Array.isArray(data.careers)) {
                throw new Error("careers.json format is invalid.");
            }

            careers = data.careers;
            loadCareerFromURL();
        })
        .catch(err => {
            console.error(err);
            showError("Could not load career data. Please try again later.");
        });

    // Load career if URL contains ?id=
    function loadCareerFromURL() {
        const params = new URLSearchParams(window.location.search);
        const careerId = params.get("id");

        if (!careerId) return;

        const formattedName = careerId.replace(/-/g, " ").toLowerCase();
        const career = careers.find(c => c.name.toLowerCase() === formattedName);

        if (!career) {
            showError(`No results found for "${formattedName}".`);
            return;
        }

        displayCareer(career);
    }

    // Render full details
    function displayCareer(career) {
        // validate fields
        if (!career.name || !career.description) {
            showError("Career information is incomplete.");
            return;
        }

        resultsContainer.innerHTML = `
            <div class="result-card">
                <h2>${career.name}</h2>
                <p>${career.description}</p>

                <h3>Skills Required:</h3>
                <ul>${(career.skills || []).map(s => `<li>${s}</li>`).join("")}</ul>

                <h3>Salary Range:</h3>
                <p>${career.salary || "Not available"}</p>

                <h3>Related Careers:</h3>
                <ul>${(career.related || []).map(r => `<li>${r}</li>`).join("")}</ul>
            </div>
        `;
    }

    // Manual search
    function searchCareer() {
        const query = searchInput.value.trim().toLowerCase();

        if (!query) {
            showError("Please enter a career before searching.");
            return;
        }

        const matches = careers.filter(c =>
            c.name.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            showError(`No careers found matching "${query}".`);
            return;
        }

        resultsContainer.innerHTML = "";
        matches.forEach(displayCareer);
    }

    // Button + enter key
    searchBtn?.addEventListener("click", searchCareer);
    searchInput?.addEventListener("keyup", e => {
        if (e.key === "Enter") searchCareer();
    });
});
