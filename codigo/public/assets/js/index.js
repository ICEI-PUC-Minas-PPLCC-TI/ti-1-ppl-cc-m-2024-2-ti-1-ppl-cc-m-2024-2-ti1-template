import { auth, logout } from "./auth.js";
import { createCategoryFormEvent } from "./categories.js";
import { createIconsSelector } from "./icons-selector.js";
import { createPopupEvents } from "./popup.js";

if (!auth()) window.location.replace("./login.html");

const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", (event) => {
  event.preventDefault;

  logout();
});

createCategoryFormEvent();

createPopupEvents();

createIconsSelector();
