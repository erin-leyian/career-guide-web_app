// js/details.js
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const careerInfoBox = document.getElementById("career-info");
    const jobResultsBox = document.getElementById("job-results");

    // helper to show message
    function showMessage(target, html) {
        if (!target) return;
        target.innerHTML = `<div class="result-card">${html}</div>`;
    }

    if (!id) {
        showMessage(careerInfoBox, "<p>No career specified. Use the search or choose a career from the list.</p>");
        return;
    }

    fetch("data/careers.json")
        .then(res => res.json())
        .then(data => {
            if (!data || !Array.isArray(data.careers)) {
                showMessage(careerInfoBox, "<p>Career data unavailable.</p>");
                return;
            }

            const career = data.careers.find(c => c.name.toLowerCase().replace(/ /g, "-") === id);

            if (!career) {
                showMessage(careerInfoBox, `<p>Career not found in local data for "<strong>${id}</strong>". Try another search.</p>`);
                // (Optional) here you could trigger an API search to fetch remote info
                return;
            }

            // display career info
            if (careerInfoBox) {
                careerInfoBox.innerHTML = `
                    <div class="result-card">
                        <h2>${career.name}</h2>
                        <p>${career.description}</p>

                        <h3>Skills</h3>
                        <ul>${career.skills.map(s => `<li>${s}</li>`).join("")}</ul>

                        <h3>Salary</h3>
                        <p>${career.salary}</p>

                        <h3>Related Careers</h3>
                        <ul>${career.related.map(r => `<li>${r}</li>`).join("")}</ul>
                    </div>
                `;
            }

            // optionally clear job results area (it can be used later for API results)
            if (jobResultsBox) jobResultsBox.innerHTML = "";
        })
        .catch(err => {
            console.error("Error reading careers.json:", err);
            showMessage(careerInfoBox, "<p>Error loading career details.</p>");
        });
});
