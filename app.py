import json

from flask import Flask, jsonify, request, render_template

app = Flask(__name__)
atoms = []

@app.route('/')
def index():
    return render_template( 'index.html')
@app.route('/add_atom', methods=['POST'])
def add_atom():
    atom_data = request.json
    atoms.append(atom_data)
    with open('atoms.json', 'w') as f:
        json.dump(atoms, f)
    return jsonify({"message": "Atom added successfully"})

@app.route('/get_atoms', methods=['GET'])
def get_atoms():
    return jsonify(atoms)

if __name__ == '__main__':
    app.run(debug=True)
