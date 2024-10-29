import { auth } from "./auth.js";

export function createCategoryFormEvent() {
  const form = document.getElementById("create-category-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { id: ownerId } = auth();

    if (!ownerId) {
      alert("Não Autorizado");
      return;
    }

    const label = document.getElementById("create-category-form--label").value;

    if (label === "") {
      alert("Forneça um título");
      return;
    }

    const type = document.getElementById("create-category-form--income").checked
      ? "income"
      : "expense";

    let icon = document
      .querySelector(".form__field__icons__item__input:checked")
      .getAttribute("data-icon-name");

    if (icon === "none") icon = undefined;

    const newCategory = await createCategory({ ownerId, label, type, icon });

    if (!newCategory) {
      alert("Erro interno do servidor, tente novamente");
      return;
    }

    document.getElementById("create-category-popup").close();
    form.reset();
  });
}

export async function createCategory({ label, type, ownerId, icon }) {
  if (!label || !type || !ownerId) {
    console.error("Erro ao criar categoria, falta dados.");

    return null;
  }

  if (!(type === "income" || type === "expense")) {
    console.error(`Erro ao criar categoria, tipo: "${type}" é inválido.`);

    return null;
  }

  const user = await fetch(`/users/${ownerId}`);

  if (!user) {
    console.error("Erro ao criar categoria, usuário não existe.");

    return null;
  }

  const time = new Date().getTime();

  const data = await fetch("/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ownerId,
      label,
      type,
      icon,
      createdAt: time,
      updatedAt: time,
    }),
  });

  if (!data) {
    console.error("Erro ao criar categoria.");

    return null;
  }

  const newCategory = data.json();

  return newCategory;
}

export async function getUserCategories(userId) {
  const res = await fetch("/categories");

  if (!res.ok) {
    console.error("Erro ao carregar as categorias");
    return null;
  }

  const data = await res.json();

  const userCategories = data.filter(({ ownerId }) => ownerId === userId);

  return userCategories;
}

export async function updateCategoryById({ categoryId, label, icon }) {
  const updatedAt = new Date().getTime();

  const res = await fetch(`/categories/${categoryId}`, {
    method: "PATCH",
    body: JSON.stringify({ label, icon, updatedAt }),
  });

  if (!res.ok) {
    console.error("Erro ao atualizar a categoria.");

    return null;
  }

  const updatedCategory = await res.json();

  return updatedCategory;
}

export async function deleteCategoryById(categoryId) {
  const res = await fetch(`/categories/${categoryId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    console.error("Erro ao excluir a categoria.");
  }

  return res.ok;
}
