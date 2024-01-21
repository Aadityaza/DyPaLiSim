let CANVAS_SIZE = 500;

function loadAtomData(callback) {
    fetch('atoms.json')
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error loading atom data:', error));
}

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

document.getElementById('addAtomButton').addEventListener('click', function() {
    const name = document.getElementById('atomName').value || `Particle ${getUniqueNumber()}`;
    const count = parseInt(document.getElementById('atomCount').value);
    const color = document.getElementById('atomColor').value;
    const size = parseInt(document.getElementById('atomSize').value);
    const radiusOfInfluence = parseInt(document.getElementById('radiusOfInfluence').value);

    let newAtom = {
        name: name,
        count: parseInt(count),
        color: color,
        size: parseInt(size),
        radiusOfInfluence: parseInt(radiusOfInfluence)
    };

    saveAtomToServer(newAtom, 'atoms.json');
});

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
    const AtomSilverCount = 100;
    const AtomGoldCount = 100;
    const AtomMagentaCount = 100;
    const AtomTealCount = 100;
    const AtomCoralCount = 100;
    const AtomLimeCount = 100;

     // Initializing atoms and starting the simulation
     let atoms = [];
     // Initialization
    const AtomSilver = createAtoms(AtomSilverCount, "#C0C0C0", atoms,2,50);
    const AtomGold = createAtoms(AtomGoldCount, "#FFD700", atoms, 3,20);
    const AtomMagenta = createAtoms(AtomMagentaCount, "#FF00FF", atoms, 7,50);
    const AtomTeal = createAtoms(AtomTealCount, "#008080", atoms, 5,10);
    const AtomCoral = createAtoms(AtomCoralCount, "#FF7F50", atoms, 4,40);
    const AtomLime = createAtoms(AtomLimeCount, "#00FF00", atoms,2,30);

    // Update function for animation
    function update() {

        // Interaction rules within the same atom type
    applyInteractionRule(AtomSilver, AtomSilver, -0.5); 
    applyInteractionRule(AtomGold, AtomGold, -0.20); 
    applyInteractionRule(AtomMagenta, AtomMagenta, -0.5); 
    applyInteractionRule(AtomTeal, AtomTeal, -0.5); 
    applyInteractionRule(AtomCoral, AtomCoral, -0.5); 
    applyInteractionRule(AtomLime, AtomLime, -0.23); 

    // Interactions between different atom types
    // Note: These are just examples, and the actual values can be adjusted for different dynamics
    applyInteractionRule(AtomSilver, AtomGold, 0.2); 
    applyInteractionRule(AtomSilver, AtomMagenta, -0.3); 
    applyInteractionRule(AtomSilver, AtomTeal, 0); 
    applyInteractionRule(AtomSilver, AtomCoral, 0.1); 
    applyInteractionRule(AtomSilver, AtomLime, -0.8); 

    applyInteractionRule(AtomGold, AtomMagenta, 0.7); 
    applyInteractionRule(AtomGold, AtomTeal, -0.6);
    applyInteractionRule(AtomGold, AtomCoral, 0.5); 
    applyInteractionRule(AtomGold, AtomLime, -0.7);

    applyInteractionRule(AtomMagenta, AtomTeal, 0.4); 
    applyInteractionRule(AtomMagenta, AtomCoral, -0.5);
    applyInteractionRule(AtomMagenta, AtomLime, 0.6); 

    applyInteractionRule(AtomTeal, AtomCoral, -0.4);
    applyInteractionRule(AtomTeal, AtomLime, -0.3); 

    applyInteractionRule(AtomCoral, AtomLime, 0.5);



        // Clear the canvas and set the background to black
        context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

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
