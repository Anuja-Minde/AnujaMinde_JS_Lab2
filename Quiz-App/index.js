function Question (questionText, questionNo){

  this.questionText = questionText;
  this.questionNo = questionNo; 
}

const q1 = new Question("What is the name of the most sacred river in India?", 1);
const q2 = new Question("Which of the 5 senses is the first to develop?", 2);
const q3 = new Question("The opposite sides of a dice add up to this number-", 3);
const q4 = new Question("Name the 2nd biggest planet in our solar system", 4);
const q5 = new Question("How many bones does an adult human have?", 5);

function Answer(answerText){

  this.answerText = answerText
}

function QuestionAnswerPair (questionObj, multipleOptionsObj, correctAnswerObj) {

  this.questionObj = questionObj;
  this.multipleOptionsObj = multipleOptionsObj;
  this.correctAnswerObj = correctAnswerObj;

  this.checkAnswer = function(userAnswerText){

    if (correctAnswerObj.answerText === userAnswerText){

      console.log(`Answer is corrrect`);
      return true;
    }else{
      console.log(`Answer is wrong`);
      return false;
    }
  }
}

const qaPair1 = new QuestionAnswerPair(
  q1, [
    new Answer("Yangtzee"), new Answer("Amazon"),
    new Answer("Ganges"), new Answer("Mekong")
  ], 
  new Answer("Ganges")
);

const qaPair2 = new QuestionAnswerPair(
  q2, [
    new Answer("Taste"), new Answer("Smell"),
    new Answer("Sight"), new Answer("Hearing")
  ], 
  new Answer("Smell")
);

const qaPair3 = new QuestionAnswerPair(
  q3, [
    new Answer("5"), new Answer("12"),
    new Answer("6"), new Answer("7")
  ], 
  new Answer("7")
);

const qaPair4 = new QuestionAnswerPair(
  q4, [
    new Answer("Jupiter"), new Answer("Saturn"),
    new Answer("Mars"), new Answer("Venus")
  ], 
  new Answer("Saturn")
);

const qaPair5 = new QuestionAnswerPair(
  q5, [
    new Answer("105"), new Answer("310"),
    new Answer("206"), new Answer("130")
  ], 
  new Answer("206")
);


function QuestionProgressBar (pageIndex, totalNoOfQuestions){

  this.pageIndex = pageIndex;
  this.totalNoOfQuestions = totalNoOfQuestions;

  this.getProgressText = function(){

    const progressText = `Question ${pageIndex + 1} of ${totalNoOfQuestions}`;
    return progressText;
  }
}

function ResultPage(score, markPercentage){

  this.score = score;
  this.markPercentage = markPercentage;

  this.getContent = function(){

    const content = `Your score is : ${score}. Marks percentage is ${markPercentage} %`;
    return content;
  }

  this.display = function(){

    const content = this.getContent();

    const htmlFragment = 
    `
    <h1>Result<h1>
    <h3 id='score'>${content}</h3>
    `;

    const quizElement = document.getElementById("quiz");
    quizElement.innerHTML =  htmlFragment;
  }
}

function QuizPage (pageIndex, qaPair, qaPairArray) {

  this.pageIndex = pageIndex;
  this.qaPair = qaPair;
  this.qaPairArray = qaPairArray;

  this.display = function(){

    const questionElement = document.getElementById("question");
    questionElement.innerHTML = 
      qaPair.questionObj.questionText;

    for (let index = 0; index < qaPair.multipleOptionsObj.length; index ++){

      const answerObj = qaPair.multipleOptionsObj[index];

      const choiceID = "choice" + index;

      const answerChoiceElement = document.getElementById(choiceID);
      answerChoiceElement.innerHTML = answerObj.answerText; 
    }

    const progressElement = document.getElementById("progress");

    const progressBarObj = new QuestionProgressBar(
      this.pageIndex, qaPairArray.length);    
    progressElement.innerHTML = progressBarObj.getProgressText();
  }
}

function QuizApplication (qaPairArray) {

  this.qaPairArray = qaPairArray;
  this.score = 0;
  this.pageIndex = 0;

  this.start = function(){

    this.registerListeners();
    this.displayQuizPage();
  }

  this.registerListeners = function(){

    const currentQuizAppObject = this;

    const buttonsCount = qaPairArray[this.pageIndex].multipleOptionsObj.length;

    for (let index = 0; index < buttonsCount; index ++){

      const buttonId = `btn${index}`;
      const buttonElement = document.getElementById(buttonId);    

      console.log("Invoked successfully...")

      this.associateEventListener(buttonElement, currentQuizAppObject);
    }
  }

  this.associateEventListener = function(
    buttonElement, currentQuizAppObject){

    buttonElement.onclick = function(event){
      currentQuizAppObject.handleUserAnswerSelection(event);
    }  
  }

  this.handleUserAnswerSelection = function(event){
   
    const target = event.currentTarget;
    const userAnswerText = target.children[0].innerText;

    const qaPair = qaPairArray[this.pageIndex];

    const outcome = qaPair.checkAnswer(userAnswerText);
    if (outcome){
      this.incrementScore();
    }
    
    this.nextPage();
  }

  this.getScore = function(){
    return this.score;
  }

  this.incrementScore = function(){
    this.score ++; 
  }

  this.getMarkPercentage = function(){

    const percentage = (this.getScore() / this.qaPairArray.length ) * 100;
    return percentage;
  }

  this.nextPage = function(){
    
    if (this.pageIndex == (this.qaPairArray.length - 1)){

      console.log("Result Page.")

      const resultPage = new ResultPage(
        this.getScore(), this.getMarkPercentage()
      );
      resultPage.display();
    }else{

      this.initPage();
    }
  }

  this.initPage = function(){

    this.pageIndex = this.pageIndex + 1;
    this.registerListeners();
    this.displayQuizPage();
  }


  this.displayQuizPage = function(){

    console.log("Displaying Quiz Page")

    const qaPair = this.qaPairArray[this.pageIndex];

    const quizPage = new QuizPage(
      this.pageIndex, qaPair, this.qaPairArray);
    quizPage.display();
  }


}

const quizApp = new QuizApplication(
  [qaPair1, qaPair2, qaPair3, qaPair4, qaPair5]
);
quizApp.start();
