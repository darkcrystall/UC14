const feedList = document.getElementById("feed-list");
const feedStatus = document.getElementById("feed-status");
const btnLogout = document.getElementById("btn-logout");

// se não tem token, o usuário não tá logado, então manda ele pro login
// const token = localStorage.getItem("token");
// if (!token) {
//   window.location.href = "../index.html";
// }

btnLogout.addEventListener("click", async () => {
  await fetch("http://localhost:3000/logout", {
    method: "POST",
    credentials: "include",
  });

  localStorage.removeItem("user");
  window.location.href = "../index.html";
});

loadFeed();

async function loadFeed() {
  setStatus("Carregando postagens...");

  try {
    // GET /posts é público, mas mandamos o token porque a lista pode acabar exigindo autenticação no futuro
    const response = await fetch("http://localhost:3000/posts", {
      // headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "../index.html";
        return;
      }
      setStatus(data.message || "Não foi possível carregar o feed.");
      return;
    }

    renderPosts(data);
  } catch (error) {
    console.error("Erro ao carregar o feed:", error);
    setStatus("Erro ao conectar com o servidor. Tente novamente.");
  }
}

function renderPosts(posts) {
  feedList.innerHTML = "";

  if (posts.length === 0) {
    setStatus("Ainda não tem nenhuma postagem por aqui.");
    return;
  }

  setStatus("");

  posts.forEach((post) => {
    const item = document.createElement("li");
    item.className = "post-card";

    const author = post.user?.name || "Usuário desconhecido";

    item.innerHTML = `
      <h2 class="post-card__title">${escapeHtml(post.title)}</h2>
      ${
        post.description
          ? `<p class="post-card__description">${escapeHtml(
              post.description,
            )}</p>`
          : ""
      }
      <p class="post-card__author">por ${escapeHtml(author)}</p>
    `;

    feedList.appendChild(item);
  });
}

function setStatus(message) {
  feedStatus.textContent = message;
}

// escapa caracteres especiais pra evitar que conteúdo do post quebre o HTML
// (proteção básica contra XSS já que estamos usando innerHTML)
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
