// js/details.js

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("careerSearch");
    const searchBtn = document.getElementById("apiSearchBtn");
    const resultsContainer = document.getElementById("job-results");

    let careers = [];

    function showError(message) {
        resultsContainer.innerHTML = `
            <div class="error-box">
                <p>⚠️ ${message}</p>
            </div>
        `;
    }

    // Load careers.json
    fetch("data/careers.json")
        .then(res => res.json())
        .then(data => {
            careers = data.careers;
            loadCareerFromURL();
        })
        .catch(err => showError("Could not load local career data."));

    function loadCareerFromURL() {
        const params = new URLSearchParams(window.location.search);
        const careerId = params.get("id");

        if (!careerId) return;

        const formatted = careerId.replace(/-/g, " ").toLowerCase();
        const career = careers.find(c => c.name.toLowerCase() === formatted);

        if (!career) {
            showError(`No results found for "${formatted}".`);
            return;
        }

        displayCareer(career);

        // 🔥 Fetch live jobs automatically for this career
        fetchJobs(career.name);
    }

    function displayCareer(career) {
        resultsContainer.innerHTML = `
            <div class="result-card">
                <h2>${career.name}</h2>
                <p>${career.description}</p>

                <h3>Skills Required:</h3>
                <ul>${career.skills.map(s => `<li>${s}</li>`).join("")}</ul>

                <h3>Salary Range:</h3>
                <p>${career.salary}</p>

                <h3>Related Careers:</h3>
                <ul>${career.related.map(r => `<li>${r}</li>`).join("")}</ul>
            </div>
        `;
    }

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

        // 🔥 Also fetch live jobs from JSearch
        fetchJobs(query);
    }

    searchBtn.addEventListener("click", searchCareer);
    searchInput.addEventListener("keyup", e => {
        if (e.key === "Enter") searchCareer();
    });
});


//  JSEARCH (NO API KEY VERSION)
// Public demo endpoint

async function fetchJobs(query) {
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=1`;

    const jobsContainer = document.getElementById("career-info");
    jobsContainer.innerHTML = "<p>Searching for live jobs...</p>";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-rapidapi-host": "jsearch.p.rapidapi.com"
            }
        });

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            jobsContainer.innerHTML = "<p>No live job postings found.</p>";
            return;
        }

        jobsContainer.innerHTML = "<h2>Live Job Opportunities</h2>";

        data.data.forEach(job => {
            const jobDiv = document.createElement("div");
            jobDiv.classList.add("job-card");

            jobDiv.innerHTML = `
                <h3>${job.job_title}</h3>
                <p><strong>Company:</strong> ${job.employer_name}</p>
                <p><strong>Location:</strong> ${job.job_city || "Unknown"}</p>
                <p>${job.job_description.substring(0, 200)}...</p>
                <a href="${job.job_apply_link}" target="_blank" class="apply-btn">Apply</a>
            `;

            jobsContainer.appendChild(jobDiv);
        });

    } catch (error) {
        console.error(error);
        jobsContainer.innerHTML = "<p>Error loading live jobs.</p>";
    }
}
