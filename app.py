from boggle import Boggle
from flask import Flask, session, render_template, request, redirect, jsonify
import os

app = Flask(__name__)
 
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'imasecret')
print('**********************************')
print(app.config['SECRET_KEY'])
print('**********************************')

boggle_game = Boggle()


#routes
@app.route('/')
def show_game():

    session['board'] = boggle_game.make_board()
    session['score'] = 0
    session["top_score"] = session.get("top_score",0)

    if session.get("plays",-1) == -1 :

        session["plays"] = 0
        
    return render_template("boggle.html")

@app.route('/check-word')
def add_word():

    word = request.args["word"]

    guess_status = boggle_game.check_valid_word(session['board'],word)
    update_score(guess_status)
    response = jsonify({"result":guess_status, "score":session["score"]})

    return response

@app.route('/update-plays')
def update_plays():

    session["plays"] = session.get('plays', 0) + 1

    return jsonify(session["plays"])

@app.route('/update-top-score')
def update_score():
    
    topScoreUpdated = False

    if session["score"] > session["top_score"]:
        session["top_score"] = session["score"]
        topScoreUpdated = True

    response = jsonify({"top-score-updated":topScoreUpdated})
    return response 

@app.route('/game-data')
def get_gamedata():

    data = { "board": session["board"], "plays": session["plays"], "topScore": session["top_score"] }
    response = jsonify(data)

    return response

def update_score(word_code):

    if word_code == 'ok':
        session['score'] = session['score']+1
    