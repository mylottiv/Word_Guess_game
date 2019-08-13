$(document).ready(function(){
    // Initializing Game Object that holds Global Variables
    let game = {
        alphabet: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
        wordBank: ['Madonna','Farmer','Chicken','Bob','Vladimir','Howl','Brush','Apologize','Villain'],
        wins: 0,
        guesses: 10,
        solution: '',
        activeWord: '',
        wrongLetters: [],
    }
    
    // Replacing Alphabet Strings with Objects
    for (let i = 0; i < game.alphabet.length; i++){
        let temp = game.alphabet[i];
        game.alphabet[i] = {
            letter: temp,
            checked: false
        }
    }

    // Formatting Words in the Word Bank
    for (let i = 0; i < game.wordBank.length; i++){
        let result = '';
        // Capitalize characters
        let temp = game.wordBank[i].toUpperCase();
        // Add whitespace if not last character
        for (let j = 0; j < temp.length; j++){
            if (j < temp.length -1){
                result += temp.charAt(j) + ' ';
            }
            else{
                result += temp.charAt(j);
            }
        }
        // Saves the new formatted words in Word Bank
        game.wordBank[i] = result;
    }

    // Calls the initializer for Solution and Active Word and Wrong Letters
    wordInitializer();
    
    // Setting initial input prompt
    $('#input-prompt').text('Guess any letter!');

    // Calling displayUpdate with gameOver as false   
    displayUpdate(false);

    // Core gameplay loop
    $(document).keydown(function(event) {
        
        // Gets capital character of key typed
        let input = String.fromCharCode(event.which);
        
        // Checks if input string is a letter in the alphabet
        let alphabetTest = game.alphabet.find(i => i.letter === input);
        if (alphabetTest !== undefined){
            if (!alphabetTest.checked){
                letterChecker(input);
                alphabetTest.checked = true;
                $('#input-prompt').text('Guess any letter!')
            }
            else{
                $('#input-prompt').text('Try another letter!')
            }
        }
        else{
            $('#input-prompt').text("That's not a letter!")
        }

        // Checks if player won
        if (game.activeWord === game.solution){
            game.wins++;
            game.guesses = 10;
            
            // Updates to show completed word before initializing new game
            displayUpdate(false);
            wordInitializer();
            $('#input-prompt').text('Congratulations! You Won!');

            //  Updates to show new active word after timer delay
            setTimeout(function() {displayUpdate(true); }, 2500);
        }
        
        // Or if player lost
        else if (game.guesses === 0){
            game.guesses = 10;

            // Updates to show completed word before initializing new game
            displayUpdate(false);
            wordInitializer();
            $('#input-prompt').text('Sorry, out of guesses. Try again!');

            //  Updates to show new active word after timer delay
            setTimeout(function() {displayUpdate(true); }, 2500);
        }

        // Otherwise just updates strings and HTML
        else{
            displayUpdate(false);
        }
    })

   // Initializer function called on starting the game and new game
   function wordInitializer(){
    // Choosing active word
    let drawNumber = Math.floor(Math.random() * game.wordBank.length);

    // Initializing checked status for alphabet letters
    game.alphabet.forEach(i => i.checked = false);

    // Initializing solution set
    game.solution = game.wordBank[drawNumber];

    // Initializing Active Word
    let newWord = '';
    // Uses solution as template for censored word
    for (let i = 0; i < game.solution.length; i++){
        // If an actual letter, replaces with underscore
        if (game.solution.charAt(i) !== ' '){
            newWord += '_';
        }
        else{
            newWord += ' '
        }
    }
    game.activeWord = newWord;
    // Reinitializes the wrong letters array
    game.wrongLetters = [];
}

    // Updates strings for all relevant HTML elements
    function displayUpdate(newGame){
        $('#word-display').text(game.activeWord);
        $('#guesses-remaining').text(`Guesses remaining: ${game.guesses}`);
        $('#win-counter').text(`Wins: ${game.wins}`);

        // Passing to HTML here to allow line break tag
        $('#wrong-letters').html('Tried Letters: <br>' + game.wrongLetters.join(', '));
        
        // If new game, then reinitialize input prompt
        if (newGame){
            $('#input-prompt').text('Guess any letter!');
        }
    }
    // Checks if the chosen letter is in the solution for activeWord and updates accordingly
    function letterChecker(letter){
        
        // Dumps solution and activeWord strings into temp arrays
        let tempSolution = game.solution.split(' ');
        let tempActiveWord = game.activeWord.split(' ');
        
        // Initializes match flag
        let matchFlag = false;
        
        // For each character in the active word
        for (let i = 0; i < tempActiveWord.length; i++){
        
            // Checks if given letter is in solution set
            if (tempSolution[i] === letter){
        
                // Underscore changes to correct letter in active word
                tempActiveWord[i] = letter;
        
                // Flags that input letter was correct if not already
                matchFlag = true;
            }
        }
        
        // If letter was not in the word
        if (!matchFlag){
            
            // Subtract a guess
            game.guesses--;
        
            // Add wrong guess to array
            game.wrongLetters.push(`"${letter}"`);
        }
        
        // Otherwise update activeWord
        else {
            game.activeWord = tempActiveWord.join(' ');
        }
    }
})