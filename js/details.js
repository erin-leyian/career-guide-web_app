// js/details.js

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("careerSearch");
    const searchBtn = document.getElementById("apiSearchBtn");
    const resultsContainer = document.getElementById("job-results");
    const careerInfoContainer = document.getElementById("career-info");

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

    // 🔥 JSEARCH API INTEGRATION
    async function fetchJobs(query) {
        const url = `http://localhost:5000/api/jobs?q=${encodeURIComponent(query)}`;

        careerInfoContainer.innerHTML = "<p>🔍 Searching for live jobs...</p>";

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

            console.log("Jobs from backend:", data);

            // Check if there's an error from backend
            if (data.error) {
                careerInfoContainer.innerHTML = `<p class="error-box">❌ ${data.error}</p>`;
                return;
            }

            // Check if jobs exist
            if (!data.data || data.data.length === 0) {
                careerInfoContainer.innerHTML = "<p>No live job postings found for this career.</p>";
                return;
            }

            // Display jobs
            careerInfoContainer.innerHTML = "<h2>🌐 Live Job Opportunities</h2>";

            data.data.slice(0, 10).forEach(job => {
                const jobDiv = document.createElement("div");
                jobDiv.classList.add("job-card");

                const description = job.job_description 
                    ? job.job_description.substring(0, 200) + "..." 
                    : "No description available";

                const location = job.job_city && job.job_country 
                    ? `${job.job_city}, ${job.job_country}` 
                    : job.job_city || job.job_country || "Remote/Unknown";

                jobDiv.innerHTML = `
                    <h3>${job.job_title || "Untitled Position"}</h3>
                    <p><strong>Company:</strong> ${job.employer_name || "Unknown"}</p>
                    <p><strong>Location:</strong> ${location}</p>
                    <p>${description}</p>
                    ${job.job_apply_link ? `<a href="${job.job_apply_link}" target="_blank" class="apply-btn">Apply Now →</a>` : ""}
                `;

                careerInfoContainer.appendChild(jobDiv);
            });

        } catch (error) {
            console.error("Error fetching jobs:", error);
            careerInfoContainer.innerHTML = `
                <div class="error-box">
                    <p>❌ Error loading live jobs. Please check:</p>
                    <ul>
                        <li>Is the Flask server running? (python server.py)</li>
                        <li>Is the API key valid?</li>
                        <li>Check browser console for details</li>
                    </ul>
                </div>
            `;
        }
    }
});