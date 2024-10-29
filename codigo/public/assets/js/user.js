export async function createUser({ name, email, password }) {
  const users = await getAllUsers();

  if (!users) {
    alert("Erro interno do servidor, tente novamente");
    return;
  }

  const emailAlreadyInUse = !users.every((user) => user.email !== email);

  if (emailAlreadyInUse) {
    alert("Esse email já está cadastrado");
    return;
  }

  const time = new Date().getTime();

  const res = await fetch("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      createdAt: time,
      updatedAt: time,
    }),
  });

  if (!res.ok) {
    console.error("Erro ao criar usuário");

    return null;
  }

  const newUser = await res.json();

  return newUser;
}

export async function getAllUsers() {
  const res = await fetch("/users");

  if (!res.ok) {
    console.error("Erro ao carregar os usuários");
    return null;
  }

  const users = await res.json();

  return users;
}

export async function getUserById(userId) {
  const res = await fetch(`/users/${userId}`);

  if (!res.ok) {
    console.error("Erro ao carregar os usuários");

    return null;
  }
  const users = await res.json();

  return users;
}

export async function updateUserById(userId, { name }) {
  const updatedAt = new Date().getTime();

  const res = await fetch(`/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ name, updatedAt }),
  });

  if (!res.ok) {
    console.error("Erro ao atualizar o usuário");

    return null;
  }

  const updatedUser = await res.json();

  return updatedUser;
}

export async function deleteUserById(userId) {
  const res = await fetch(`/users/${userId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    console.error("Erro ao excluir o usuário.");
  }

  return res.ok;
}
