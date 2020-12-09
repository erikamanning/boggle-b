/* 

    Class: Game
    Description: class to update the major gameplay data points such as words guessed, score
                 board data, and the currently selected letters on the board.

*/

class Game{

    constructor(timeLimit){

        this.score = 0;
        this.words = [];
        this.getGameData();
        this.timeLimit = timeLimit;
        this.selectedLetters = [];
    }

    async getGameData(){

        let res = await axios.get('/game-data');

        this.board = res.data.board;
    }
    getPointVal(isWord){

        return isWord ? 1:0;
    }
    isWord(status){

        return status == "ok" ? true: false;
    }

    async getWordData(word){

        let res = await axios.get('/check-word', { params: { "word": word } });

        const isWord = this.isWord(res.data.result);
        const wordData = {"guessCode": res.data.result, "isWord": isWord, "pointVal":this.getPointVal(isWord)}

        return wordData;
    }

    updateScore(pointsEarned){

        this.score += pointsEarned;

    }
    addGuess(word){

        this.guesses.push(word);
    }

    addSelectedLetter(letter, coordinate){

        this.selectedLetters.push({"letter": letter, "coordinate": coordinate})

    }
}

/* 

    Class: Scoreboard
    Description: class to track and update the plays and topscore for the scoreboard

*/

class ScoreBoard{

    constructor(){

        this.getScoreBoardData();
    }

    async getScoreBoardData(){

        let res = await axios.get('/game-data');

        this.plays = res.data.plays;
        this.topScore = res.data.topScore;
    }

    async updatePlays(){

        let res = await axios.get('/update-plays');
        this.plays +=1;
    }

    async updateTopScore(currentScore){

        if(currentScore > this.topScore)
            this.topScore = currentScore;

        let res = await axios.get('/update-top-score')

        return this.topScore;
    }
}