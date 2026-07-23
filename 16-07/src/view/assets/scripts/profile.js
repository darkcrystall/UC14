const form = document.getElementById("form-editar-perfil");
const btnEditar = document.getElementById("btn-editar-perfil");
const btnLogout = document.getElementById("btn-logout");
const btnDeletar = document.getElementById("btn-deletar-perfil");
// se não tem token, o usuário não tá logado, então manda ele pro login
// const token = localStorage.getItem("token");
// if (!token) {
//   window.location.href = "./form-login.html";
// }

// busca os dados do usuário logado e pré-popula o form
async function loadUserData() {
  try {
    const response = await fetch("http://localhost:3000/users/logged", {
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

    const user = await response.json();

    document.getElementById("name").value = user.name ?? "";
    document.getElementById("email").value = user.email ?? "";
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
    showErrorMessage("Erro ao conectar com o servidor. Tente novamente.");
  }
}

loadUserData();

btnLogout.addEventListener("click", async () => {
  await fetch("http://localhost:3000/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  localStorage.removeItem("user");
  window.location.href = "../index.html";
});

btnDeletar.addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:3000/users/delete", {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      localStorage.removeItem("user");
      window.location.href = "../index.html";
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
  const pass = document.getElementById("actual-password").value.trim();

  const body = {};
  if (name) body.name = name;
  if (email) body.email = email;
  if (newPass) body.password = newPass; 

  if (!pass) {
    showErrorMessage("Confirme com sua senha atual");
    return;
  }

  const isValid = await verifyPassUser(pass);

  if (!isValid) {
    showErrorMessage("Senha atual incorreta.");
    return;
  }

  btnEditar.disabled = true;
  btnEditar.textContent = "Editando...";

  try {
    const response = await fetch("http://localhost:3000/users/update", {
      method: "PUT",
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
      showErrorMessage(data.message || "Não foi possível editar o perfil.");
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

async function verifyPassUser(password) {
  try {
    const response = await fetch("http://localhost:3000/auth/checkpass", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    return response.ok;
  } catch {
    return false;
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
