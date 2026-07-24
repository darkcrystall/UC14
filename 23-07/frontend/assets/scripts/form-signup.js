const form = document.getElementById("form-cadastro");
const btnCadastro = document.getElementById("btn-cadastro");
const messageDiv = document.getElementById("signup-message");
const BASE_URL = "http://localhost:3000";

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  removeErrorMessage();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPass = document.getElementById("confirm-password").value;

  if (password !== confirmPass) {
    showErrorMessage("As senhas não correspondem");
    return;
  }

  btnCadastro.disabled = true;
  btnCadastro.textContent = "Cadastrando...";

  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.message) {
        showErrorMessage(data.message);
      }
      // o back manda erro em forma de objeto
      if (data.errors) {
        const errors = data.errors ? Object.values(data.errors).flat() : [];
        if (errors.length === 1) {
          showErrorMessage(errors[0]);
        } else {
          showErrors(errors);
        }
      }
      return;
    }

    // se der certo, mostra uma mensagem
    messageDiv.classList.remove("hidden");
    messageDiv.classList.add("form-success");
    messageDiv.textContent =
      "Cadastrado com sucesso! Redirecionando para autenticar...";

    // cadastro deu certo, manda pra tela de login
    setTimeout(() => {
      window.location.href = "./form-login.html";
    }, 2000);
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
  form
    .querySelectorAll(".form-error, .form-error-list")
    .forEach((el) => el.remove());
}
function showErrors(errors) {
  removeErrorMessage();
  const ul = document.createElement("ul");
  ul.className = "form-error-list";
  errors.forEach((error) => {
    const li = document.createElement("li");
    li.textContent = error;
    ul.appendChild(li);
  });
  form.appendChild(ul);
}