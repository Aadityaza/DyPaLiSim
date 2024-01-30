let CANVAS_SIZE =800;
let atoms = [];
let atomGroups;

class Atom {
    constructor(x, y, color, size = 2, radius_of_influence = RadiusofInfluence) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.color = color;
        this.size = size;
        this.radius_of_influence = radius_of_influence;
    }
}


// Function to initialize and start the simulation
function initializeSimulation() {

     // Get the canvas and context
     const canvas = document.getElementById("life");
     const context = canvas.getContext("2d");

     // Set the canvas size
     canvas.width = CANVAS_SIZE;
     canvas.height = CANVAS_SIZE;
     canvas.style.display = 'block';

    function update() {
        // Clear the canvas and set the background to black
        context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Update positions and velocities of atoms
        for (const atom1 of atomGroups) {
                for (const atom2 of atomGroups) {
                    if (atom1.name !== atom2.name) {
                        const attractionInput = document.getElementById(`${atom1.name}_${atom2.name}`);
                        const attractionValue = parseFloat(attractionInput.value);
                        applyInteractionRule(atom1.atoms, atom2.atoms, attractionValue);
                    }
                }
            }

        // Redraw all atoms in their updated positions
        atoms.forEach(atom => draw(context, atom.x, atom.y, atom.color, atom.size));

        // Request the next animation frame to continue the loop
        requestAnimationFrame(update);
    }

    // Start animation
    update();
}

// Attach an event listener to the button
document.getElementById('simulateButton').addEventListener('click', initializeSimulation);



// Function to generate random position
function randomPosition() {
    return Math.random() * (CANVAS_SIZE - 100) + 50;   // Generate a random position within canvas bounds
}

// Function to create a group of atoms
function createAtoms(number, color, atoms, size, radius_of_influence) {
    let group = [];
    for (let i = 0; i < number; i++) {
        group.push(new Atom(randomPosition(), randomPosition(), color, size, radius_of_influence)); // Create Atom objects and add them to the group
        atoms.push(group[i]);   // Add Atom objects to the global atoms array
    }
    return group;
}

// Updated function to apply interaction rules between atoms
function applyInteractionRule(atoms1, atoms2, attraction) {
    attraction = attraction
    const attractionFactor = attraction * 1;
    const maxDistanceSquared = atoms1[0].radius_of_influence * atoms2[0].radius_of_influence*10 ;
    
    atoms1.forEach(atom1 => {
        let fx = 0;
        let fy = 0;

        atoms2.forEach(atom2 => {
            let forces = calculateForces(atom1, atom2, attractionFactor, maxDistanceSquared);
            fx += forces.fx;
            fy += forces.fy;
        });

        atom1.vx = (atom1.vx + fx) * 0.5;
        atom1.vy = (atom1.vy + fy) * 0.5;

        atom1.x += atom1.vx;
        atom1.y += atom1.vy;

        //handleBoundaryCollision
        if (atom1.x <= 0 || atom1.x >= CANVAS_SIZE) atom1.vx *= -1;   // Reverse velocity on horizontal boundary
        if (atom1.y <= 0 || atom1.y >= CANVAS_SIZE) atom1.vy *= -1;   // Reverse velocity on vertical boundary
        atom1.x = Math.max(0, Math.min(atom1.x, CANVAS_SIZE)); // Ensure atom stays within bounds
        atom1.y = Math.max(0, Math.min(atom1.y, CANVAS_SIZE)); // Ensure atom stays within bounds
    });
}
// Assuming particleData, createAtoms, and applyInteractionRule functions are defined elsewhere

function showInteractionForm() {
    console.log('click..');
    atomGroups = particleData.map(particle => {
        return {
            name: particle.partical,
            atoms: createAtoms(parseInt(particle.count), particle.color, atoms, parseInt(particle.size), parseInt(particle.radiusOfInfluence))
        };
    });

    for (const atom of atomGroups) {
        console.log(atom.name);
    }

    // Reference to the existing div in your HTML
    const formContainer = document.getElementById('interaction-form');

    // Create the HTML form
    const form = document.createElement('form');
    form.id = 'interactionForm';

    // Loop through atomGroups to create form elements for each atom combination
    atomGroups.forEach(atom1 => {
        atomGroups.forEach(atom2 => {
            // Skip if it's the same atom or if the combination already exists
            if (!document.getElementById(`${atom1.name}_${atom2.name}`)) {
                const inputLabel = document.createElement('label');
                const sliderLabel = document.createElement('span'); // Display for the slider value
                const inputAttraction = document.createElement('input');

                inputLabel.textContent = `Attraction between ${atom1.name} and ${atom2.name}: `;
                sliderLabel.textContent = '0'; // Initial value display
                inputAttraction.type = 'range';
                inputAttraction.min = -1;
                inputAttraction.max = 1;
                inputAttraction.step = 0.1;
                inputAttraction.value = 0;
                inputAttraction.id = `${atom1.name}_${atom2.name}`;

                // Update the value display dynamically
                inputAttraction.addEventListener('input', function () {
                    sliderLabel.textContent = inputAttraction.value;
                });

                form.appendChild(inputLabel);
                form.appendChild(inputAttraction);
                form.appendChild(sliderLabel);
                form.appendChild(document.createElement('br'));
            }
        });
    });

    // Add a submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'button'; // Change to 'submit' if you want to submit the form
    submitButton.textContent = 'Apply Interaction Rules';
    submitButton.addEventListener('click', function () {
        // Call the applyInteractionRule function with the entered values
        for (const atom1 of atomGroups) {
            for (const atom2 of atomGroups) {
                if (atom1.name !== atom2.name) {
                    const attractionInput = document.getElementById(`${atom1.name}_${atom2.name}`);
                    const attractionValue = parseFloat(attractionInput.value);
                    applyInteractionRule(atom1.atoms, atom2.atoms, attractionValue);
                }
            }
        }
    });

    form.appendChild(submitButton);

    // Append the form to the existing div in your HTML
    formContainer.appendChild(form);

    document.getElementById('interactionForm').addEventListener('change', function() {
        interactionsUpdated = true;
    });
}

// Add an event listener to the "setInteractionRuleButton"
document.getElementById('setInteractionRuleButton').addEventListener('click', showInteractionForm);

