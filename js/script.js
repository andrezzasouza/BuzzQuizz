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

function listOfQuizzes(response) {
  console.log(response.data);
  const path = response.data;

  const renderQuizzes = document.querySelector(".quizz-container");
  renderQuizzes.innerHTML = "";

  for (let i = 0; i < path.length; i++) {
    renderQuizzes.innerHTML += `
      <div class="quizz" onclick="quizzPage()">
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

function quizzPage() {
  // esconde a tela onde estou no momento adicionando a classe hide
  const screen1 = document.querySelector(".screen1");
  screen1.classList.add("hide");
  // aparece a tela desktop 3 retirando a classe hide
  const screen3to7 = document.querySelector(".screen3-7");
  screen3to7.classList.remove("hide");
}
