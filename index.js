const AllQuestions = [{
        question: "The young man was well-dressed because?",
        possibleAnswers: [
            "it was his habit to dress well",
            "it was his wedding day",
            "he wanted to meet the manager of the shop",
            "he wanted to impress the salesmen",
        ],
        correctAnswer: "he wanted to impress the salesmen",
    },
    {
        question: "The salesmen in the shop are described as people who pay attention to",
        possibleAnswers: [
            "only young men and women",
            "pretty women",
            "only rich customers",
            "regular customers",
        ],
        correctAnswer: "only rich customers",
    },
    {
        question: "The young man moved away to the hosiery section because he",
        possibleAnswers: [
            "was not interested in purchasing anything now",
            "did not like the readymade clothes",
            "wanted better clothes",
            "was restless",
        ],
        correctAnswer: "was not interested in purchasing anything now",
    },
    {
        question: "The manager asked the young man what he wanted because",
        possibleAnswers: [
            "he would give him exactly what he was looking for",
            "the salesman had drawn his attention to the indifferent attitude of the young man",
            "he thought they could do more business with him that way",
            "he thought the visitor was dissatisfied",
        ],
        correctAnswer: "the salesman had drawn his attention to the indifferent attitude of the young man",
    },
    {
        question: "The young man left without making purchases because he",
        possibleAnswers: [
            "did not have money",
            "could not find any item of his choice",
            "had come only to make a point about the indifferent attitude of the salesmen towards casually dressed customers",
            "decided to come to make the purchases later on",
        ],
        correctAnswer: "had come only to make a point about the indifferent attitude of the salesmen towards casually dressed customers",
    },
    {
        question: "What time of the day did this event take place?",
        possibleAnswers: ["Morning", "Evening", "Noon", "Midnight"],
        correctAnswer: "Evening",
    },
    {
        question: "What's the name of the young man?",
        possibleAnswers: ["Abiodun", "Abey", "Abdul", "Abel"],
        correctAnswer: "Abiodun",
    },
    {
        question: "How many times did the man come to the store that day?",
        possibleAnswers: ["Once", "Twice", "Thrice", "Four times"],
        correctAnswer: "Twice",
    },
    {
        question: "How many textiles did he buy?",
        possibleAnswers: ["4", "3", "5", "0"],
        correctAnswer: "0",
    },
    {
        question: "What's the title of the story?",
        possibleAnswers: [
            "VANITY AND PRIDE",
            "VAIN MAN",
            "PRIDE",
            "VAIN AND PROUD",
        ],
        correctAnswer: "VANITY AND PRIDE",
    },
];

const essay = document.querySelector("section.essay");
const quizContainer = document.querySelector("section.quiz");
const QAndAWrapper = document.querySelector(".questions-answers");
const proceedBtn = document.querySelector(".go-to-quiz button");
const showResultCont = document.querySelector("section.result");
const timerCont = document.querySelector(".timer");
const timer = timerCont.querySelector(".inner");
let TIME = 45;

//The width to add based on the TIME SET
const timerIncreaseRate = (1 / TIME) * 100;

const scores = [];
let shuffledQuestions;
let currentQuestionIndex = 0;
let intervalId;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function proceedToQuiz() {
    essay.classList.add("out");
    setTimeout(() => {
        essay.style.display = "none";
        quizContainer.style.display = "block";
        quizContainer.classList.add("in");
    }, 350);
    initQuiz();
}

function initQuiz() {
    shuffledQuestions = shuffle(AllQuestions);
    setNextQuestion();
}

initQuiz();

function verifyAnswerAndMoveOn() {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const answers = document.querySelector(".answers");
    let pickedAnswer;
    if (answers.querySelector('input[type="radio"]:checked')) {
        pickedAnswer = answers.querySelector('input[type="radio"]:checked').value;
    } else {
        pickedAnswer = null;
    }

    // compare correct answer with picked answer
    if (pickedAnswer == currentQuestion.correctAnswer) {
        scores.push(1);
    } else {
        scores.push(0);
    }
    currentQuestionIndex = currentQuestionIndex + 1;

    //Check if we have reached the last question already
    if (currentQuestionIndex > shuffledQuestions.length - 1) {
        console.log(scores);
        console.log("DONE");
        resetTimer(intervalId);
        showResult();
        return;
    }
    setNextQuestion();
}

function setNextQuestion() {
    //set the current question number in the DOM
    const _number = document.querySelector(".number p");
    _number.querySelector(".current").textContent = currentQuestionIndex + 1;
    _number.querySelector(".total").textContent = AllQuestions.length;

    // set the current Question and its options in the DOM
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const question = QAndAWrapper.querySelector(".question");
    const answers = document.querySelector(".answers");
    question.textContent = currentQuestion.question;

    //Shuffle the answers before rendering to the DOM
    answers.innerHTML = shuffle(currentQuestion.possibleAnswers)
        .map((val) => {
            return ` <label>
        <input type="radio" name="answer" value="${val}">
        <p>${val} <span></span> </p>
    </label>`;
        })
        .join("");

    // Reset and start timer all over.
    resetTimer(intervalId);
    setTimer();
}

function setTimer() {
    let currentTime = 0;
    intervalId = setInterval(() => {
        if (currentTime == TIME) {
            return verifyAnswerAndMoveOn();
        }

        //Adjust timer width
        const prevWidth = timer.style.width.replace("%", "");
        timer.style.width = +prevWidth + timerIncreaseRate + "%";
        currentTime++;
        timerCont.querySelector("span").textContent = currentTime;
    }, 1000);
}

function resetTimer(id) {
    timerCont.querySelector("span").textContent = 0;
    timer.style.width = "0%";
    clearInterval(id);
}

function showResult() {
    essay.style.display = "none";
    quizContainer.style.display = "none";
    showResultCont.style.display = "block";
    showResultCont.classList.add("in");
    calculateScore();
}

function calculateScore() {
    const result = scores.reduce((a, b) => {
        return a + b;
    });
    let feedback;
    const resultInPercent = ((result / AllQuestions.length) * 100).toFixed(0);
    feedback =
        resultInPercent >= 75 ?
        "You passed and can move on to the next phase!" :
        "We're sorry, but we can't proceed with this Application";
    showResultCont.innerHTML = `
     <div>You scored: <span>${resultInPercent}%</span></div>
    <div class="feedback">${feedback}</div>`;
}