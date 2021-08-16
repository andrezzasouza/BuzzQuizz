/*-------------RENDERIZANDO QUIZZES-------------------*/

const GET_QUIZZES_URL =
  "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";

const POST_QUIZZES_URL =
  "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";

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
  promise.catch(() => alert("Deu algum erro"));
}

let path;
let chooseQuizz;
const myQuizzes = [];
let ids;

function listOfQuizzes(response) {
  path = response.data;
  const listaSerializada = localStorage.getItem("ids");
  ids = JSON.parse(listaSerializada);

  if (ids !== null) {
    if (ids.length > 0) {
      const noQuizz = document.querySelector(".no-quizz");
      noQuizz.remove();
      const renderMyQuizzes = document.querySelector(".screen1");
      renderMyQuizzes.innerHTML = `
      <section class="my-quizzes">
          <div class="my-quizzes-top">
            <h2>Seus quizzes</h2>
            <ion-icon name="add-circle" onclick="toCreateQuizz()"></ion-icon>
          </div>
          <div class="my-quizzes-container">
          `;

      for (let i = 0; i < ids.length; i++) {
        const myQuizzesDisplay = document.querySelector(
          ".my-quizzes-container"
        );

        myQuizzesDisplay.innerHTML += `<div class="my-quizz my-quizz${ids[i].id}" onclick="quizzPage(${ids[i].id})"> 
          <p class="quizz-title">${ids[i].title}</p>
        </div>`;
      }

      for (let i = 0; i < ids.length; i++) {
        const image = document.querySelector(`.my-quizz${ids[i].id}`);
        image.style.backgroundImage = `linear-gradient(
                  180deg,
                  rgba(255, 255, 255, 0) 0%,
                  rgba(0, 0, 0, 0.5) 64.58%,
                  #000000 100%
                ), url(${ids[i].image})`;
      }

      renderMyQuizzes.innerHTML += `</div>
          </section>
          <section>
            <h2>Todos os Quizzes</h2>
            <div class="quizz-container">
            </div>
          </section>
        `;
    }
  } else {
    const renderCreateQuizzBox = document.querySelector(".screen1");
    renderCreateQuizzBox.innerHTML = `<section class="no-quizz">
    <p>Você não criou nenhum Quizz ainda :(</p>
    <button class="btn-create-quizz" onclick="toCreateQuizz()">
      Criar Quizz
    </button>
  </section>
  <section>
    <h2>Todos os Quizzes</h2>
    <div class="quizz-container"></div>
    </section>
    `;
  }

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
  const screen1 = document.querySelector(".screen1");
  screen1.classList.add("hide");
  const screen3to7 = document.querySelector(".screen3-7");
  screen3to7.classList.remove("hide");

  const promise = axios.get(`${GET_QUIZZES_URL}/${quizz}`);
  promise.then(quizzSelected);
  promise.catch(() => alert("Deu algum erro"));
}

function quizzSelected({ data }) {
  const { questions, image, title, levels } = data;

  for (let i = 0; i < questions.length; i++) {
    questions[i].answers.sort(comparador);
  }

  function comparador() {
    return Math.random() - 0.5;
  }

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
    let styleQuestionBg = `style="background-color: ${questions[j].color};"`;
    choices += `<div class="question-box">
                  <div class="question-box-top" ${styleQuestionBg}>
                    <h1>${questions[j].title}</h1>
                  </div>
                <div class="question-box-choices">`;
    for (let k = 0; k < questions[j].answers.length; k++) {
      let correctAnswer = "incorrect-answer";
      if (questions[j].answers[k].isCorrectAnswer)
        correctAnswer = "correct-answer";

      choices += `<div class="choices ${correctAnswer}" onclick="selectAnswer(this)">
                    <img src=${questions[j].answers[k].image} />
                    <p>${questions[j].answers[k].text}</p>
                  </div>`;
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
          <img src="${image}" />
          <p>
            ${text}
          </p>
        </div>
      </div>
      <div class="buttons">
        <div><button class="restart" onclick="restartQuizz()">Reiniciar Quizz</button></div>
        <div><button class="back-to-home" onclick="backToHome()">Voltar para home</button></div>
      </div>`;
      screenQuizz
        .querySelector(".results")
        .scrollIntoView({ behavior: "smooth" });
    }, 2000);
  }
}

function restartQuizz() {
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

  for (const level of levelsObject) {
    minValues.push({
      index: index,
      value: level.minValue,
    });
    index++;
  }

  minValues = minValues.sort((a, b) => a.value - b.value);

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
let quizzQuestionsInput = 0;
let quizzCreationData = {
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

function clearCreationData() {
  quizzCreationData = {
    title: "",
    image: "",
    questions: [],
    levels: [],
  };
}

function toCreateQuizzValidation() {
  clearCreationData();

  let validationNumber = 0;
  quizzTitleInput = document.querySelector(".quizz-input.title").value;
  quizzUrlInput = document.querySelector(".url").value;
  quizzQuestionsInput = parseInt(document.querySelector(".num-answers").value);
  quizzLevelsInput = parseInt(document.querySelector(".num-levels").value);

  if (quizzTitleInput.length >= 20 && quizzTitleInput.length <= 65) {
    validationNumber++;
  } else {
    alert("O título deve ter entre 20 e 65 caracteres.");
  }

  if (isValidUrl(quizzUrlInput)) {
    validationNumber++;
  } else {
    alert("A URL não é válida.");
  }

  if (quizzQuestionsInput >= 3) {
    validationNumber++;
  } else {
    alert("Ao menos 3 perguntas devem ser desenvolvidas.");
  }

  if (quizzLevelsInput >= 2) {
    validationNumber++;
  } else {
    alert("Ao menos 2 níveis devem ser desenvolvidos.");
  }

  if (validationNumber >= 4) {
    quizzCreationData.title = quizzTitleInput;
    quizzCreationData.image = quizzUrlInput;

    toCreateQuestions();
  } else {
    alert("Validação errada!");
  }
}

function isValidUrl(URL) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocolo
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // nome de domínio
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) do endereço
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // porta e caminho
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(URL);
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

  for (let i = 0; i < quizzQuestionsInput; i++) {
    if (i === 0) {
      innerQuestionsInputs += `<div class="create-question-box">
      <div class="question-title-container uncollapsed-question" onclick="toggleQuestion(this)">
        <h3>Pergunta ${i + 1}</h3>
        <ion-icon name="create-outline"></ion-icon>
      </div>
      <div class="question-input-container">`;
    } else {
      innerQuestionsInputs += `<div class="create-question-box">
      <div class="question-title-container collapsed-question" onclick="toggleQuestion(this)">
        <h3>Pergunta ${i + 1}</h3>
        <ion-icon name="create-outline"></ion-icon>
      </div>
      <div class="question-input-container hide">`;
    }
    innerQuestionsInputs += `<div class="question-inputs">
        <input
          type="text"
          class="quizz-input question-text${i}"
          placeholder="Texto da pergunta"
        />
        <input
          type="color"
          value="#FA4098"
          class="quizz-input question-bg-color${i}"
          placeholder="Cor de fundo da pergunta"
        />
      </div>
      <div class="correct-answer-section">
        <h3>Resposta correta</h3>
        <input
          type="text"
          class="quizz-input correct-answer${i}"
          placeholder="Resposta correta"
        />
        <input
          type="text"
          class="quizz-input image-url${i}"
          placeholder="URL da imagem"
        />
      </div>
      <div class="incorrect-answer-section">
        <h3>Respostas incorretas</h3>`;
    for (let j = 1; j < 4; j++) {
      innerQuestionsInputs += `<div><input
          type="text"
          class="quizz-input incorrect-answer${i}-${j}"
          placeholder="Resposta incorreta ${j}"
        />
        <input
          type="text"
          class="quizz-input incorrect-image${i}-${j}"
          placeholder="URL da imagem ${j}"
        />
        </div>`;
    }
    innerQuestionsInputs += `</div>
      </div>
    </div>`;
  }

  const insertButton = `<button
  class="btn-create-levels"
  onclick="questionValidation()">
    Prosseguir pra criar níveis
  </button>`;
  document.querySelector(".screen9").innerHTML =
    innerQuestionsInputs + insertButton;
}

function questionValidation() {
  for (let i = 0; i < quizzQuestionsInput; i++) {
    let questionTextInput = document.querySelector(`.question-text${i}`).value;
    let questionBgColorInput = document.querySelector(
      `.question-bg-color${i}`
    ).value;
    let correctAnswerInput = document.querySelector(
      `.correct-answer${i}`
    ).value;
    let correctImageInput = document.querySelector(`.image-url${i}`).value;

    quizzCreationData.questions[i] = {
      title: questionTextInput,
      color: questionBgColorInput,
      answers: [],
    };

    const isValidInput = (input) =>
      input !== null && input !== "" && input !== undefined;

    if (questionTextInput < 20) {
      alert(
        `Número mínimo de 20 caractéres para o título da pergunta ${i + 1}!`
      );
      return;
    }

    if (!isValidInput(correctAnswerInput)) {
      alert(`Resposta correta da pergunta ${i + 1} não pode ser vazia!`);
      return;
    }

    if (!isValidUrl(correctImageInput)) {
      alert(`URL da imagem correta da pergunta ${i + 1} inválida!`);
      return;
    }

    quizzCreationData.questions[i].answers[0] = {
      text: correctAnswerInput,
      image: correctImageInput,
      isCorrectAnswer: true,
    };

    let haveOneIncorrectValid = false;
    let countValidAnswers = 1;
    for (let j = 1; j < 4; j++) {
      let incorrectAnswerInput = document.querySelector(
        `.incorrect-answer${i}-${j}`
      ).value;
      let incorrectImageInput = document.querySelector(
        `.incorrect-image${i}-${j}`
      ).value;

      if (isValidInput(incorrectAnswerInput)) {
        haveOneIncorrectValid = true;

        if (!isValidUrl(incorrectImageInput)) {
          alert(`URL da imagem incorreta ${j} da pergunta ${i + 1} inválida!`);
          return;
        }

        quizzCreationData.questions[i].answers[countValidAnswers] = {
          text: incorrectAnswerInput,
          image: incorrectImageInput,
          isCorrectAnswer: false,
        };
        countValidAnswers++;
      }
    }

    if (!haveOneIncorrectValid) {
      alert(`A pergunta ${i + 1} deve ter pelo menos uma resposta incorreta!`);
      return;
    }
  }
  toCreateLevels();
}

function toggleQuestion(currentQuestion) {
  const togglingQuestion = currentQuestion.parentNode;

  togglingQuestion
    .querySelector(".question-title-container")
    .classList.toggle("collapsed-question");
  togglingQuestion
    .querySelector(".question-title-container")
    .classList.toggle("uncollapsed-question");
  togglingQuestion
    .querySelector(".question-input-container")
    .classList.toggle("hide");
}

/*-------------CRIAR UM NÍVEL-------------------*/

function renderLevels() {
  let innerLevelInputs = "<h2>Agora, decida os níveis</h2>";

  for (let i = 0; i < quizzLevelsInput; i++) {
    if (i === 0) {
      innerLevelInputs += `<div class="create-level-box">
        <div class="level-title-container uncollapsed-level" onclick="toggleLevel(this);">
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
            class="quizz-input level-url${i}"
            placeholder="URL da imagem do nível"
          />
          <textarea
          type="text"
          class="quizz-input description level-description${i}"
          placeholder="Descrição do nível"></textarea>
        </div>
      </div>`;
    } else {
      innerLevelInputs += `<div class="create-level-box">
      <div class="level-title-container collapsed-level" onclick="toggleLevel(this);">
      <h3>Nível ${i + 1}</h3>
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
            class="quizz-input level-url${i}"
            placeholder="URL da imagem do nível"
          />
          <textarea
          type="text"
          class="quizz-input description level-description${i}"
          placeholder="Descrição do nível"></textarea>
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

function toCreateLevelsValidation() {
  let levelValidationNumber = 0;
  let minZero = 0;

  for (let i = 0; i < quizzLevelsInput; i++) {
    let levelTitleInput = document.querySelector(`.level-title${i}`).value;
    let levelPercentageInput = parseInt(
      document.querySelector(`.level-percentage${i}`).value
    );
    let levelUrlInput = document.querySelector(`.level-url${i}`).value;
    let levelDescriptionInput = document.querySelector(
      `.level-description${i}`
    ).value;

    if (levelTitleInput.length >= 10) {
      levelValidationNumber++;
    } else {
      alert("O título deve ter pelo menos 10 caracteres.");
    }

    if (levelPercentageInput >= 0 && levelPercentageInput <= 100) {
      levelValidationNumber++;
      if (levelPercentageInput === 0) {
        // validar se pelo menos um deles é 0
        minZero++;
      }
    } else {
      // colocar algo que impeça que a pessoa coloque um texto ou outro valor inválido e funcione?
      alert("O valor da porcentagem deve estar entre 0 e 100.");
    }

    if (isValidUrl(levelUrlInput)) {
      levelValidationNumber++;
    } else {
      alert("A URL é inválida.");
    }

    if (levelDescriptionInput.length >= 30) {
      levelValidationNumber++;
    } else {
      alert("A descrição deve ter 30 ou mais caracteres.");
    }

    quizzCreationData.levels[i] = {
      title: levelTitleInput,
      image: levelUrlInput,
      text: levelDescriptionInput,
      minValue: levelPercentageInput,
    };
  }

  if (minZero === 0) {
    alert("O percentual mínimo de pelo menos 1 nível deve ser 0");
  }

  if (levelValidationNumber >= 4 * quizzLevelsInput && minZero !== 0) {
    sendQuizzToServer(quizzCreationData);
  } else {
    alert("Erro na validação!");
  }
}

function toggleLevel(currentLevel) {
  const togglingLevel = currentLevel.parentNode;

  togglingLevel
    .querySelector(".level-title-container")
    .classList.toggle("collapsed-level");
  togglingLevel
    .querySelector(".level-title-container")
    .classList.toggle("uncollapsed-level");
  togglingLevel
    .querySelector(".level-input-container")
    .classList.toggle("hide");
}

/*-------------FINALIZA CRIAÇÃO DO QUIZZ-------------------*/

function renderFinalizedQuizz(response) {
  console.log(response.data);
  const innerFinalizedScreen = `<h2>Seu quizz está pronto!</h2>
  <div class="created-quizz-img">
    <p class="created-quizz-title">${quizzTitleInput}</p>
  </div>
  <button class="btn-access-quizz" onclick="viewCreatedQuizz(${response.data.id});">Acessar Quizz</button>
  <button class="back-to-home" onclick="returnToHome();">Voltar pra home</button>`;
  document.querySelector(".screen11").innerHTML = innerFinalizedScreen;
  document.querySelector(
    ".created-quizz-img"
  ).style.background = `background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(0, 0, 0, 0.5) 64.58%,
    #000000 100%
  ),
  url("${quizzUrlInput}")`;
}

function toFinalizeQuizz(response) {
  const screen10 = document.querySelector(".screen10");
  screen10.classList.add("hide");
  const screen11 = document.querySelector(".screen11");
  screen11.classList.remove("hide");
  myQuizzes.push(response.data);
  const exemploSerializado = JSON.stringify(myQuizzes);
  localStorage.setItem("ids", exemploSerializado);
  renderFinalizedQuizz(response);
}

function sendQuizzToServer() {
  axios
    .post(POST_QUIZZES_URL, quizzCreationData)
    .then(toFinalizeQuizz)
    .catch((error) => {
      alert("Algo deu errado!");
    });
}

function returnToHome() {
  const screen11 = document.querySelector(".screen11");
  screen11.classList.add("hide");
  const screen1 = document.querySelector(".screen1");
  screen1.classList.remove("hide");
  getQuizzes();
}

function viewCreatedQuizz(response) {
  let quizzId = response;
  const screen11 = document.querySelector(".screen11");
  screen11.classList.add("hide");
  const screen3to7 = document.querySelector(".screen3-7");
  screen3to7.classList.remove("hide");

  const promise = axios.get(`${GET_QUIZZES_URL}/${quizzId}`);
  promise.then(quizzSelected);
}
