let CANVAS_SIZE = 1000; 

class Atom {
    constructor(x, y, color, radius = 2) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.color = color;
        this.radius = radius; // Added radius property with default value of 2
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

     // Read the number of atoms for each type from the input fields
    const AtomSilverCount = 520;
    const AtomGoldCount = 500;
    const AtomMagentaCount = 550;
    const AtomTealCount = 530;
    const AtomCoralCount = 540;
    const AtomLimeCount = 560;
 
     // Initializing atoms and starting the simulation
     let atoms = [];
     // Initialization
    const AtomSilver = createAtoms(AtomSilverCount, "#C0C0C0", atoms);
    const AtomGold = createAtoms(AtomGoldCount, "#FFD700", atoms);
    const AtomMagenta = createAtoms(AtomMagentaCount, "#FF00FF", atoms);
    const AtomTeal = createAtoms(AtomTealCount, "#008080", atoms);
    const AtomCoral = createAtoms(AtomCoralCount, "#FF7F50", atoms);
    const AtomLime = createAtoms(AtomLimeCount, "#00FF00", atoms);
    

    // Update function for animation
    function update() {

        // Interaction rules within the same atom type
    applyInteractionRule(AtomSilver, AtomSilver, -0.5); // Silver-Silver: Neutral
    applyInteractionRule(AtomGold, AtomGold, -1.0); // Gold-Gold: Very Strong Repulsion
    applyInteractionRule(AtomMagenta, AtomMagenta, -0.5); // Magenta-Magenta: Strong Attraction
    applyInteractionRule(AtomTeal, AtomTeal, 0.9); // Teal-Teal: Slight Attraction
    applyInteractionRule(AtomCoral, AtomCoral, -0.5); // Coral-Coral: Moderate Repulsion
    applyInteractionRule(AtomLime, AtomLime, -0.93); // Lime-Lime: Moderate Attraction

    // Interactions between different atom types
    // Note: These are just examples, and the actual values can be adjusted for different dynamics
    applyInteractionRule(AtomSilver, AtomGold, 0.2); // Silver-Gold: Mild Attraction
    applyInteractionRule(AtomSilver, AtomMagenta, -0.3); // Silver-Magenta: Mild Repulsion
    applyInteractionRule(AtomSilver, AtomTeal, 0); // Silver-Teal: Neutral
    applyInteractionRule(AtomSilver, AtomCoral, 0.1); // Silver-Coral: Slight Attraction
    applyInteractionRule(AtomSilver, AtomLime, -0.8); // Silver-Lime: Mild Repulsion

    applyInteractionRule(AtomGold, AtomMagenta, 0.7); // Gold-Magenta: Strong Attraction
    applyInteractionRule(AtomGold, AtomTeal, -0.6); // Gold-Teal: Strong Repulsion
    applyInteractionRule(AtomGold, AtomCoral, 0.5); // Gold-Coral: Moderate Attraction
    applyInteractionRule(AtomGold, AtomLime, -0.7); // Gold-Lime: Strong Repulsion

    applyInteractionRule(AtomMagenta, AtomTeal, 0.4); // Magenta-Teal: Moderate Attraction
    applyInteractionRule(AtomMagenta, AtomCoral, -0.5); // Magenta-Coral: Moderate Repulsion
    applyInteractionRule(AtomMagenta, AtomLime, 0.6); // Magenta-Lime: Strong Attraction

    applyInteractionRule(AtomTeal, AtomCoral, -0.4); // Teal-Coral: Neutral
    applyInteractionRule(AtomTeal, AtomLime, -0.3); // Teal-Lime: Mild Repulsion

    applyInteractionRule(AtomCoral, AtomLime, 0.5); // Coral-Lime: Moderate Attraction




        // Clear the canvas and set the background to black
        context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Redraw all atoms in their updated positions
        atoms.forEach(atom => draw(context, atom.x, atom.y, atom.color, atom.radius)); 
        
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
function createAtoms(number, color, atoms) {
    let group = [];
    for (let i = 0; i < number; i++) {
        group.push(new Atom(randomPosition(), randomPosition(), color)); // Create Atom objects and add them to the group
        atoms.push(group[i]);   // Add Atom objects to the global atoms array
    }
    return group;
}

// Updated function to apply interaction rules between atoms
function applyInteractionRule(atoms1, atoms2, attraction, canvasSize) {
    const attractionFactor = attraction * 1;
    const maxDistanceSquared = 300 * 300;

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





