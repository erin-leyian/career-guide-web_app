fetch("data/careers.json")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("careers-list");

        data.careers.forEach(career => {
            const card = document.createElement("div");
            card.classList.add("career-card");

            card.innerHTML = `
                <h3>${career.name}</h3>
                <p>${career.description}</p>
            `;

            card.addEventListener("click", () => {
                const id = career.name.toLowerCase().replace(/ /g, "-");
                window.location.href = `career.html?id=${id}`;
            });

            container.appendChild(card);
        });
    });
