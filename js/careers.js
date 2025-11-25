// js/careers.js

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("careers-list");
    if (!container) return; // nothing to do if element is missing

    fetch("data/careers.json")
        .then(res => res.json())
        .then(data => {
            if (!data || !Array.isArray(data.careers)) {
                container.innerHTML = "<p>No careers available.</p>";
                return;
            }

            // 1️⃣ Get category from URL
            const params = new URLSearchParams(window.location.search);
            const selectedCategory = params.get("category");

            // 2️⃣ Filter based on category
            let filteredCareers = data.careers;

            if (selectedCategory) {
                filteredCareers = data.careers.filter(career =>
                    career.category.toLowerCase() === selectedCategory.toLowerCase()
                );
            }

            // clear previous content
            container.innerHTML = "";

            // 3️⃣ Display filtered careers
            filteredCareers.forEach(career => {
                const card = document.createElement("div");
                card.classList.add("career-card");

                card.innerHTML = `
                    <h3>${career.name}</h3>
                    <p>${career.description}</p>
                `;

                card.addEventListener("click", () => {
                    const id = career.name.toLowerCase().replace(/ /g, "-");
                    window.location.href = `career.html?id=${encodeURIComponent(id)}`;
                });

                container.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Error loading careers:", err);
            container.innerHTML = "<p>Error loading careers.</p>";
        });
        
});
