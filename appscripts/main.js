// Lim Chuan Yong, Alden (A0118870B)
// Tay Ming Fang Audrey (A0127113W)
require(
    [],
    function () {
            
        console.log("yo, I'm alive!");

        // Create paper to put raphael objects
        var paper = new Raphael(document.getElementById("mySVGCanvas"));

        // put the width and heigth of the canvas into variables for our own convenience
        var pWidth = paper.canvas.offsetWidth;
        var pHeight = paper.canvas.offsetHeight;
        console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);




        /////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////
        //                     GAME INITIALIZATION FUNCTIONS & VARs                    // 
        /////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////

        // Game state variables
        var counter = 0;    // counts clicks on target object   
        var duration = 10;  // set length of game
        var speed = 20;     // difficulty of game, modifies setinterval value

        // Start button with text on top
        var startButton = paper.circle(300, 200, 50);
        var startText = paper.text(300, 200, 'START');
        startButton.attr({
            'stroke': "black",
            'stroke-width': 5,
            'fill': "#BCC1F2",

        });
        startText.attr({
            'font-size': '18px', 'font-weight':'800', 'font-family': 'Rockwell',
        });

        // Hide for now, show it only when we are ready
        startButton.hide();
        startText.hide();

        // unhides the start button
        var ready = function(){
            startButton.show();
            startText.show();
        };

        // Called after instructions to initialize game
        var start = function (value){
            console.log("game is starting with difficulty level of " + value);

            counter = 0;    // reset counter to 0

            // Hide the start buttons
            startButton.hide();
            startText.hide();

            // Initializes game object, controller, and speed
            if (value === 1){speed = 30;}   // difficulty level 1 = slowest movement; every 30ms update rect1
            if (value === 2){speed = 20;}
            if (value === 3){speed = 10;}
            if (value === 4){speed = 5;}
            if (value === 5){speed = 1;}    // difficulty level 5 = fastest movement; every 1ms update rect1
            console.log("speed is " + speed);
            timer(duration);    // pass value of duration to timer to start timer
            moveSquare();   // starts the game
        };

        // Displays game instructions and requests player to select difficulty
        var instructions = function (){
            console.log("Displaying instructions");

            // Prompt with instructions and ability for player to select difficulty
            do{
                // Show the prompt
                var selectDifficulty = parseInt(window.prompt("Greetings Astronaut!\n\nAestroids are going to destroy earth! Destroy as many as you can within " + duration + " seconds by clicking on the brown square!\n\nPlease choose your preferred difficulty from 1 (easiest) to 5 (hardest):", ""), 10);
            }while(isNaN(selectDifficulty) || selectDifficulty > 5 || selectDifficulty < 1);    // Prevent other values other than 1 to 5 to pass

            // Pass player selected difficulty to start function
            start(selectDifficulty);

        };

        // Upon clicking START, load instructions prompt
        startButton.node.addEventListener('click', instructions);
        startText.node.addEventListener('click', instructions);     // To solve inconsistency when clicking on text not causing the game to start

        // Create the target rect and put it "off screen" where it can't be seen until the game starts
        var rect1 = paper.rect(-100,-100,100, 100);
        rect1.attr({
            'fill': "#d4a58a",
            'stroke': '#3b4449',
            'stroke-width': 10,
            'stroke-linejoin': 'round',
            'opacity': .75
        });

        // Change of colour for start button when player's mouse is hovering over the start button. Serves as a visual feedback.
        startButton.node.addEventListener('mouseover', function(ev){
            startButton.attr({
                'fill': "#DB5844"
            })
        });

        startButton.node.addEventListener('mouseout', function(ev){
            startButton.attr({
                'fill': "#BCC1F2"
            })
        });

        startText.node.addEventListener('mouseover', function(ev){      // To solve inconsistency when hovering over text causing the button to be not in hover state
            startButton.attr({
                'fill': "#DB5844"
            })
        });

        startText.node.addEventListener('mouseout', function(ev){      // To solve inconsistency when hovering over text causing the button to be not in hover state
            startButton.attr({
                'fill': "#BCC1F2"
            })
        });






        /////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////
        //                       CORE GAME FUNCTIONS AND VARIABLES                     // 
        /////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////

        // Return a random integer between m and n inclusive
         var randInt = function( m, n ) {
            var range = n-m+1;
            var frand = Math.random()*range;
            return m+Math.floor(frand);
        };

        // Move the rect1 to a new random location
        var moveSquare = function(){
 
            // Reveal rect1 to click
            rect1.show();

            // temp vars to hold the new rect1 position indexes
            var posX, posY;
            
             // get the (random) positions using the randInt function earlier, constrainted by size of paper - 1 as rect start from 0,0 and size 100px by 100px (so that randInt will not put rect1 outside paper)
            posX = randInt(0,5);
            posY = randInt(0,3);

            // Use the positions generated earlier to move the target rect1
            rect1.attr({
                x: posX*100,    
                y: posY*100
            });

            // Rect1 properties to allow constant motion to start from new random position set in rect1.attr just above this
            rect1.posX = posX*100;
            rect1.posY = posY*100;

            // Create setInterval with label intervalSquare to allow constant motion of rect1 and to allow clearInterval to to remove interval later on
            intervalSquare = setInterval(moveDirection,speed);  // update rect1 position (through moveDirection function) every var speed second as modified before game start

        };

        // Rate of rect1 movement, how many pixels x,y every interval update
        rect1.xrate = 2;
        rect1.yrate = 2;

        // Function for creating constant motion of rect1
        var moveDirection = function(){

            // Update the position where we want our rect1 to be
            rect1.posX += rect1.xrate;
            rect1.posY += rect1.yrate;

            //console.log(rect1.posX + " is cur x, " + rect1.posY + " is cur y.")

            // Move rect1 by updated posx posy value calculated above
            rect1.attr({'x': rect1.posX, 'y': rect1.posY});

            // Keep the object on the paper by reversing xrate and yrate from positive to negative and vice-versa depending on which position
            if (rect1.posX + 100 > pWidth) {rect1.xrate = -rect1.xrate;}       // posX+100 because rect x,y starts from 0,0 and size is 100px by 100px
            if (rect1.posY + 100 > pHeight) {rect1.yrate = -rect1.yrate;}       // posY+100 because rect x,y starts from 0,0 and size is 100px by 100px
            if (rect1.posX < 0) {rect1.xrate = -rect1.xrate;}
            if (rect1.posY < 0) {rect1.yrate = -rect1.yrate;}
        };

        // Game controller determining when the game will end based on var duration set earlier
        var timer = function(duration){

            setTimeout(function(){ 
                console.log("Game over!");

                // Clear interval (label = intervalSquare set in moveSquare function) when game is over to reduce unnecessary movement when game is idling
                clearInterval(intervalSquare);

                // Javascript prompt to inform player of their score (var counter) when game ends after var duration seconds
                confirm("You have destroyed " + counter + " aestroids within " + duration + " seconds!\n\n Thank you for playing a part to help save Earth!");
                
                // Hides the rect1 when game is over
                rect1.hide();

                // Show the start button for another round
                ready();

            }, duration*1000); //setTimeout takes value as miliseconds so seconds * 1000
        };

        // Click function to record clicks on rect1
        rect1.node.addEventListener('click', function(){
            
            // Counts the number of clicks made so far
            counter++;
            console.log("your square move count is now " + counter);
            
            // Sound effect
            var explode = new Audio("resources/explode.wav");
            explode.play();

            //Clear interval for constant motion to prevent doubling of speed due to xrate and yrate each time rect1 is clicked
            clearInterval(intervalSquare);

            //Call the moveSquare function to change the position of rect1 to a random position after each succesfull click to prevent predictive clicks due to constant motion           
            moveSquare();
        });

  
        // Put the start button on the screen as this module loads so we are ready to play
        ready(); 
    }
);