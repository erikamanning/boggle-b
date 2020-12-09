$(document).ready(function () {

    const $board = $('#game-board');
    const $time = $('#time');
    const $guessButton = $('#guess-button');
    const $wordForm = $('#word-form');
    const $wordInput = $('#word-input');
    const $startButton = $('#start-button');
    const $wordList = $('#word-list');
    const $gameData = $('#game-data');
    const $replayButtonContainer = $('#replay-button-container');
    const $gameTitle = $('#game-title');
    const $gameCells = $('.game-cell');
    const $deleteButton = $('.delete-button');
    const $gameOver = $('#game-over');
    const $score = $('#score'); 
    const $duplicateWarning = $('#duplicate-warning');
    const $timeElement = $('#time-element');
    const $tableBody = $('tbody');
    const $numPlays =  $('#num-plays');
    const $wrongOrderWarning = $('#wrong-order');
    const $body = $('body');
    const $topLetters = $('.top-title-letter');
    const $bottomLetters = $('.bottom-title-letter');
    const $topScore=$('#top-score')
    let titleAnimationStopper;
    let selectedLetters = {}
    let count = 0;


    // start title Animation
    titleAnimation();

    // game begins
    $startButton.on('click', async (event) => {

        // display in game elements
        showGame();

        // start in game tracking
        startGame();
    });

    // submits guess if submit button is clicked
    $guessButton.on('click', async (event) => {

        wordEntryHandler(event);
    });

    // submits guess if enter key is pressed
    $body.on('keypress', async (event) => {

        // check for enter key press
        if (event.which == 13) {

            wordEntryHandler(event)
        }
    });

    async function wordEntryHandler(){

        // make sure form is not empty
        if($wordInput.val() != ''){

            const word = $wordInput.val()

            // check for duplicate word entry
            if(!isDuplicate(newGame.words,word)){
    
                // get word status, point value, boolean for is word or not
                let wordData = await newGame.getWordData(word);
    
                console.log(wordData);
                // add guess to table UI
                addGuess(word, wordData.pointVal, wordData.guessCode)
    
                // if valid word update game object score and ui score
                if (wordData.isWord){
    
                    // add word to guessed words storage
                    newGame.words.push(word);
    
                    // update score and ui
                    updateScore(wordData.pointVal);
                }
            }
            else{
    
                // display no duplicates message to user
                showNotification($duplicateWarning);
            }
    
            // clear user input
            clearUserInput();
        }
    }

    $gameCells.on("click", (event) => {

        // check if element is already selected
        if ($(event.target).hasClass("selected")){

            // get last position
            let lastPosition = newGame.selectedLetters.length-1;
            let lastCoordinate = newGame.selectedLetters[lastPosition].coordinate;

            // check if letter is last selected
            if ( $(event.target).attr("id") == lastCoordinate) {

                // deselect letter on board
                deselectLastElement($(event.target));

                // remove letter from input field
                removeLetterFromInput();

                // if there are still letters selected, move selection box to next most recent selection
                if(newGame.selectedLetters.length>0)
                    selectNewLastElement();
                
            }
            else {
                // inform the user they have tried to deselect in the wrong order
                showNotification($wrongOrderWarning);
            }
        }
        else {

            updateSelectedLetter($(event.target));

            // update input box
            addLetterToInput();

            // update selected letters object array
            newGame.addSelectedLetter( $(event.target).text().toLowerCase(), $(event.target).attr("id"));
        }
    });

    function deselectLastElement(element){

        // remove display classes showing selection
        element.removeClass("has-last-border");
        element.removeClass("selected");

        // remove letter from game selected letters array
        newGame.selectedLetters.pop();
    }

    function selectNewLastElement(){

        // get position of last letter
        let lastPosition = newGame.selectedLetters.length-1;
        let lastCoordinate = newGame.selectedLetters[lastPosition].coordinate;

        // add display classes showing selection
        $(`#${lastCoordinate}`).addClass("has-last-border");
    }

    function removeLetterFromInput(){

        // remove the last letter in the input box
        $wordInput.val($wordInput.val().substring(0, $wordInput.val().length - 1));
    }

    function addLetterToInput(){

        // add letter to end of string in input box
        $wordInput.val($wordInput.val() + $(event.target).text().toLowerCase());
    }

    function updateSelectedLetter(element){

        // get position of last letter
        if(newGame.selectedLetters.length > 0){

            // get coordinate of last selected element
            let lastPosition = newGame.selectedLetters.length-1;
            let lastCoordinate = newGame.selectedLetters[lastPosition].coordinate;
    
            // remove selected classes
            $(`#${lastCoordinate}`).removeClass("has-last-border");
        }
    
        // add selection classes to new last selected element
        element.addClass("selected");
        element.addClass("has-last-border");
    }

    // hides notification if delete button pressed
    $deleteButton.on("click", (event) => {

        $(event.target).parent().hide();
    });

    // add coordinate IDs to each game cell
    function loadCoordinates() {

        let i = 0;

        for (let y = 0; y < 5; y++) {

            for (let x = 0; x < 5; x++) {

                $gameCells.eq(i).attr("id", `${y}-${x}`);
                i++;
            }
        }
    }

    // clear all user input from game screen
    function clearUserInput(){

        // clear form input
        $wordInput.val('');

        // clear selection classes
        $gameCells.removeClass('has-last-border');
        $gameCells.removeClass('selected');

        // reset letter tracking variables
        selectedLetters = {}
        count = 0;
    }

    // modifies display to show only all in game elements
    function showGame() {

        // set up grid
        loadCoordinates();

        // stop title animation
        stopAnimation(titleAnimationStopper);

        // hide splash screen elements
        $topLetters.hide();
        $bottomLetters.hide();
        $startButton.hide();

        // show in game elements
        $gameTitle.show();
        $gameData.show();
        $wordForm.show();
        $board.removeClass("is-hidden");
        $wordList.removeClass("is-hidden");
    }

    // modifies display to show only game over screen elements
    async function gameOver() {

        // hide in-game elements
        $gameTitle.hide();
        $duplicateWarning.hide();
        $wrongOrderWarning.hide();
        $board.hide();
        $timeElement.hide();
        $wordForm.hide();
        $wordList.hide();

        // update and modify top score
        let newTopScore = await newScoreBoard.updateTopScore(newGame.score);
        $topScore.text(newTopScore);

        // show game over elements
        $gameOver.show();
        $replayButtonContainer.removeClass("is-hidden");
    }

    function addGuess(word, pointVal, status) {

        // create new table elements
        $newLine = $('<tr>');
        $newWord = $(`<td class="has-text-centered">${word}</td>`);
        $newStatus = $(`<td class="has-text-centered">${getUIStatus(status)}</td>`);
        $newPoint = $(`<td class="has-text-centered">${pointVal}</td>`)

        // append elements
        $newLine.append($newWord, $newStatus, $newPoint);
        $tableBody.append($newLine);
    }

    // gets prettier status from server status
    function getUIStatus(status){

        statuses = {"ok": "word", "not-word": "not a word", "not-on-board": "not on board"}

        return statuses[status];
    }

    // shows a submitted notification element at the top of the screen
    function showNotification(element){

        // shows the element
        element.show();

        // hides the element after it is visible for 5 seconds
        setTimeout(() => {

            element.hide();
        }, 5000);
    }

    function startGame(){

        // update number of times player has played
        updatePlays();

        // start in game timer
        startTimer(newGame.timeLimit);
    }

    async function updateScore(pointVal){

        // update game object with score
        newGame.updateScore(pointVal);

        // update ui score board
        $score.text(newGame.score);
    }

    async function updatePlays(){

        // update session plays and game object plays
        await newScoreBoard.updatePlays();

        // update UI for plays
        $numPlays.text(newScoreBoard.plays)
    }

    // starts the in game timer
    function startTimer(timeLimit) {

        // set timer
        let secondsRemaining = timeLimit;

        // countdown to zero
        const gameTimeInterval = setInterval(() => {

            // uppdate time
            secondsRemaining--

            // get updatedstring to output to UI
            let timeText = secondsRemaining > 9 ? `00:${secondsRemaining}` : `00:0${secondsRemaining}`

            // update UI timer
            $time.text(timeText)

            // show game over and stope timer when we've reached zero
            if (secondsRemaining == 0) {

                clearInterval(gameTimeInterval);
                gameOver();
            }

        }, 1000);
    }
});