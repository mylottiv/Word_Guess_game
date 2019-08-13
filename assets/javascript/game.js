$(document).ready(function(){
    // Initializing Alphabet Array
    const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    // Replacing Alphabet Strings with Objects
    for (let i = 0; i < alphabet.length; i++){
        let temp = alphabet[i];
        alphabet[i] = {
            letter: temp,
            checked: false
        }
        console.log(alphabet[i])
    }
    
    // Initializing Possible Words array
    const wordBank = ['Madonna','Farmer','Chicken','Bob','Vladimir'];

    // Formatting Words in the Word Bank
    for (let i = 0; i < wordBank.length; i++){
        let result = '';
        // Capitalize characters
        let temp = wordBank[i].toUpperCase();
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
        wordBank[i] = result;
        //console.log(wordBank[i]);
    }
    // Calls the initializer for Solution and Active Word and Wrong Letters
    let solution = '';
    let activeWord = '';
    let wrongLetters = [];
    wordInitializer();

    // Initializer function called on starting the game and new game
    function wordInitializer(){
        // Choosing active word
        let drawNumber = Math.floor(Math.random() * wordBank.length);

        // Initializing checked status for alphabet
        alphabet.forEach(i => i.checked = false);

        // Initializing solution set
        solution = wordBank[drawNumber];

        // Initializing Active Word
        let newWord = '';
        // Uses solution as template for censored word
        for (let i = 0; i < solution.length; i++){
            // If an actual letter, replaces with underscore
            if (solution.charAt(i) !== ' '){
                newWord += '_';
            }
            else{
                newWord += ' '
            }
        }
        activeWord = newWord;
        // Reinitializes the wrong letters array
        wrongLetters = [];
        console.log(solution);
        console.log(activeWord);
    }

    // Initializing guessess and wins counters
    let guesses = 10;
    let wins = 0;
    
    // Setting initial input prompt
    $('#input-prompt').text('Guess any letter!');

    // Calling displayUpdate with gameOver as false   
    displayUpdate(false);

    // Core gameplay loop
    $(document).keydown(function(event) {
        
        // Gets capital character of key typed
        let input = String.fromCharCode(event.which);
        
        // Checks if input string is a letter in the alphabet
        let alphabetTest = alphabet.find(i => i.letter === input);
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
        if (activeWord === solution){
            wins++;
            guesses = 10;
            
            // Updates to show completed word before initializing new game
            displayUpdate(false);
            wordInitializer();
            $('#input-prompt').text('Congratulations! You Won!');

            //  Updates to show new active word after timer delay
            setTimeout(function() {displayUpdate(true); }, 5000);
        }
        
        // Or if player lost
        else if (guesses === 0){
            guesses = 10;

            // Updates to show completed word before initializing new game
            displayUpdate(false);
            wordInitializer();
            $('#input-prompt').text('Sorry, out of guesses. Try again!');

            //  Updates to show new active word after timer delay
            setTimeout(function() {displayUpdate(true); }, 5000);
        }

        // Otherwise just updates strings and HTML
        else{
            displayUpdate(false);
        }
    })

    // Updates strings for all relevant HTML elements
    function displayUpdate(newGame){
        $('#word-display').text(activeWord);
        $('#guesses-remaining').text(`Guesses remaining: ${guesses}`);
        $('#win-counter').text(`Wins: ${wins}`);

        // Passing to HTML here to allow line break tag
        $('#wrong-letters').html('Tried Letters: <br>' + wrongLetters.join(', '));
        
        // If new game, then reinitialize input prompt
        if (newGame){
            $('#input-prompt').text('Guess any letter!');
        }
    }
    // Checks if the chosen letter is in the solution for activeWord and updates accordingly
    function letterChecker(letter){
        
        // Dumps solution and activeWord strings into temp arrays
        let tempSolution = solution.split(' ');
        let tempActiveWord = activeWord.split(' ');
        
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
            guesses--;
        
            // Add wrong guess to array
            wrongLetters.push(`"${letter}"`);
        }
        
        // Otherwise update activeWord
        else {
            activeWord = tempActiveWord.join(' ');
        }
    }
})