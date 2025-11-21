// Load careers.json when page loads
let careerData = {};

fetch("data/careers.json")
    .then(response => response.json())
    .then(data => {
        careerData = data;
        console.log("Career data loaded:", careerData.careers);
    })
    .catch(error => {
        console.error("Error loading career data:", error);
    });

// Handle Search Button Click
document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim();

    if (query === "") {
        alert("Please enter a career to search.");
        return;
    }

    searchCareer(query);
});

// Search Career Function
function searchCareer(query) {
    const formatted = query.toLowerCase();

    // careers array from JSON
    const careersArray = careerData.careers;

    if (!careersArray) {
        displayMessage("Career data not loaded yet. Please try again.");
        return;
    }

    // find matching career
    const foundCareer = careersArray.find(career =>
        career.name.toLowerCase() === formatted
    );

    if (!foundCareer) {
        displayMessage("No career found. Try another search.");
        return;
    }

    displayCareerInfo(foundCareer);
}

function displayCareerInfo(career) {
    document.getElementById("results-section").innerHTML = `
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


// Display message (e.g., errors or no results)
function displayMessage(msg) {
    document.getElementById("results-section").innerHTML = `
        <div class="result-card">
            <p>${msg}</p>
        </div>
    `;
}
