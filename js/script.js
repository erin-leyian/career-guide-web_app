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

  // Homepage search using actual JSON data
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return alert("Please enter a career");

        fetch("data/careers.json")
            .then(res => res.json())
            .then(data => {
                if (!data || !Array.isArray(data.careers)) {
                    alert("Career list unavailable.");
                    return;
                }

                // find the career by name (case-insensitive)
                const result = data.careers.find(c =>
                    c.name.toLowerCase() === query
                );

                if (!result) {
                    alert("Career not found.");
                    return;
                }

                // convert actual name to slug
                const slug = result.name.toLowerCase().replace(/\s+/g, "-");

                // redirect to career page
                window.location.href = `career.html?id=${encodeURIComponent(slug)}`;
            })
            .catch(err => {
                console.error("Error loading careers:", err);
                alert("Could not search at the moment.");
            });
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
