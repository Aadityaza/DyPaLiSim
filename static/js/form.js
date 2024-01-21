let formCount = 0;
const particleData = []; // Array to store particle data

document.getElementById("addParticleButton").addEventListener("click", function() {
    formCount++;
    const formsContainer = document.getElementById("particles-forms");
    const newForm = document.createElement("form");
    newForm.method = "post";
    newForm.setAttribute("hx-post", "/add_atom");
    newForm.setAttribute("hx-target", "#atoms-list");
    newForm.setAttribute("hx-swap", "outerHTML");

    newForm.innerHTML = `
        <label for="partical">Particle ${formCount}:</label>
        <input type="text" id="partical" name="partical" placeholder="Particle ${formCount}" required><br>
        <label for="count">Count:</label>
        <input type="number" id="count" name="count" min="50" max="1000" value="100" required>
        <input type="range" id="countRange" name="countRange" min="50" max="1000" value="100" oninput="count.value = countRange.value" required><br>
        <label for="color">Color ${formCount}:</label>
        <input type="color" id="color" name="color" required><br>
        <label for="size">Size ${formCount}:</label>
        <input type="number" id="size" name="size" min="1" max="10" value="2" required>
        <input type="range" id="sizeRange" name="sizeRange" min="1" max="10" value="2" oninput="size.value = sizeRange.value" required><br>
        <label for="radiusOfInfluence">Radius of Influence ${formCount}:</label>
        <input type="number" id="radiusOfInfluence" name="radiusOfInfluence" min="0" max="500" value="50" required>
        <input type="range" id="radiusOfInfluenceRange" name="radiusOfInfluenceRange" min="0" max="500" value="50" oninput="radiusOfInfluence.value = radiusOfInfluenceRange.value" required><br>
        <button type="submit">Set Parameters</button><br>
        <hr>
    `;

    // Synchronize the range inputs with the number inputs
    newForm.countRange.addEventListener("input", function() {
        newForm.count.value = this.value;
    });
    newForm.sizeRange.addEventListener("input", function() {
        newForm.size.value = this.value;
    });
    newForm.radiusOfInfluenceRange.addEventListener("input", function() {
        newForm.radiusOfInfluence.value = this.value;
    });

    // Add an event listener to the form submission
    newForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the form from submitting
        const formData = new FormData(this); // Get form data
        const particle = {};

        // Iterate through form data and store it in the particle object
        formData.forEach((value, key) => {
            if (!key.includes('Range')) { // Avoid pushing range values into the particle object
                particle[key] = value;
            }
        });

        // Store the particle data in the array
        particleData.push(particle);
        console.log("Particle Data:", particleData);
    });

    formsContainer.appendChild(newForm);
});
