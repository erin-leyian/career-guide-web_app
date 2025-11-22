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


// JSEARCH API Integration

const apiKey = "c2378a5b74msh67b299ef526d6f4p17a3b9jsna686ed4fbb3d"; 

async function fetchJobs(query) {
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=1`;

    const options = {
        method: "GET",
        headers: {
            "x-rapidapi-key": "c2378a5b74msh67b299ef526d6f4p17a3b9jsna686ed4fbb3d",
            "x-rapidapi-host": "jsearch.p.rapidapi.com"
        }
    };

    const jobsContainer = document.getElementById("career-info");
    jobsContainer.innerHTML = "<p>Searching for live jobs...</p>";

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            jobsContainer.innerHTML = "<p>No live job postings found.</p>";
            return;
        }

        jobsContainer.innerHTML = "<h2>Live Job Opportunities</h2>";

        data.data.forEach(job => {
            const jobCard = document.createElement("div");
            jobCard.classList.add("job-card");

            jobCard.innerHTML = `
                <h3>${job.job_title}</h3>
                <p><strong>Company:</strong> ${job.employer_name}</p>
                <p><strong>Location:</strong> ${job.job_city || "Unknown"}</p>
                <p>${job.job_description.substring(0, 200)}...</p>
                <a href="${job.job_apply_link}" target="_blank" class="apply-btn">Apply</a>
            `;

            jobsContainer.appendChild(jobCard);
        });

    } catch (error) {
        console.error(error);
        jobsContainer.innerHTML = "<p>Error loading live jobs. Please try again later.</p>";
    }
}
