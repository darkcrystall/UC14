const form = document.getElementById("form-cadastro");
const btnCadastro = document.getElementById("btn-cadastro");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  removeErrorMessage();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  btnCadastro.disabled = true;
  btnCadastro.textContent = "Cadastrando...";

  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // o back manda erro de duas formas diferentes:
      // - validateUser / validateUserFields (zod) -> { errors: ["msg1", "msg2"] }
      // - errorHandler (ex: email duplicado)      -> { message: "msg" }
      const message = data.errors
        ? data.errors.join(", ")
        : data.message || "Não foi possível cadastrar.";
      showErrorMessage(message);
      return;
    }

    // cadastro deu certo, manda pra tela de login
    window.location.href = "./form-login.html";
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    showErrorMessage("Erro ao conectar com o servidor. Tente novamente.");
  } finally {
    btnCadastro.disabled = false;
    btnCadastro.textContent = "Cadastrar";
  }
});

function showErrorMessage(message) {
  removeErrorMessage();
  const errorEl = document.createElement("p");
  errorEl.className = "form-error";
  errorEl.textContent = message;
  form.appendChild(errorEl);
}

function removeErrorMessage() {
  const existing = form.querySelector(".form-error");
  if (existing) existing.remove();
}