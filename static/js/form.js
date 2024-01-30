let currentFormCount = 1; // Start with form count 1

const particleData = []; // Array to store particle data

// Create the initial form by default
addParticleForm();

// Function to add the particle form
function addParticleForm() {
    const formsContainer = document.getElementById("particles-forms");

    // Remove any existing form
    const existingForm = document.getElementById("particleForm");
    if (existingForm) {
        formsContainer.removeChild(existingForm);
    }

    const newForm = document.createElement("form");
    newForm.id = "particleForm"; // Add an ID to the form
    newForm.method = "post";
    newForm.setAttribute("hx-post", "/add_atom");
    newForm.setAttribute("hx-target", "#atoms-list");
    newForm.setAttribute("hx-swap", "outerHTML");

    newForm.innerHTML = `
        <label for="partical">Particle ${currentFormCount}:</label>
        <input type="text" id="partical" name="partical" placeholder="Particle ${currentFormCount}" required><br>

        <label for="count">Count:</label>
        <input type="range" id="count" name="count" min="50" max="1000" value="100" required>
        <span id="countValue">100</span><br>

        <label for="color">Color:</label>
        <input type="color" id="color" name="color" required value="#FFFFFF"><br>


        <label for="size">Size:</label>
        <input type="range" id="size" name="size" min="1" max="10" value="2" required>
        <span id="sizeValue">2</span><br>

        <label for="radiusOfInfluence">Radius of Influence:</label>
        <input type="range" id="radiusOfInfluence" name="radiusOfInfluence" min="0" max="500" value="50" required>
        <span id="radiusValue">50</span><br>

        <button type="submit" id="submitButton">Set Parameters</button><br>
        <hr>
    `;

    // Add event listeners for the range inputs
    newForm.querySelector('#count').addEventListener('input', function() {
        document.getElementById('countValue').textContent = this.value;
    });

    newForm.querySelector('#size').addEventListener('input', function() {
        document.getElementById('sizeValue').textContent = this.value;
    });

    newForm.querySelector('#radiusOfInfluence').addEventListener('input', function() {
        document.getElementById('radiusValue').textContent = this.value;
    });

    // Add an event listener to the form for form submission
    newForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the form from submitting
        submitForm(this); // Call the submitForm function to handle form submission
        currentFormCount++; // Increment the form count
        addParticleForm(); // Add a new particle form after submission
    });

    formsContainer.appendChild(newForm);
}

// Function to submit the form data
function submitForm(form) {
    const formData = new FormData(form); // Get form data
    const particle = {};

    // Iterate through form data and store it in the particle object
    formData.forEach((value, key) => {
        if (key !== 'submitButton') { // Exclude the submit button from data
            particle[key] = value;
        }
    });

    // Store the particle data in the array
    particleData.push(particle);
    console.log("Particle Data:", particleData);
    updateParticleListDisplay();
}

const interactionRuleButton = document.getElementById('setInteractionRuleButton');
interactionRuleButton.disabled = true;
interactionRuleButton.style.display = 'none'; // Initially hide the button

// Function to update the particle list display
function updateParticleListDisplay() {
    const particleListElement = document.getElementById('particleListDisplay');
    particleListElement.innerHTML = ''; // Clear the current list

    particleData.forEach((particle, index) => {
        const particleItem = document.createElement('li');
        particleItem.textContent = `Particle ${index + 1}: ${JSON.stringify(particle)}`;
        particleListElement.appendChild(particleItem);
    });

    // Enable and show the interaction rule button if there are particles
    if (particleData.length > 0) {
        interactionRuleButton.disabled = false;
        interactionRuleButton.style.display = 'block'; // Show the button
    } else {
        interactionRuleButton.disabled = true;
        interactionRuleButton.style.display = 'none'; // Hide the button
    }
}
