function isDuplicate(guesses,word){

    for(let entry of guesses ){

        if(word == entry)
            return true;
    }

    return false;
}

