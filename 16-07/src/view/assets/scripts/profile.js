const form = document.getElementById("form-editar-perfil");
const btnEditar = document.getElementById("btn-editar-perfil");
const btnLogout = document.getElementById("btn-logout");
const btnDeletar = document.getElementById("btn-deletar-perfil");
// se não tem token, o usuário não tá logado, então manda ele pro login
// const token = localStorage.getItem("token");
// if (!token) {
//   window.location.href = "./form-login.html";
// }

btnLogout.addEventListener("click", async () => {
  await fetch("http://localhost:3000/logout", {
    method: "POST",
    credentials: "include",
  });

  localStorage.removeItem("user");
  window.location.href = "../index.html";
});

btnDeletar.addEventListener("click", async () => {
    await fetch("http://localhost:3000/users/delete", {
      method: "DELETE",
      credentials: "include",
    });
  
    localStorage.removeItem("user");
    window.location.href = "../index.html";
  });

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  removeMessages();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const newPass = document.getElementById("new-password").value.trim();
  const pass = document.getElementById("actual-password").value.trim();

  if (!pass) {
    showErrorMessage("Confirme com sua senha atual");
  }

  verifyPassUser(pass);

  btnEditar.disabled = true;
  btnEditar.textContent = "Editando...";

  try {
    const response = await fetch("http://localhost:3000/users/update", {
      method: "PUT",
      // headers: {
      //   "Content-Type": "application/json",
      //   // manda o token pra rota autenticada saber quem tá criando o post
      //   Authorization: `Bearer ${token}`,
      // },
      credentials: "include",
      body: JSON.stringify({ name, email, newPass }),
    });

    const data = await response.json();

    if (!response.ok) {
      // se o token expirou ou é inválido, manda de volta pro login
      if (response.status === 401) {
        localStorage.removeItem("user");
        window.location.href = "./form-login.html";
        return;
      }
      showErrorMessage(data.message || "Não foi possível editar o perfil.");
      return;
    }

    // editado com sucesso, limpa o form
    form.reset();
    showSuccessMessage("Perfil editado com sucesso!");
  } catch (error) {
    console.error("Erro ao editar:", error);
    showErrorMessage("Erro ao conectar com o servidor. Tente novamente.");
  } finally {
    btnCriarPost.disabled = false;
    btnCriarPost.textContent = "Confirmar";
  }
});

async function verifyPassUser(password) {
  try {
    await fetch("http://localhost:3000/auth/checkpass", {
      method: "GET",
      credentials: true,
      body: JSON.stringify({ password }),
    });
  } catch (error) {
    showErrorMessage(error);
  }
}
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
