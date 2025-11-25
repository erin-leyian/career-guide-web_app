// js/script.js
// Load careers.json for quick local lookups (used by homepage if needed)
let careerData = {};

document.addEventListener("DOMContentLoaded", () => {
    // Load JSON
    fetch("data/careers.json")
        .then(response => response.json())
        .then(data => {
            careerData = data;
            console.log("Career data loaded:", careerData.careers);
        })
        .catch(error => {
            console.error("Error loading career data:", error);
        });

    // Homepage search - now works with ANY career (not just local JSON)
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");

    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", () => {
            const query = searchInput.value.trim();
            if (!query) return alert("Please enter a career");

            // Convert query to slug format
            const slug = query.toLowerCase().replace(/\s+/g, "-");

            // Redirect to career page (will handle both local and API search)
            window.location.href = `career.html?id=${encodeURIComponent(slug)}`;
        });

        // Allow Enter key to search
        searchInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                searchBtn.click();
            }
        });
    }
});

// Optional utility: local search & display on page (if you ever want to show results inline)
function searchCareerLocal(query) {
    const careersArray = (careerData && careerData.careers) || [];
    if (!careersArray.length) {
        displayMessage("Career data not loaded yet. Try again.");
        return null;
    }

    const formatted = query.toLowerCase();
    const foundCareer = careersArray.find(career => career.name.toLowerCase() === formatted);
    return foundCareer || null;
}

function displayCareerInfoInline(career) {
    const results = document.getElementById("results-section");
    if (!results) return;
    results.innerHTML = `
        <div class="result-card">
            <h2>${career.name}</h2>
            <p><strong>Description:</strong> ${career.description}</p>
            <p><strong>Salary Range:</strong> ${career.salary}</p>
            <p><strong>Key Skills:</strong></p>
            <ul>
                ${career.skills.map(skill => `<li>${skill}</li>`).join("")}
            </ul>
            <p><strong>Related Careers:</strong></p>
            <ul>
                ${career.related.map(item => `<li>${item}</li>`).join("")}
            </ul>
        </div>
    `;
}

function displayMessage(msg) {
    const results = document.getElementById("results-section");
    if (!results) return;
    results.innerHTML = `
        <div class="result-card">
            <p>${msg}</p>
        </div>
    `;
}