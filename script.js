// Load careers.json when the page starts
let careerData = {};

fetch("data/careers.json")
    .then(response => response.json())
    .then(data => {
        careerData = data;
        console.log("Career data loaded:", careerData);
    })
    .catch(error => {
        console.error("Error loading career data:", error);
    });


document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim();

    if (query === "") {
        alert("Please enter a career to search.");
        return;
    }

    searchCareer(query);
});


function searchCareer(query) {
    const formatted = query.toLowerCase();

    // Find a matching career
    let foundCareer = null;

    for (let careerName in careerData) {
        if (careerName.toLowerCase() === formatted) {
            foundCareer = careerData[careerName];
            foundCareer.name = careerName;
            break;
        }
    }

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

            <p><strong>Difficulty:</strong> ${career.difficulty}</p>

            <p><strong>Key Skills:</strong></p>
            <ul>
                ${career.skills.map(skill => `<li>${skill}</li>`).join("")}
            </ul>

            <p><strong>Learning Path:</strong></p>
            <ol>
                ${career.path.map(step => `<li>${step}</li>`).join("")}
            </ol>
        </div>
    `;
}


function displayMessage(msg) {
    document.getElementById("results-section").innerHTML = `
        <div class="result-card">
            <p>${msg}</p>
        </div>
    `;
}
