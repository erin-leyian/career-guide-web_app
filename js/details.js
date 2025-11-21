// 1. Read the ID from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// 2. Load local JSON career details
fetch("data/careers.json")
    .then(res => res.json())
    .then(data => {
        const career = data.careers.find(c =>
            c.name.toLowerCase().replace(/ /g, "-") === id
        );

        if (career) {
            displayCareerInfo(career);
            searchAPI(career.name); // auto-load API results
        }
    });

// Display JSON details on top
function displayCareerInfo(career) {
    const box = document.getElementById("career-info");
    box.innerHTML = `
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
