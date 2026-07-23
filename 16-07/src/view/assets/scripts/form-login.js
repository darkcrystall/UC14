const form = document.getElementById("form-login");
const btnLogin = document.getElementById("btn-login");
const messageDiv = document.getElementById("login-message");

form.addEventListener("submit", async (event) => {
  // evita que o form recarregue a página, que é o comportamento padrão dele
  event.preventDefault();

  removeErrorMessage();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // desabilita o botão pra evitar duplo clique enquanto a requisição roda
  btnLogin.disabled = true;
  btnLogin.textContent = "Entrando...";

  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // se o back retornou um status de erro response.ok é false
    if (!response.ok) {
      showErrorMessage(data.message || "Não foi possível entrar.");
      return;
    }
    // se der certo, mostra uma mensagem
    messageDiv.classList.remove("hidden");
    messageDiv.classList.add("form-success");
    messageDiv.textContent = "Autenticado com sucesso! Redirecionando...";

    // guardamos o token no localStorage pra usar nas próximas requisições
    // (localStorage persiste mesmo se a aba for fechada)
    // localStorage.setItem("token", data.token);
    // localStorage.setItem("user", JSON.stringify(data.user));

    // login deu certo, redireciona pra próxima página
    setTimeout(() => {
      window.location.href = "./feed.html";
    }, 2000);
  } catch (error) {
    // cai aqui se o servidor estiver fora do ar, sem internet, etc
    console.error("Erro ao fazer login:", error);
    showErrorMessage("Erro ao conectar com o servidor. Tente novamente.");
  } finally {
    btnLogin.disabled = false;
    btnLogin.textContent = "Entrar";
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
