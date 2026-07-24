const form = document.getElementById("form-editar-perfil");
const btnEditar = document.getElementById("btn-editar-perfil");
const btnLogout = document.getElementById("btn-logout");
const btnDeletar = document.getElementById("btn-deletar-perfil");
const messageDiv = document.getElementById("profile-message");
const messageType = document.getElementById("type-message");
const BASE_URL = "http://localhost:3000";

// se não tem token, o usuário não tá logado, então manda ele pro login
// const token = localStorage.getItem("token");
// if (!token) {
//   window.location.href = "./form-login.html";
// }

// busca os dados do usuário logado e pré-popula o form
async function loadUserData() {
  try {
    const response = await fetch(`${BASE_URL}/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      // cookie ausente/expirado, ou qualquer outro erro de auth
      if (response.status === 401) {
        window.location.href = "./form-login.html";
        return;
      }
      showErrorMessage("Não foi possível carregar seus dados.");
      return;
    }
    const data = await response.json();
    document.getElementById("name").value = data.user.name ?? "";
    document.getElementById("email").value = data.user.email ?? "";
    return data;
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
    showErrorMessage("Erro ao conectar com o servidor. Tente novamente.");
  }
}

const userLogged = loadUserData();

btnLogout.addEventListener("click", async () => {
  await fetch(`${BASE_URL}/logooff`, {
    method: "POST",
    credentials: "include",
  });

  localStorage.removeItem("user");
  window.location.href = "../index.html";
});

btnDeletar.addEventListener("click", async () => {
  // const userPermit = awaitUserConfirm("Deseja deletar o seu perfil?");
  try {
    const response = await fetch(`${BASE_URL}/`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      showSuccessMessage("Perfil deletado com sucesso!");
      localStorage.removeItem("user");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 2000);
    }
  } catch (error) {
    showErrorMessage(error);
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  removeMessages();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const newPass = document.getElementById("new-password").value.trim();
  const user = userLogged.then.prototype();
  if (name === user.name && email === user.email) {
    showErrorMessage("Nada alterado");
  }

  const body = {};
  if (name) body.name = name;
  if (email) body.email = email;
  if (newPass) body.password = newPass;

  btnEditar.disabled = true;
  btnEditar.textContent = "Editando...";

  try {
    const response = await fetch(`${BASE_URL}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        //   // manda o token pra rota autenticada saber quem tá criando o post
        //   Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      // se o token expirou ou é inválido, manda de volta pro login
      if (response.status === 401) {
        localStorage.removeItem("user");
        window.location.href = "./form-login.html";
        return;
      }
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

    showSuccessMessage("Perfil editado com sucesso!");
  } catch (error) {
    console.error("Erro ao editar:", error);
    showErrorMessage("Erro ao conectar com o servidor. Tente novamente.");
  } finally {
    btnEditar.disabled = false;
    btnEditar.textContent = "Confirmar";
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

const btnPermit = document.getElementById("btn-permit");
const btnDeny = document.getElementById("btn-deny");

function awaitUserConfirm(message) {
  messageDiv.classList.remove("hidden");
  messageType.textContent = `${message}`;
  btnPermit.addEventListener("click", () => {
    return true;
  });
  btnDeny.addEventListener("click", () => {
    return false;
  });
}