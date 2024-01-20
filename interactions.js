

// Function to calculate interaction forces between two atoms
function calculateForces(atom1, atom2, attractionFactor, maxDistanceSquared) {
    let dx = atom1.x - atom2.x;
    let dy = atom1.y - atom2.y;
    let distanceSquared = dx * dx + dy * dy;

    if (distanceSquared > 0 && distanceSquared < maxDistanceSquared) {
        let force = attractionFactor / Math.sqrt(distanceSquared);
        return { fx: force * dx, fy: force * dy };
    }
    return { fx: 0, fy: 0 };
}

