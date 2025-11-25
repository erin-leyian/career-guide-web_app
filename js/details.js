// js/details.js - Enhanced version with statistics

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
        careerInfoContainer.innerHTML = "";
    }

    // Load careers.json
    fetch("data/careers.json")
        .then(res => res.json())
        .then(data => {
            careers = data.careers;
            loadCareerFromURL();
        })
        .catch(err => {
            console.warn("Could not load local career data, will use API only");
            loadCareerFromURL();
        });

    function loadCareerFromURL() {
        const params = new URLSearchParams(window.location.search);
        const careerId = params.get("id");

        if (!careerId) return;

        const formatted = careerId.replace(/-/g, " ").toLowerCase();
        const career = careers.find(c => c.name.toLowerCase() === formatted);

        if (career) {
            displayCareer(career);
            fetchJobs(career.name);
        } else {
            resultsContainer.innerHTML = `
                <div class="result-card">
                    <h2>${formatted.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h2>
                    <p>🔍 Searching for live job opportunities and market data...</p>
                </div>
            `;
            fetchJobs(formatted);
        }
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
        const query = searchInput.value.trim();

        if (!query) {
            showError("Please enter a career before searching.");
            return;
        }

        const queryLower = query.toLowerCase();
        const matches = careers.filter(c =>
            c.name.toLowerCase().includes(queryLower)
        );

        if (matches.length > 0) {
            resultsContainer.innerHTML = "";
            matches.forEach(displayCareer);
            fetchJobs(matches[0].name);
        } else {
            resultsContainer.innerHTML = `
                <div class="result-card">
                    <h2>${query}</h2>
                    <p>This career is not in our local database. Searching for live job opportunities...</p>
                </div>
            `;
            fetchJobs(query);
        }
    }

    searchBtn.addEventListener("click", searchCareer);
    searchInput.addEventListener("keyup", e => {
        if (e.key === "Enter") searchCareer();
    });

    // 🔥 ENHANCED API INTEGRATION with Statistics
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

            if (data.error) {
                careerInfoContainer.innerHTML = `<div class="error-box">❌ ${data.error}</div>`;
                return;
            }

            if (!data.data || data.data.length === 0) {
                careerInfoContainer.innerHTML = `
                    <div style="padding: 20px; background: var(--card-bg); border-radius: 12px; text-align: center;">
                        <p>No live job postings found for "${query}".</p>
                        <p style="font-size: 0.9em; opacity: 0.7; margin-top: 10px;">Try searching with different keywords or a more general job title.</p>
                    </div>
                `;
                return;
            }

            // Calculate statistics
            const totalJobs = data.data.length;
            const locations = [...new Set(data.data.map(j => j.job_country).filter(Boolean))];
            const companies = [...new Set(data.data.map(j => j.employer_name).filter(Boolean))];
            
            // Get salary data if available
            const salaries = data.data
                .filter(j => j.job_min_salary && j.job_max_salary)
                .map(j => ({ min: j.job_min_salary, max: j.job_max_salary }));
            
            const avgMinSalary = salaries.length > 0 
                ? Math.round(salaries.reduce((sum, s) => sum + s.min, 0) / salaries.length)
                : null;
            const avgMaxSalary = salaries.length > 0
                ? Math.round(salaries.reduce((sum, s) => sum + s.max, 0) / salaries.length)
                : null;

            // Display statistics header
            careerInfoContainer.innerHTML = `
                <div style="background: var(--card-bg); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--border-color);">
                    <h2>🌐 Live Job Market for "${query}"</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                        <div style="background: var(--hover-bg); padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 2rem; font-weight: bold; color: var(--accent-color);">${totalJobs}</div>
                            <div style="opacity: 0.8; font-size: 0.9rem;">Open Positions</div>
                        </div>
                        <div style="background: var(--hover-bg); padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 2rem; font-weight: bold; color: var(--accent-color);">${companies.length}</div>
                            <div style="opacity: 0.8; font-size: 0.9rem;">Companies Hiring</div>
                        </div>
                        <div style="background: var(--hover-bg); padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 2rem; font-weight: bold; color: var(--accent-color);">${locations.length}</div>
                            <div style="opacity: 0.8; font-size: 0.9rem;">Countries</div>
                        </div>
                        ${avgMinSalary && avgMaxSalary ? `
                        <div style="background: var(--hover-bg); padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 1.3rem; font-weight: bold; color: var(--accent-color);">$${avgMinSalary.toLocaleString()} - $${avgMaxSalary.toLocaleString()}</div>
                            <div style="opacity: 0.8; font-size: 0.9rem;">Avg. Salary Range</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <h3 style="margin-top: 30px; margin-bottom: 15px;">📋 Job Listings</h3>
            `;

            // Display job cards
            data.data.slice(0, 10).forEach(job => {
                const jobDiv = document.createElement("div");
                jobDiv.classList.add("job-card");

                const description = job.job_description 
                    ? job.job_description.substring(0, 250) + "..." 
                    : "No description available";

                const location = job.job_city && job.job_country 
                    ? `${job.job_city}, ${job.job_country}` 
                    : job.job_city || job.job_country || "Remote/Unknown";

                const salary = job.job_min_salary && job.job_max_salary
                    ? `💰 $${job.job_min_salary.toLocaleString()} - $${job.job_max_salary.toLocaleString()}`
                    : "";

                const employmentType = job.job_employment_type 
                    ? `<span style="display: inline-block; background: var(--accent-color); color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; margin-left: 10px;">${job.job_employment_type}</span>`
                    : "";

                jobDiv.innerHTML = `
                    <h3>${job.job_title || "Untitled Position"}${employmentType}</h3>
                    <p><strong>Company:</strong> ${job.employer_name || "Unknown"}</p>
                    <p><strong>Location:</strong> ${location}</p>
                    ${salary ? `<p><strong>${salary}</strong></p>` : ""}
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
                    <ul style="margin-top: 10px; text-align: left;">
                        <li>Is the Flask server running? (python server.py)</li>
                        <li>Is the API key valid?</li>
                        <li>Check browser console for details</li>
                    </ul>
                </div>
            `;
        }
    }
});