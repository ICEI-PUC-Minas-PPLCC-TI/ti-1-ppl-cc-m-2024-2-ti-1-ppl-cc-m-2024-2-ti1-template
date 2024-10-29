import { auth, login } from "./auth.js";
import { getAllUsers } from "./user.js";

const form = document.getElementById("login-form");

const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = {
    email: email.value,
    password: password.value,
  };

  if (formData.name === "") {
    alert("Forneça um nome");
    return;
  }

  if (formData.password === "") {
    alert("Forneça uma senha");
    return;
  }

  const users = await getAllUsers();

  if (!users) {
    alert("Erro interno do servidor, tente novamente");
    return;
  }

  const userData = users.filter((user) => user.email === formData.email);

  if (userData.length === 0) {
    alert("Usuário não encontrado");
    return;
  }

  const user = userData[0];

  if (user.password !== formData.password) {
    alert("Senha incorreta");
    return;
  }

  login({ id: user.id, name: user.name, email: user.email });
});

if (auth()) window.location.replace("/");
