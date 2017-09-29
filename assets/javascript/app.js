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
	scoreArr: [500,400,300,200,100],
	nameArr: ['AAA','BBB','CCC','DDD','EEE'],

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

	pickQuestion: function () {
		if (!game.reset) {
			$('.main').show();
			$('.timer-box').show();
			$('.question').show();
			$('.image-box').empty();
			$('.answers').show();
			game.questionCount++;
			console.log('question count:', game.questionCount);
			game.gameOver = false;
			
			game.clearTimer();
			game.setTimer();
			$('.timer-box').show();
			var random = Math.floor(Math.random() * 548);
			game.current = questionArr[random];
			console.log('for debugging: ',game.current);
			$('.question').html('<h2 id="question">'+game.current.question+'</h2>');
			$('.answers').html('<h3 class="answer" id="A">A: '+game.current.A+'<h3/>'+
								'<h3 class="answer" id="B">B: '+game.current.B+'<h3/>'+
								'<h3 class="answer" id="C">C: '+game.current.C+'<h3/>'+
								'<h3 class="answer" id="D">D: '+game.current.D+'<h3/>');
			$('.quiz-box').fadeIn('fast');
		}
	},

	setTimer: function () {
		game.timer = 30;
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
		var tag = game.current[game.current.answer];
		if (Number.isInteger(tag)){
			tag = tag.toString();
		}
		tag = tag.split(" ").join("+");
		console.log('tag is : ', tag);
		var queryURL = "https://api.giphy.com/v1/gifs/random"
		queryURL += '?' + $.param({
		  'api_key': "vM9vIaMqN7X9I2ar4hHiG2SD8bYv5Zgm",
		  'tag': tag,
		  'rating': 'g'
		});
		console.log('query: ', queryURL);
	 	$.ajax({
	      url: queryURL,
	      method: 'GET'
	    }).done(function(response) {
	    	var src = response.data.fixed_height_downsampled_url;
	    	 $('.image-box').html("<img class='text-center' src=" + src + ">") 
	    });
 	},

 	gameEnd: function () {
 		if (game.questionCount>=10) {
 			game.reset = true;
 			setTimeout(function () {
 				$('.image-box').empty();
 				$('.timer-box').hide();
	 			$('.question').hide();
	 			$('.stats-box').html('<h2>Your score is: '+game.score+'</h2>'+
					'<h2>Number of correct answers: '+game.correct+'</h2>'+
					'<h2>Number of incorrect answers: '+game.inCorrect+'</h2>'+
					'<h2>Number of times that time ran out: '+game.timeUp+'</h2>'+
					'<button class="start btn btn-warning">Play Again?</button>');
 			}, 1000*6);
 			var correctScore = game.correct*10;
 			var incorrectScore = game.inCorrect*10;
 			var timeUpScore = game.timeUp*5;
 			var timeScore = game.timeRemaining*2;
 			game.score = correctScore + timeScore - incorrectScore - timeUpScore; 
 			game.writeScore();
 		}	
 	},

 	writeScore: function (score) {
		for (var i = 0; i < game.scoreArr.length; i++){
			var index = i + 1;
			$('.item' + index).text(game.scoreArr[i] + " ");
			$('.name' + index).text(" " + game.nameArr[i]);
 			if (game.score > game.scoreArr[i]) {
 				var name = prompt('What are your initials?  3 letter max ').substring(0,3).toUpperCase();
 				game.nameArr.splice(i, 0, name);
 				game.scoreArr.splice(i, 0, game.score);
 				game.scoreArr.pop(); 
 				game.nameArr.pop(); 		 		
 				// var index = i + 1;
				$('.item' + index).text(game.scoreArr[i] + " ");
				$('.name' + index).text(" " + game.nameArr[i]);
 				return;			
 			}
 		}
 		game.score = 0;
 	}
}//end of game object

//event listeners
$(document).on('click', '.start', function () {
	$('.start').hide();
	$('.score-box').show();
	game.writeScore();
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