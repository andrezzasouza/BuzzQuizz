/*-------------RENDERIZANDO QUIZZES-------------------*/

const URL_Quizzes =
  "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";
// Essa variável será usada para deixar as requisições do axios mais semânticas
// Foi o que o Leandro passou em aula

getQuizzes();

function getQuizzes() {
  const promise = axios.get(URL_Quizzes);
  promise.then(listOfQuizzes);
  promise.catch(() => console.log("Deu algum erro")); // depois explico isso!
}

let path;

function listOfQuizzes(response) {
  console.log(response.data);
  path = response.data;

  const renderQuizzes = document.querySelector(".quizz-container");
  renderQuizzes.innerHTML = "";

  for (let i = 0; i < path.length; i++) {
    renderQuizzes.innerHTML += `
      <div class="quizz" onclick="quizzPage(${path[i].id})">
            <img
            src=${path[i].image}
            alt=""
                />
        <p class="quizz-title">
        ${path[i].title}
        </p>
      </div>`;
  }
}

/*-------------PÁGINA DE UM QUIZZ-------------------*/

function quizzPage(quizz) {
  // esconde a tela onde estou no momento adicionando a classe hide
  const screen1 = document.querySelector(".screen1");
  screen1.classList.add("hide");
  // aparece a tela desktop 3 retirando a classe hide
  const screen3to7 = document.querySelector(".screen3-7");
  screen3to7.classList.remove("hide");

  console.log(quizz);

  const promise = axios.get(`${URL_Quizzes}/${quizz}`);
  promise.then(quizzSelected);
  promise.catch(() => console.log("Deu algum erro")); // depois explico isso!
}

function quizzSelected(response) {
  console.log(response.data);
  const questions = response.data.questions;
  console.log(questions);
  /* const levels = response.data.levels;
  console.log(levels); */

  const topImage = document.querySelector(".screen3-7");
  topImage.innerHTML = `<div class="top-image">
                            <h1>ALTERAR IMAGEM E TEXTO</h1>
                        </div>
                        <section class="question">
                        </section>`;

  const question = document.querySelector(".question");
  console.log(question);
  question.innerHTML = `
  RENDERIZAR O QUIZZ AQUI
  `;
}

/*-------------CRIAR UM QUIZZ-------------------*/

function toCreateQuizz() {
  const screen1 = document.querySelector(".screen1");
  screen1.classList.add("hide");
  const screen8 = document.querySelector(".screen8");
  screen8.classList.remove("hide");
}

function toCreateQuizzValidation() {
  let validationNumber = 0;
  let quizzTitleInput = document.querySelector(".title").value;
  let quizzUrlInput = document.querySelector(".url").value;
  let quizzAnswersInput = parseInt(
    document.querySelector(".num-answers").value
  );
  let quizzLevelsInput = parseInt(document.querySelector(".num-levels").value);

  if (quizzTitleInput.length >= 20 && quizzTitleInput.length <= 65) {
    validationNumber++;
  } else {
    alert("O título deve ter entre 20 e 65 caracteres.");
  }

  if (quizzAnswersInput >= 3) {
    validationNumber++;
  } else {
    alert("Ao menos 3 perguntas devem ser desenvolvidas.");
  }

  if (quizzLevelsInput >= 2) {
    validationNumber++;
  } else {
    alert("Ao menos 2 níveis devem ser desenvolvidos.");
  }

  if (validationNumber >= 3) {
    toCreateQuestions();
  } else {
    alert("Validação errada!");
  }
}

/*-------------CRIAR PERGUNTAS-------------------*/

function toCreateQuestions() {
  const screen8 = document.querySelector(".screen8");
  screen8.classList.add("hide");
  const screen9 = document.querySelector(".screen9");
  screen9.classList.remove("hide");
}

/* COMENTÁRIO PLACEHOLDER */

// VALIDANDO PERGUNTAS TELA 9 - tiago aqui \o/

function isValidValue(value, validateFunction) {
  if (validateFunction(value)) return true

  return false
}


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// FUNÇÕES DE VALIDAÇÃO
function validateTextLen(textValue, textMaxLength) {
  if (textValue.length < textMaxLength) {
    // TALVEZ COLOCAR NOME DO CAMPO AQUI DE ALGUMA FORMA
    alert(`Esse campo deve ter mais que ${textMaxLength-1} caracteres`)
    return false
  }

  return true
}


function validateHexadecimal(hexadecimal) {
  // FAZER A PARTE DE VALIDAÇÃO DESSA PARADA
}


function validateEmptyText(textValue) {
  if (textValue.length === 0) {
    alert(`Esse campo não poder ser vazio`)
    return false
  }

  return true
}


function validateURLImage(urlImage) {
  // FAZER A VALIDAÇÃO DO URL AQUI!!!!
}


function validateIncorrectAnswerNumber(answerNumber) {
  if (answerNumber === 0) {
    alert(`Deve-se apresentar pelo menos uma resposta incorreta!`)
    return false
  }

  return true
}


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// FUNÇÃO DO BOTÃO DE VALIDAÇÃO DAS RESPOSTAS
function validateQuestionsCreation(buttonElement) {
  const creationQuestionsScreenElement = buttonElement.parentNode
  
  const questionsBoxElements = creationQuestionsScreenElement.querySelector('.create-question-box')
  
  validateQuestionBoxes(questionsBoxElements)
}

// MUDEI DE IDEIA DE COMO FAREI AQUI PARA FRENTE RAPEIZE, AMANHÃ CONTINUO
// SE PAH CONSIGO PENSAR MELHOR, PORQUE ESTOU DIVIDIDO EM DUAS OPÇÕES PARA FAZER
// ESSAS VALIDAÇÕES
// BEIJO NO CORAÇÃO DE QUEM ESTÁ LENDO
function validateQuestionBoxes(questionsBoxElements) {

  for (const questionBoxElement of questionsBoxElements) {
    if (!isValidQuestionBox(questionBoxElement)) return false
  }

  return true
}


function isValidQuestionBox(questionBoxElement) {
  isValidQuestionSection(questionBoxElement.querySelector('.question-section'))

  isValidCorrectAnswer(questionBoxElement.querySelector('.correct-answer-section'))

  isValidIncorrectAnswers(questionBoxElement.querySelector('.incorrect-answer-section'))
}


function isValidQuestionSection(questionSectionElement) {
  validadeQuestionText(questionSectionElement.querySelector('.question-text').value)

  validadeQuestionBgColor(questionSectionElement.querySelector('.question-bg-color'))
}



/*
  ORGANIZAÇÃO INICIAL  

- VAI ABR4IR A PARTE DA CRIAÇÃO DE PERGUNTAS
- VAI PROCURAR PELA PERGUNTA QUE ESTÁ ABERTA NO MOMENTO

- PEGA A PEGUNTA E CHECA AS PARADAS

- PEGA A RESPOSTA CORRETA E CHECA AS PARADAS

- LISTA AS PERGUNTAS INCORRETAS, E Vê CADA UMA DAS PARADAS NELAS



*/




































































/* COMENTÁRIO PLACEHOLDER */