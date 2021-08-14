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
      <div class="quizz quizz${i}" onclick="quizzPage(${path[i].id})">
            
        <p class="quizz-title">
        ${path[i].title}
        </p>
      </div>`;
  }

  for (let i = 0; i < path.length; i++) {
    const image = document.querySelector(`.quizz${i}`);
    image.style.backgroundImage = `linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(0, 0, 0, 0.5) 64.58%,
        #000000 100%
      ), url(${path[i].image})`;
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
  console.log(response.data.image);

  const topImage = document.querySelector(".screen3-7");
  topImage.innerHTML = `<div class="top-image">
                            <h1 class="title"></h1>
                        </div>
                        <section class="question">
                        </section>`;
  const image = topImage.querySelector(".top-image");
  image.style.backgroundImage = `linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(0, 0, 0, 0.5) 64.58%,
    #000000 100%
  ), url(${response.data.image})`;
  const title = topImage.querySelector(".title");
  title.innerHTML = `${response.data.title}`;

  let choices = "";

  for (let j = 0; j < questions.length; j++) {
    choices += `<div class="question-box"><div class="question-box-top">
    <h1>${questions[j].title}</h1>
  </div><div class="question-box-choices">`;
    for (let k = 0; k < questions[j].answers.length; k++) {
      choices += `
        <div class="choices choices${j}${k}">
      <img src=${questions[j].answers[k].image} alt="castle" />
      <p>${questions[j].answers[k].text}</p>
    </div>`;
    }
    choices += `</div></div>`;
  }

  const question = document.querySelector(".question");
  question.innerHTML += `${choices}`;
}

/*-------------CRIAR UM QUIZZ-------------------*/

function toCreateQuizz() {
  const screen1 = document.querySelector(".screen1");
  screen1.classList.add("hide");
  const screen8 = document.querySelector(".screen8");
  screen8.classList.remove("hide");
}

let quizzLevelsInput = 0;

function toCreateQuizzValidation() {
  let validationNumber = 0;
  let quizzTitleInput = document.querySelector(".title").value;
  let quizzUrlInput = document.querySelector(".url").value;
  quizzAnswersInput = parseInt(
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
  if (validateFunction(value)) return true;

  return false;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// FUNÇÕES DE VALIDAÇÃO
function validateTextLen(textValue, textMaxLength) {
  if (textValue.length < textMaxLength) {
    // TALVEZ COLOCAR NOME DO CAMPO AQUI DE ALGUMA FORMA
    alert(`Esse campo deve ter mais que ${textMaxLength - 1} caracteres`);
    return false;
  }

  return true;
}

function validateHexadecimal(hexadecimal) {
  // FAZER A PARTE DE VALIDAÇÃO DESSA PARADA
}

function validateEmptyText(textValue) {
  if (textValue.length === 0) {
    alert(`Esse campo não poder ser vazio`);
    return false;
  }

  return true;
}

function validateURLImage(urlImage) {
  // FAZER A VALIDAÇÃO DO URL AQUI!!!!
}

function validateIncorrectAnswerNumber(answerNumber) {
  if (answerNumber === 0) {
    alert(`Deve-se apresentar pelo menos uma resposta incorreta!`);
    return false;
  }

  return true;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// FUNÇÃO DO BOTÃO DE VALIDAÇÃO DAS RESPOSTAS
function validateQuestionsCreation(buttonElement) {
  const creationQuestionsScreenElement = buttonElement.parentNode;

  const questionsBoxElements = creationQuestionsScreenElement.querySelector(
    ".create-question-box"
  );

  validateQuestionBoxes(questionsBoxElements);
}

// MUDEI DE IDEIA DE COMO FAREI AQUI PARA FRENTE RAPEIZE, AMANHÃ CONTINUO
// SE PAH CONSIGO PENSAR MELHOR, PORQUE ESTOU DIVIDIDO EM DUAS OPÇÕES PARA FAZER
// ESSAS VALIDAÇÕES
// BEIJO NO CORAÇÃO DE QUEM ESTÁ LENDO
function validateQuestionBoxes(questionsBoxElements) {
  for (const questionBoxElement of questionsBoxElements) {
    if (!isValidQuestionBox(questionBoxElement)) return false;
  }

  return true;
}

function isValidQuestionBox(questionBoxElement) {
  isValidQuestionSection(questionBoxElement.querySelector(".question-section"));

  isValidCorrectAnswer(
    questionBoxElement.querySelector(".correct-answer-section")
  );

  isValidIncorrectAnswers(
    questionBoxElement.querySelector(".incorrect-answer-section")
  );
}

function isValidQuestionSection(questionSectionElement) {
  validadeQuestionText(
    questionSectionElement.querySelector(".question-text").value
  );

  validadeQuestionBgColor(
    questionSectionElement.querySelector(".question-bg-color")
  );
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

/*-------------CRIAR UM NÍVEL-------------------*/


toCreateLevels();

function renderLevels () {
  let innerLevelInputs = "<h2>Agora, decida os níveis</h2>";

  for (let i = 1; i <= 3 /*quizzLevelsInput*/; i++) {
    if (i === 1) {
      innerLevelInputs += `<div class="create-level-box">
        <div class="level-title-container collapsed-level" onclick="toggleLevel(this);">
          <h3>Nível 1</h3>
          <ion-icon name="create-outline"></ion-icon>
        </div>
        <div class="level-input-container">
          <input
            type="text"
            class="quizz-input level-title"
            placeholder="Título do nível"
          />
          <input
            type="text"
            class="quizz-input level-percentage"
            placeholder="% de acerto mínima"
          />
          <input
            type="text"
            class="quizz-input level-url"
            placeholder="URL da imagem do nível"
          />
          <input
            type="text"
            class="quizz-input level-description"
            placeholder="Descrição do nível"
          />
        </div>
      </div>`
    } else {
      innerLevelInputs += `<div class="create-level-box">
      <div class="level-title-container uncollapsed-level" onclick="toggleLevel(this);">
      <h3>Nível ${i}</h3>
      <ion-icon name="create-outline"></ion-icon>
      </div>
      <div class="level-input-container hide">
          <input
            type="text"
            class="quizz-input level-title"
            placeholder="Título do nível"
          />
          <input
            type="text"
            class="quizz-input level-percentage"
            placeholder="% de acerto mínima"
          />
          <input
            type="text"
            class="quizz-input level-url"
            placeholder="URL da imagem do nível"
          />
          <input
            type="text"
            class="quizz-input level-description"
            placeholder="Descrição do nível"
          />
        </div></div>`
    }
  }

  const insertButton = `<button class="btn-finalize-quizz" onclick="toCreateLevelsValidation();">
      Finalizar Quizz
    </button>`
  document.querySelector(".screen10").innerHTML = innerLevelInputs + insertButton
}

function toCreateLevels() {
  const screen9 = document.querySelector(".screen9");
  screen9.classList.add("hide");
  const screen10 = document.querySelector(".screen10");
  screen10.classList.remove("hide");
  renderLevels();
}

// Usar um .firstchild pra deixar o primeiro aberto por padrão?
// O comportamento evita que todos os níveis estejam fechados? É obrigatório que um sempre esteja aberto ou não?

function toCreateLevelsValidation() {
  let levelValidationNumber = 0;
  let levelTitleInput = document.querySelector(".level-title").value;
  let levelPercentageInput = parseInt(
    document.querySelector(".level-percentage").value
  );
  let levelUrlInput = document.querySelector(".level-url").value;
  // falta criar a condição da URL
  let levelDescriptionInput =
    document.querySelector(".level-description").value;

  if (levelTitleInput.length >= 10) {
    levelValidationNumber++;
  } else {
    alert("O título deve ter pelo menos 10 caracteres.");
  }

  if (levelPercentageInput >= 0 && levelPercentageInput <= 100) {
    levelValidationNumber++;
  } else {
    // colocar algo que impeça que a pessoa coloque um texto ou outro valor inválido e funcione?
    alert("O valor da porcentagem deve estar entre 0 e 100.");
  }

  if (levelDescriptionInput.length >= 30) {
    levelValidationNumber++;
  } else {
    alert("A descrição deve ter 30 ou mais caracteres.");
  }

  if (levelValidationNumber >= 3) {
    toFinalizeQuizz();
  } else {
    alert("Validação errada!");
  }
}

function toggleLevel(currentLevel) {

  //Adicionar uma condição para que funcione quando o nível estiver fechado e o resultado der null
  const togglingLevel = currentLevel.parentNode;
  console.log("CL", currentLevel)
  console.log("TL", togglingLevel)
  

  // if (togglingLevel !== null) {
    togglingLevel.querySelector(".level-title-container").classList.toggle("uncollapsed-level");
    togglingLevel.querySelector(".level-title-container").classList.toggle("collapsed-level");
    togglingLevel.querySelector(".level-input-container").classList.toggle("hide");
  // } else {}
}

/*-------------FINALIZA CRIAÇÃO DO QUIZZ-------------------*/

function toFinalizeQuizz() {
  const screen10 = document.querySelector(".screen10");
  screen10.classList.add("hide");
  const screen11 = document.querySelector(".screen11");
  screen11.classList.remove("hide");
}

