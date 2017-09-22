var questionArray = [history, math, science];
var category;
var current;
var answer;
var answerChosen;
var answerCorrect;
var answerIncorrect;
var correctCounter = 0;
var incorrectCounter = 0;
var timeUpCounter = 0;
var questionGenerated;
var counter;
var time;
var timeUp;
var min;
var max;
var randIndex;
var categoryString;
var questionCount = 0;
var gameOver = false;
var startTime;

var americanHistory = [
    {   question: "Who is buried in Grant's tomb?",
		answer1: "Bob",
		answer2: "Sally",
		answer3: "Grant",
		answer4: "Jose", 
		correctAnswer: "Grant"
	},

	{   question: "What year was the war of 1812 fought?",
		answer1: "1899",
		answer2: "2155",
		answer3: "3",
		answer4: "1812", 
		correctAnswer: "1812"
	},

	{	question: "Who is the sexiest man alive?",
		answer1: "Marco",
		answer2: "Marco",
		answer3: "Marco",
		answer4: "Marco", 
		correctAnswer: "Marco"
	}
];

var math = [

	{   question: "What is the square root of 49?",
		answer1: "Bob",
		answer2: "Sally",
		answer3: "7",
		answer4: "Jose", 
		correctAnswer: "7"
	},

	{   question: "What is 1819 - the square root of 49?",
		answer1: "1899",
		answer2: "2155",
		answer3: "3",
		answer4: "1812", 
		correctAnswer: "1812"
	},

	{	question: "Who is the sexiest man alive?",
		answer1: "Still Marco",
		answer2: "Still Marco",
		answer3: "Still Marco",
		answer4: "Still Marco", 
		correctAnswer: "Still Marco"
	}
];

var science = [

	{   question: "How far away is the sun?",
		answer1: "Bob",
		answer2: "Sally",
		answer3: "93 Million Miles",
		answer4: "Jose", 
		correctAnswer:"93 Million Miles"
	},

	{   question: "What is the year after 1811?",
		answer1: "1899",
		answer2: "2155",
		answer3: "3",
		answer4: "1812", 
		correctAnswer: "1812"
	},

	{	question: "Who is the sexiest man alive?",
		answer1: "Always Marco",
		answer2: "Always Marco",
		answer3: "Always Marco",
		answer4: "Always Marco", 
		correctAnswer: "Always Marco"
	}
];

function random (min, max) {
	return Math.floor(Math.random()*(max - min + 1) + min);
}

function startState () {
	startTime = false;
	questionGenerated = false; 
	gameOver = false;
	correctCounter = 0;
    incorrectCounter = 0;
    timeUpCounter = 0;
    questionCount = 0;
    $('.category').show();
    $('.answer-box').hide();
    $('.timer').hide();
    $('.stats-box').hide();
}

function displayQuestion (question, answer1, answer2, answer3, answer4) {
	$('.answer-box').append(
		'<div class="question">' + question + '</div><br><button class="answer">' + answer1 + '</button><br><button class="answer">' + answer2 + '</button><br><button class="answer">' + answer3 + '</button><br><button class="answer">' + answer4 + '</button>'
		);
	questionGenerated = true;
}

function generateQuestion() {
	$('.answer-box').show();
		$('.timer').show();
	clearInterval(counter);
	displayTimer();
	category = window[categoryString];
	var min = 0;
	var max = category.length - 1;
	randIndex = random(min,max);
	current = category[randIndex];	
	if (!questionGenerated) {
		 $('.answer-box').empty();
		 $('.answer-box').show();
		displayQuestion(current.question, current.answer1, current.answer2, current.answer3, current.answer4);
	}
}

function displayTimer () {
	clearInterval(counter);
	time = 30;
	if (startTime) {
		counter = setInterval(function () {
			time--
			if (time<=0 ) {
				$('.answer-box').hide();
				// clearTimer();
				timeUp = true;
				console.log('time up!')	
				timeUpCounter++
				questionCount++;
				console.log('timeUpCounter:', timeUpCounter)
				clearInterval(counter);
				
				gameEnd();
				
				nextQuestion();
			}
			$('.timer').html('<p>'+time+'</p>');
		}, 1000);
	}

}

function clearTimer() {
	time = 30;
	clearInterval(counter);
	$('.timer').html('<p>'+time+'</p>');
}

function nextQuestion () {
	if (timeUp || answerCorrect || answerIncorrect ) {
		questionGenerated = false;
		timeUp = false;
		answerCorrect = false;
		answerIncorrect = false;
		$('.answer-box').empty();
		generateQuestion();
	}
}

function gameEnd () {
	if (questionCount>=5) {
		gameOver = true;
		startTime = false;
		clearInterval(counter);
		var stats = '<p>Number of correct answers: '+ correctCounter +'</p><p>Number of incorrect answers: '+ incorrectCounter +'</p><p>Number of times unanswered: '+ timeUpCounter +'</p>';
		$('.answer-box, .timer').hide();
		$('.stats-box').show();
		$('.stats-box').html(stats);

		var timeout1 = setTimeout(function () {
			startState();
		},1000*4);	
	}
}

$('body').on('click', '.category-button', function () {
		categoryString = $(this).val();
		$('.category').hide();
		startTime = true;
		generateQuestion();	
});

$('body').on('click','.answer', function() {
	if (!gameOver) {
		if(!answerChosen) {
			questionCount++;
			answer = $(this).text();
			clearTimer();
			if (answer === current.correctAnswer ) {
				console.log('correct questionCount: ',questionCount);
				console.log('correct');
				answerCorrect = true;
				correctCounter++;
				nextQuestion();
			} 
			else {
				console.log('incorrect questionCount: ',questionCount);
				console.log('incorrect');
				answerIncorrect = true;
				incorrectCounter++;
				$('button:contains(current.correctAnswer)').addClass('correctClass');
				setTimeout(function () {
					nextQuestion();
				}, 1000);	
			}	
		}
		gameEnd();
	}
});