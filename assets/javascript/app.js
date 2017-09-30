$(document).ready(function () {

//starts background music on load
	background.play();

	/////////////////////////////////game object/////////////////////////////////////

	var game = {
		//game variables
		current: '',
		interval: '',
		answer: '',
		timer: 0,
		questionCount: 0,	
		correct: 0,
		inCorrect: 0,
		timeUp: 0,
		timeRemaining: 0,
		score: 0,
		gameOver: false,
		reset: false,	
		scoreArr: [500,400,300,200,100],
		nameArr: ['AAA','BBB','CCC','DDD','EEE'],

		applauseSound: function () {
			var snd1  = new Audio();
			var src1  = document.createElement("source");
			src1.type = "audio/mpeg";
			src1.src  = "assets/audio/applause.mp3";
			snd1.appendChild(src1);
			snd1.play();
		},

		incorrectSound: function () {
			var snd2  = new Audio();
			var src2  = document.createElement("source");
			src2.type = "audio/mpeg";
			src2.src  = "assets/audio/incorrect.mp3";
			snd2.appendChild(src2);
			snd2.play();
		},

		correctSound: function () {
			var snd3  = new Audio();
			var src3  = document.createElement("source");
			src3.type = "audio/mpeg";
			src3.src  = "assets/audio/correct.mp3";
			snd3.appendChild(src3);
			snd3.play();
		},

		//method that resets game to start state
		startState: function () {
			//stops hover events on title elements
			$('.titles').css({
				'pointer-events': 'none'
			});
			//writes scores to screen
			game.writeScore();
			//removes stats
			// $('.stats-box').empty();
			//resets variables
			game.timeUp = 0;
			game.correct = 0;
			game.inCorrect = 0;
			game.gameOver = false;
			game.reset = false;
			game.questionCount =  0;
			game.timeRemaining = 0;
			game.score = 0;
			//picks the first question
			game.pickQuestion();
			$('.timer').text('30');
		},//end of startState method

		//method where question is picked and displayed to screen
		pickQuestion: function () {
			//conditional checks flag to make sure game hasn't been reset
			if (!game.reset) {
				//setting display of different elements 
				$('.main').show();
				$('.timer-box').show();
				$('.question').show();
				$('.image-box').empty();
				$('.answers').show();
				//incrementing variable that tracks number of questions
				game.questionCount++;
				//flag variable that checks if question answered
				game.gameOver = false;
				//resets timer
				game.clearTimer(game.interval);
				game.setTimer();

				//generates random question from questionArr
				var random = Math.floor(Math.random() * questionArr.length);
				game.current = questionArr[random];
				console.log('for debugging: ',game.current);
				//writes question to the screen
				$('.question').html('<h1 id="question">'+game.current.question+'</h1>');
				$('.answers').html('<h3 class="answer" id="A">A: '+game.current.A+'<h3/>'+
									'<h3 class="answer" id="B">B: '+game.current.B+'<h3/>'+
									'<h3 class="answer" id="C">C: '+game.current.C+'<h3/>'+
									'<h3 class="answer" id="D">D: '+game.current.D+'<h3/>');
			}
		},//end of pickQuestion method

		//method that sets timer and runs time related duties
		setTimer: function () {
			//resets timer to 30 seconds
			game.timer = 30;
			//shows timer
			$('.timer').show();
			//setInterval function
			game.interval = setInterval(function () {
				//decrements timer every second and writes it to the screen
				game.timer--;
				console.log(game.timer);
				$('.timer').html(game.timer);
				//conditional to check when timer runs out
				if (game.timer<=0) {
					//plays buzzer sound
					game.incorrectSound();
					//shows image
					game.getGiph();
					//writes time's up message to screen
					game.showCorrect("Time's up!  ");
					//removes answers from screen
					$('.answers').empty();
					//increments timeUp variable to track condition
					game.timeUp++;
					//sets gameOver flag
					game.gameOver = true;
					//clears timer
					game.clearTimer(game.interval);
					console.log('time\'s up! you have run out this many times: ', game.timeUp);
					//runs gameEnd method
					game.gameEnd();
					//sets 5s timeout for new question to be picked to give time for image to display
					setTimeout(function () {
						game.pickQuestion();
					}, 1000*5);
				}
			}, 1000)
		},//end of setTimer method

		//method that clears timer
		clearTimer: function (variable) {
			clearInterval(variable);
		},

		//method that checks win and loss conditions
		checkCorrect: function () {
				//clears timer
				game.clearTimer(game.interval);
				//sets 5s timeout for new question to be picked to give time for image to display
				setTimeout(function () {
					game.pickQuestion();
				}, 1000*5);
			//conditional checks clicked answer against correct answer only when timer > 0
			if (game.answer===game.current.answer && game.timer>0) {
				//plays bell sound
				game.correctSound();			
				//increments variable that tracks correct answers
				game.correct++;
				//adds remaining time to variable for score calculation
				game.timeRemaining+=game.timer;
				//displays gif image
				game.getGiph();
				//removes answers so they can't be double clicked
				$('.answers').empty();
				//writes correct message to the screen
				game.showCorrect("Correct!  ");
				//sets gameOver flag to true
				game.gameOver = true;
			}
			//if answer isn't correct, this block runs
			else {
				//plays buzzer sound
				game.incorrectSound();
				//increments variable that tracks incorrect answers
				game.inCorrect++;
				//shows image
				game.getGiph();
				//shows correct answer
				game.showCorrect("Incorrect answer!  ");
				//removes answers so they can't be double clicked
				$('.answers').empty();
				//sets gameOver flag to true
				game.gameOver = true;
			}
		},//end of checkCorrect method

		//method that writes correct answer to screen, and message that tells whether won or lost
		showCorrect: function (value) {
			$('.question').html('<h2>'+value+'The correct answer is "'+game.current[game.current.answer]+'"</h2>');
		},

		//method that fetches gifs from Giphy API
		getGiph: function () { 
			//variable that stores the keyword search term
			var tag = game.current.keyword;
			//conditional checks if tag is an integet and converts it to a string
			if (Number.isInteger(tag)){
				tag = tag.toString();
			}
			//checks tag for spaces and replaces them with +
			tag = tag.split(" ").join("+");
			//variable that stores concatenated URL for API query
			var queryURL = "https://api.giphy.com/v1/gifs/random"
			queryURL += '?' + $.param({
			  'api_key': "vM9vIaMqN7X9I2ar4hHiG2SD8bYv5Zgm",
			  'tag': tag,
			  'rating': 'pg13'
			});
			console.log('query: ', queryURL);
			//ajax 'GET' call
		 	$.ajax({
		      url: queryURL,
		      method: 'GET'
		      //done takes returned response
		    }).done(function(response) {
		    	//and prints related fixed height gif to screen
		    	var src = response.data.fixed_height_downsampled_url;
		    	 $('.image-box').html("<img class='text-center' src=" + src + ">") 
		    });
	 	},//end of getGiph method

	 	//method that checks conditions and creates end game environment
	 	gameEnd: function () {
	 		//conditional checks when 10 questions have been shown
	 		if (game.questionCount>=10) {
	 			//timeout plays applause sound as stats display
	 			setTimeout(function () {game.applauseSound();},5000);
	 			//reset flag is set to true 
	 			game.reset = true;
	 			//5s timeout to allow user to see last image before stats are written to screen
	 			setTimeout(function () {
	 				$('.image-box').empty();
	 				$('.timer-box').hide();
		 			$('.question').hide();
		 			$('.stats-box').html('<h2>Your score is: '+game.score+'</h2>'+
						'<h2>Number of correct answers: '+game.correct+'</h2>'+
						'<h2>Number of incorrect answers: '+game.inCorrect+'</h2>'+
						'<h2>Number of times that time ran out: '+game.timeUp+'</h2>'+
						'<button id="playAgain" class="start btn btn-warning">Play Again?</button>');
	 			}, 1000*5);
	 			//variables that store and calculate end game score
	 			var correctScore = game.correct*10;
	 			var incorrectScore = game.inCorrect*10;
	 			var timeUpScore = game.timeUp*5;
	 			var timeScore = game.timeRemaining*2;
	 			//score is weighted heavily to reward fast answers.  
	 			//Max score possible is 700, 680 for humans.
	 			game.score = correctScore + timeScore - incorrectScore - timeUpScore; 
	 			//5.5 second timeout to keep name capture prompt from showing
	 			//before stats can display to screen
	 			setTimeout(function () {
	 				game.writeScore();
	 			},1000 * 5.5);
	 		}	
	 	},//end of gameEnd method

	 	//method that writes scores and name to scoreboard
	 	writeScore: function () {
	 		//loops through scoreArr
			for (var i = 0; i < game.scoreArr.length; i++){
				//conditional checks if user score is higher than index score 
				//only if game has been reset
	 			if (game.score > game.scoreArr[i] && game.reset) {
	 				//if so, prompt captures user initials, ensures 
	 				//only first 3 letters are captured uppercase
	 				var name = prompt('What are your initials?  3 letter max ').substring(0,3).toUpperCase();
	 				//user name and score are spliced into the arrays at correct index
	 				game.nameArr.splice(i, 0, name);
	 				game.scoreArr.splice(i, 0, game.score);
	 				//lowest score is bumped off of scoreboard
	 				game.scoreArr.pop(); 
	 				game.nameArr.pop();
	 				//breaks out of loop so that all scores lower aren't overwritten 		 		
	 				break;		
	 			}
	 		}//end of first for loop
	 		//loop that fires to writes names and scores to screen
	 		for (var i = 0; i < game.scoreArr.length; i++){
	 			//variable that changes zero based index to 1 based index for class names
	 			var index = i + 1;
	 			//writes each index of scoreArr and nameArr to screen 
	 			$('.item' + index).text(game.scoreArr[i] + " ");
				$('.name' + index).text(" " + game.nameArr[i]);
	 		}//end of second for loop
	 		//resets user's score to 0 after write
	 		game.score = 0;
	 	}//end of writeScore method

	}//end of game object

	/////////////////////event listeners///////////////////////

	//start button event listener
	$(document).on('click', '.start', function () {
		//hides start button and shows score box when clicked
		$('.start').hide();
		$('.score-box').show();
		//runs startState method
		game.startState();
	});
	//answer click events
	$(document).on('click', '.answer', function () {
		//conditional checks gameOver and reset flags so additional clicks aren't registered
		if (!game.gameOver && !game.reset) {
			//variable stores id of clicked answer for use in other methods
			game.answer = $(this).attr('id');
			//checks if answer is correct
			game.checkCorrect();
			//and tests end game conditions
			game.gameEnd();
		}
	});
});//end of document ready function