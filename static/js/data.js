function saveAtomToServer(atom) {
    fetch('http://127.0.0.1:5000/add_atom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(atom),
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}
function loadAtomsFromServer() {
    fetch('http://127.0.0.1:5000/get_atoms')
        .then(response => response.json())
        .then(data => {
            data.forEach(atom => {
                createAtoms(atom.count, atom.color, atoms, atom.size, atom.radiusOfInfluence);
            });
        })
        .catch((error) => console.error('Error:', error));
}

