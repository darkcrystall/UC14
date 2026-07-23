const btnEntrar = document.getElementById("btn-entrar");
const btnCadastrar = document.getElementById("btn-cadastrar");

btnEntrar.addEventListener("click", () => {
  window.location.href = "./pages/form-login.html";
});

btnCadastrar.addEventListener("click", () => {
  window.location.href = "./pages/form-signup.html";
});