$(document).ready(function () {

var game = {

	current: '',
	timer: 0,
	interval: '',
	answer: '',
	correct: 0,
	inCorrect: 0,
	timeUp: 0,
	gameOver: false,
	questionCount: 0,
	reset: false,
	timeRemaining: 0,
	score: 0,
	scoreArr: [],

	startState: function () {
		$('.stats-box').empty();
		game.timeUp = 0;
		game.correct = 0;
		game.inCorrect = 0;
		game.gameOver = false;
		game.reset = false;
		game.questionCount =  0;
		game.timeRemaining = 0;
		game.score = 0;
		game.pickQuestion();
	},

	startGame: function () {
		$('.timer-box').hide();
	},

	pickQuestion: function () {
		if (!game.reset) {

			$('.main').show();
			$('.timer-box').show();
			game.questionCount++;
			console.log('question count:', game.questionCount);
			game.gameOver = false;
			$('.image-box').empty();
			$('.answers').show();
			game.clearTimer();
			game.setTimer();
			$('.timer-box').show();
			var random = Math.floor(Math.random() * 548);
			game.current = questionArr[random];
			$('.question').html('<h2 id="question">'+game.current.question+'</h2>');
			$('.answers').html('<h3 class="answer" id="A">A: '+game.current.A+'<h3/>'+
								'<h3 class="answer" id="B">B: '+game.current.B+'<h3/>'+
								'<h3 class="answer" id="C">C: '+game.current.C+'<h3/>'+
								'<h3 class="answer" id="D">D: '+game.current.D+'<h3/>');
			$('.quiz-box').fadeIn('fast');
		}
	},

	setTimer: function () {
		game.timer = 31;
		$('.timer').show();
		game.interval = setInterval(function () {
			game.timer--;
			console.log(game.timer);
			$('.timer').html(game.timer);
			if (game.timer<=0) {

				game.getGiph();
				game.showCorrect("Time's up!  ");
				$('.answers').empty();
				game.timeUp++;
				game.gameOver = true;
				game.clearTimer();
				console.log('time\'s up! you have run out this many times: ', game.timeUp);
				game.gameEnd();
				setTimeout(function () {
					game.pickQuestion();
				}, 1000*6);
			}
		}, 1000)

	},

	clearTimer: function () {
		clearInterval(game.interval);
	},

	checkCorrect: function () {
			game.clearTimer();
			setTimeout(function () {
				game.pickQuestion();
			}, 1000*6);
		if (game.answer===game.current.answer && game.timer>0) {
			game.correct++;
			game.timeRemaining+=game.timer;
			console.log(game.timeRemaining);
			game.getGiph();
			$('.answers').empty();
			game.showCorrect("Correct!  ");
			game.gameOver = true;
		}
		else {
			game.inCorrect++;
			game.getGiph();
			game.showCorrect();
			game.showCorrect("Incorrect answer!  ");
			$('.answers').empty();
			game.gameOver = true;
		}
	},

	showCorrect: function (value) {
		$('.question').html('<h2>'+value+'The correct answer is "'+game.current[game.current.answer]+'"</h2>');
	},

	getGiph: function () {

	 	queryURL = "https://api.giphy.com/v1/gifs/search?q=" + game.current[game.current.answer] +"&api_key=vM9vIaMqN7X9I2ar4hHiG2SD8bYv5Zgm&limit=20"
	 	$.ajax({
	      url: queryURL,
	      method: 'GET'
	    }).done(function(response) {
	    	var random = Math.floor(Math.random()*response.data.length);
	    	 $('.image-box').html("<img class='img-responsive' src=" + response.data[random].images.downsized.url + ">") 
	    });

 	},

 	gameEnd: function () {

 		if (game.questionCount>=10) {
 			game.reset = true;
 			var correctScore = game.correct*10;
 			var incorrectScore = game.inCorrect*10;
 			var timeUpScore = game.timeUp*5;
 			var timeScore = game.timeRemaining*2;
 			game.score = correctScore + timeScore - incorrectScore - timeUpScore; 
 			$('.stats-box').html('<h2>Your score is: '+game.score+'</h2>'+
 								 '<h2>Number of correct answers: '+game.correct+'</h2>'+
				 				 '<h2>Number of incorrect answers: '+game.inCorrect+'</h2>'+
				 				 '<h2>Number of times that time ran out: '+game.timeUp+'</h2>'+
				 				 '<button class="start">Would you like to play again?</button>');

 		}
 		for (var i = 0; i< game.scoreArr.length; i++){
 			if (game.score > game.scoreArr[i]) {
 				
 			}
 		}
 	},

 	writeScore: function (score) {
 		game.scoreArr.push(score);
 		game.scoreArr.sort();
 		if (game.scoreArr.length>10) {
 			game.scoreArr.pop();
 		}
 		for (var i = 0; i<game.scoreArr.length; i++) {
 			$('.score-box').append(game.scoreArr[i]);
 		}
 		
 	}


}//end of game object

//event listeners
$(document).on('click', '.start', function () {
	$('.start').hide();
	game.pickQuestion();
	if (game.reset) {
		game.startState();
	}
});

$(document).on('click', '.answer', function () {
	if (!game.gameOver && !game.reset) {
		game.answer = $(this).attr('id');
		game.checkCorrect();
		game.gameEnd();
	}
});


});//end of document ready function