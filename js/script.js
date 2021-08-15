/*-------------RENDERIZANDO QUIZZES-------------------*/

const GET_QUIZZES_URL =
  "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";

const POST_QUIZZES_URL =
  "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";
// Essa variável será usada para deixar as requisições do axios mais semânticas
// Foi o que o Leandro passou em aula
// Alterei o formato e o nome quando acrescentei o outro link ;)

const quizzAnswers = {
  totalQuestions: 0,
  rightAnswers: 0,
  totalAnswered: 0,
  levelsObject: {},
};

getQuizzes();

function getQuizzes() {
  const promise = axios.get(GET_QUIZZES_URL);
  promise.then(listOfQuizzes);
  // promise.catch(() => console.log("Deu algum erro")); // depois explico isso!
}

let path;
let chooseQuizz;

function listOfQuizzes(response) {
  // console.log(response.data);
  path = response.data;
  console.log(path, "caminho");

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
  chooseQuizz = quizz;
  console.log(quizz, "quizz");
  console.log(chooseQuizz, "chooseQuizz");
  // esconde a tela onde estou no momento adicionando a classe hide
  const screen1 = document.querySelector(".screen1");
  screen1.classList.add("hide");
  // aparece a tela desktop 3 retirando a classe hide
  const screen3to7 = document.querySelector(".screen3-7");
  screen3to7.classList.remove("hide");

  // console.log(quizz);

  const promise = axios.get(`${GET_QUIZZES_URL}/${quizz}`);
  promise.then(quizzSelected);
  // promise.catch(() => console.log("Deu algum erro")); // depois explico isso!
}

function quizzSelected({ data }) {
  const { questions, image, title, levels } = data;
  console.log(levels, "objeto");
  // console.log(questions, "perguntas");
  // console.log(questions.length, "respostas0");

  for (let i = 0; i < questions.length; i++) {
    questions[i].answers.sort(comparador);
  }

  function comparador() {
    return Math.random() - 0.5;
  }

  // console.log(questions);
  /* const levels = levels;
  console.log(levels); */
  // console.log(image);

  const topImage = document.querySelector(".screen3-7");
  topImage.innerHTML = `<div class="top-image">
                            <h1 class="title"></h1>
                        </div>
                        <section class="question">
                        </section>`;
  const bgImage = topImage.querySelector(".top-image");
  bgImage.style.backgroundImage = `linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(0, 0, 0, 0.5) 64.58%,
    #000000 100%
  ), url(${image})`;
  const imgBgTitle = topImage.querySelector(".title");
  imgBgTitle.innerHTML = `${title}`;

  const top = document.querySelector(".top-image");
  top.scrollIntoView({ behavior: "smooth" });

  let choices = "";

  for (let j = 0; j < questions.length; j++) {
    choices += `<div class="question-box"><div class="question-box-top">
                    <h1>${questions[j].title}</h1>
                </div>
                <div class="question-box-choices">`;
    for (let k = 0; k < questions[j].answers.length; k++) {
      let correctAnswer = "incorrect-answer";
      if (questions[j].answers[k].isCorrectAnswer)
        correctAnswer = "correct-answer";

      choices += `<div class="choices ${correctAnswer}" onclick="selectAnswer(this)">
                    <img src=${questions[j].answers[k].image} alt="castle" />
                    <p>${questions[j].answers[k].text}</p>
                  </div>`;
      // console.log('É CORRETA!')
      // console.log(questions[j].answers[k].isCorrectAnswer)
    }
    choices += `</div>
                </div>`;
  }
  const question = document.querySelector(".question");
  question.innerHTML += `${choices}`;

  quizzAnswers.totalQuestions = questions.length;
  quizzAnswers.rightAnswers = 0;
  quizzAnswers.totalAnswered = 0;
  quizzAnswers.levelsObject = Object.values(levels);
}

function selectAnswer(answerDivElement) {
  quizzAnswers.totalAnswered += 1;

  answerDivElement.classList.add("selected-answer");

  const answerBox = answerDivElement.parentNode;
  const allAnswer = answerBox.querySelectorAll(".choices");

  for (const answer of allAnswer) {
    if (answer.classList.contains("correct-answer")) {
      answer.classList.add("right");
    } else {
      answer.classList.add("wrong");
    }
    if (!answer.classList.contains("selected-answer")) {
      answer.classList.add("not");
    }
    answer.setAttribute("onclick", "");
  }

  if (answerDivElement.classList.contains("right"))
    quizzAnswers.rightAnswers += 1;

  setTimeout(() => {
    // Realiza o scroll na caixa de perguntas
    if (answerBox.parentNode.nextSibling !== null) {
      answerBox.parentNode.nextSibling.scrollIntoView({ behavior: "smooth" });
    }
  }, 2000);

  const screenQuizz = document.querySelector(".screen3-7");

  if (quizzAnswers.totalAnswered === quizzAnswers.totalQuestions) {
    setTimeout(() => {
      const totalScore = Math.round(
        (quizzAnswers.rightAnswers / quizzAnswers.totalQuestions) * 100
      );

      const { title, image, text } = selectLevel(totalScore);

      screenQuizz.querySelector(".question").innerHTML += `<div class="results">
        <div class="results-top">
          <p>${totalScore}% de acerto: ${title}</p>
        </div>
        <div class="results-feedback">
          <img src="${image}" alt="dumbledore" />
          <p>
            ${text}
          </p>
        </div>
      </div>
      <div class="buttons">
        <div><button class="restart" onclick="restartQuizz()">Reiniciar Quizz</button></div>
        <div><button class="back-to-home" onclick="backToHome()">Voltar para home</button></div>
      </div>`;

      console.log(screenQuizz.querySelector(".results"));
      screenQuizz
        .querySelector(".results")
        .scrollIntoView({ behavior: "smooth" });
    }, 2000);
  }
}

function restartQuizz() {
  console.log(chooseQuizz);
  const promise = axios.get(`${GET_QUIZZES_URL}/${chooseQuizz}`);
  promise.then(quizzSelected);
}

function backToHome() {
  const screen3to7 = document.querySelector(".screen3-7");
  screen3to7.classList.add("hide");
  const screen1 = document.querySelector(".screen1");
  screen1.classList.remove("hide");
  const createQuizzBox = document.querySelector(".no-quizz");
  createQuizzBox.scrollIntoView({ behavior: "smooth" });
}

function selectLevel(totalScore) {
  const levelsObject = quizzAnswers.levelsObject;
  let minValues = [];
  let index = 0;

  console.log(levelsObject);
  for (const level of levelsObject) {
    minValues.push({
      index: index,
      value: level.minValue,
    });
    index++;
  }

  minValues = minValues.sort((a, b) => a.value - b.value); // NÃO ESTÁ OPERANDO PLENAMENTE

  for (let i = 1; i < minValues.length; i++) {
    const lastMinValue = minValues[i - 1].value;
    const actualMinValue = minValues[i].value;
    correctLevel = levelsObject[minValues[i - 1].index];
    if (actualMinValue === 100) {
      correctLevel = levelsObject[minValues[i].index];
      break;
    }
    if (lastMinValue <= totalScore && totalScore < actualMinValue) {
      break;
    }
    correctLevel = levelsObject[minValues[i].index];
  }

  return correctLevel;
}

/*-------------CRIAR UM QUIZZ-------------------*/

function toCreateQuizz() {
  const screen1 = document.querySelector(".screen1");
  screen1.classList.add("hide");
  const screen8 = document.querySelector(".screen8");
  screen8.classList.remove("hide");
}

let quizzLevelsInput = 0;
let quizzTitleInput = "";
let quizzUrlInput = "";
let quizzAnswersInput = "";
let quizzData = {
  title: "",
  image: "",
  questions: [
    {
      title: "",
      color: "",
      answers: [
        {
          text: "",
          image: "",
          isCorrectAnswer: true,
        },
        {
          text: "",
          image: "",
          isCorrectAnswer: false,
        },
      ],
    },
  ],
  levels: [
    {
      title: "",
      image: "",
      text: "",
      minValue: 0,
    },
  ],
};

function toCreateQuizzValidation() {
  let validationNumber = 0;
  quizzTitleInput = document.querySelector(".title").value;
  quizzUrlInput = document.querySelector(".url").value;
  //Falta validar a url
  quizzAnswersInput = parseInt(document.querySelector(".num-answers").value);
  quizzLevelsInput = parseInt(document.querySelector(".num-levels").value);

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
    quizzData = {
      title: quizzTitleInput,
      image: quizzUrlInput,
    };
    console.log(quizzData);
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
  renderQuestions();
}

function renderQuestions() {
  let innerQuestionsInputs = "<h2>Crie suas perguntas</h2>";

  for (let i = 1; i <= 3 /*número de perguntas*/; i++) {
    if (i === 1) {
      // Preencher
    } else {
      // Preencher
    }
  }
}

function toggleQuestion(currentQuestion) {
  const togglingQuestion = currentQuestion.parentNode;
  // console.log("CL", currentLevel);
  // console.log("TL", togglingLevel);

  togglingQuestion
    .querySelector(".question-title-container")
    .classList.toggle("uncollapsed-question");
  togglingQuestion
    .querySelector(".question-title-container")
    .classList.toggle("collapsed-question");
  togglingQuestion
    .querySelector(".question-input-container")
    .classList.toggle("hide");
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

// toCreateLevels();

function renderLevels() {
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
            class="quizz-input level-title${i}"
            placeholder="Título do nível"
          />
          <input
            type="text"
            class="quizz-input level-percentage${i}"
            placeholder="% de acerto mínima"
          />
          <input
            type="text"
            class="quizz-input level-url"
            placeholder="URL da imagem do nível"
          />
          <input
            type="text"
            class="quizz-input level-description${i}"
            placeholder="Descrição do nível"
          />
        </div>
      </div>`;
    } else {
      innerLevelInputs += `<div class="create-level-box">
      <div class="level-title-container uncollapsed-level" onclick="toggleLevel(this);">
      <h3>Nível ${i}</h3>
      <ion-icon name="create-outline"></ion-icon>
      </div>
      <div class="level-input-container hide">
          <input
            type="text"
            class="quizz-input level-title${i}"
            placeholder="Título do nível"
          />
          <input
            type="text"
            class="quizz-input level-percentage${i}"
            placeholder="% de acerto mínima"
          />
          <input
            type="text"
            class="quizz-input level-url"
            placeholder="URL da imagem do nível"
          />
          <input
            type="text"
            class="quizz-input level-description${i}"
            placeholder="Descrição do nível"
          />
        </div></div>`;
    }
  }

  const insertButton = `<button class="btn-finalize-quizz" onclick="toCreateLevelsValidation();">
      Finalizar Quizz
    </button>`;
  document.querySelector(".screen10").innerHTML =
    innerLevelInputs + insertButton;
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
  let levelUrlInput = document.querySelector(".level-url").value;
  // falta criar a condição da URL
  let minZero = 0;

  for (let i = 1; i <= 3 /*quizzLevelsInput*/; i++) {
    let j = i - 1;
    let levelTitleInput = document.querySelector(`.level-title${i}`).value;
    let levelPercentageInput = parseInt(
      document.querySelector(`.level-percentage${i}`).value
    );
    let levelDescriptionInput = document.querySelector(
      `.level-description${i}`
    ).value;

    if (levelTitleInput.length >= 10) {
      levelValidationNumber++;
      // console.log("validou 1 título");
    } else {
      alert("O título deve ter pelo menos 10 caracteres.");
    }

    if (levelPercentageInput >= 0 && levelPercentageInput <= 100) {
      /*validar se pelo menos um deles é 0*/ if (levelPercentageInput === 0) {
        minZero++;
      }
    } else {
      // colocar algo que impeça que a pessoa coloque um texto ou outro valor inválido e funcione?
      alert("O valor da porcentagem deve estar entre 0 e 100.");
    }

    if (levelDescriptionInput.length >= 30) {
      levelValidationNumber++;
    } else {
      alert("A descrição deve ter 30 ou mais caracteres.");
    }

    quizzData.levels[j] = {
      title: levelTitleInput,
      image: levelUrlInput,
      text: levelDescriptionInput,
      minValue: levelPercentageInput,
    };
    console.log(`pass ${i}`, quizzData.levels[j]);
  }

  if (minZero > 0) {
    levelValidationNumber += 3 /*quizzLevelsInput*/;
  } else {
    alert("O percentual mínimo de pelo menos 1 nível deve ser 0");
  }

  if (levelValidationNumber >= 3 * 3 /*quizzLevelsInput*/) {
    sendQuizzToServer(quizzData);
  } else {
    alert("Validação errada!");
  }
}

function toggleLevel(currentLevel) {
  //Adicionar uma condição para que funcione quando o nível estiver fechado e o resultado der null
  const togglingLevel = currentLevel.parentNode;
  // console.log("CL", currentLevel);
  // console.log("TL", togglingLevel);

  togglingLevel
    .querySelector(".level-title-container")
    .classList.toggle("uncollapsed-level");
  togglingLevel
    .querySelector(".level-title-container")
    .classList.toggle("collapsed-level");
  togglingLevel
    .querySelector(".level-input-container")
    .classList.toggle("hide");
}

/*-------------FINALIZA CRIAÇÃO DO QUIZZ-------------------*/

function renderFinalizedQuizz(response) {
  console.log("render", response);
  const innerFinalizedScreen = `<h2>Seu quizz está pronto!</h2>
  <div class="created-quizz-img">
    <p class="created-quizz-title">${quizzTitleInput}</p>
  </div>
  <button class="btn-access-quizz" onclick="viewCreatedQuizz(${response});">Acessar Quizz</button>
  <button class="back-to-home" onclick="returnToHome();">Voltar pra home</button>`;
  document.querySelector(".screen11").innerHTML = innerFinalizedScreen;
  document.querySelector(
    ".created-quizz-img"
  ).style.backgroundImage = `url("${quizzUrlInput}")`;
}

function toFinalizeQuizz(response) {
  const screen10 = document.querySelector(".screen10");
  screen10.classList.add("hide");
  const screen11 = document.querySelector(".screen11");
  screen11.classList.remove("hide");
  console.log("finalize", response);
  renderFinalizedQuizz(response);
}

function sendQuizzToServer() {
  console.log(quizzData);
  const promise = axios.post(POST_QUIZZES_URL, quizzData);

  promise.then(toFinalizeQuizz);
  promise.catch(alert("Algo deu errado!"));
}

function returnToHome() {
  const screen11 = document.querySelector(".screen11");
  screen11.classList.add("hide");
  const screen1 = document.querySelector(".screen1");
  screen1.classList.remove("hide");
  getQuizzes();
}

// tá quase igual à função quizzPage

function viewCreatedQuizz(response) {
  console.log(response.data);
  let quizzId = response.data.id;

  // esconde a tela onde estou no momento adicionando a classe hide
  const screen11 = document.querySelector(".screen11");
  screen11.classList.add("hide");
  // aparece a tela desktop 3 retirando a classe hide
  const screen3to7 = document.querySelector(".screen3-7");
  screen3to7.classList.remove("hide");

  // console.log(quizz);

  const promise = axios.get(`${GET_QUIZZES_URL}/${quizzId}`);
  promise.then(quizzSelected);
}
