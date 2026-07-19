const form = document.getElementById("form-criar-post");
const btnCriarPost = document.getElementById("btn-criar-post");
const btnLogout = document.getElementById("btn-logout");

// se não tem token, o usuário não tá logado, então manda ele pro login
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "../index.html";
}

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "../index.html";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  removeErrorMessage();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  btnCriarPost.disabled = true;
  btnCriarPost.textContent = "Criando...";

  try {
    const response = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // manda o token pra rota autenticada saber quem tá criando o post
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const data = await response.json();

    if (!response.ok) {
      // se o token expirou ou é inválido, manda de volta pro login
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "./form-login.html";
        return;
      }
      showErrorMessage(data.message || "Não foi possível criar o post.");
      return;
    }

    // post criado com sucesso, limpa o form
    form.reset();
    showSuccessMessage("Postagem criada com sucesso!");
  } catch (error) {
    console.error("Erro ao criar post:", error);
    showErrorMessage("Erro ao conectar com o servidor. Tente novamente.");
  } finally {
    btnCriarPost.disabled = false;
    btnCriarPost.textContent = "Criar";
  }
});

function showErrorMessage(message) {
  removeMessages();
  const errorEl = document.createElement("p");
  errorEl.className = "form-error";
  errorEl.textContent = message;
  form.appendChild(errorEl);
}

function showSuccessMessage(message) {
  removeMessages();
  const successEl = document.createElement("p");
  successEl.className = "form-success";
  successEl.textContent = message;
  form.appendChild(successEl);
}

function removeMessages() {
  const existingError = form.querySelector(".form-error");
  if (existingError) existingError.remove();
  const existingSuccess = form.querySelector(".form-success");
  if (existingSuccess) existingSuccess.remove();
}