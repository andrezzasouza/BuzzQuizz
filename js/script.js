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






































































/* COMENTÁRIO PLACEHOLDER */

/*-------------CRIAR UM NÍVEL-------------------*/

function toCreateLevels() {
  const screen9 = document.querySelector(".screen1");
  screen9.classList.add("hide");
  const screen10 = document.querySelector(".screen8");
  screen10.classList.remove("hide");
}

function toCreateLevelsValidation() {
  let levelValidationNumber = 0;
  let levelTitleInput = document.querySelector(".level-title").value;
  let levelPercentageInput = parseInt(
    document.querySelector(".level-percentage").value
  );
  let levelUrlInput = document.querySelector(".level-url").value;
  // falta criar a condição da URL
  let levelDescriptionInput = document.querySelector(".level-description").value;

  if (levelTitleInput.length >= 10) {
    levelValidationNumber++
  } else {
    alert("O título deve ter pelo menos 10 caracteres.");
  }

  if (levelPercentageInput >= 0 && levelPercentageInput <= 100) {
    levelValidationNumber++
  } else {
    // colocar algo que impeça que a pessoa coloque um texto ou outro valor inválido e funcione?
    alert("O valor da porcentagem deve estar entre 0 e 100.");
  }

  if (levelDescriptionInput.length >= 30) {
    levelValidationNumber++
  } else {
    alert("A descrição deve ter 30 ou mais caracteres.");
  }

  if (levelValidationNumber >= 3) {
    toFinalizeQuizz();
  } else {
    alert("Validação errada!")
  }

}

function openLevel(closedLevel) {

}

