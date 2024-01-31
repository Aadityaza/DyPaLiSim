import json

from flask import Flask, jsonify, request, render_template

app = Flask(__name__)
atoms = []

@app.route('/')
def index():
    return render_template( 'index.html')

@app.route('/interaction')
def interaction():
    return render_template( 'interaction.html')


if __name__ == '__main__':
    app.run(debug=True)