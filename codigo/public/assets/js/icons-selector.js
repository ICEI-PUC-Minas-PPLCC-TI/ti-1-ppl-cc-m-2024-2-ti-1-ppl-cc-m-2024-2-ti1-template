export function createIconsSelector() {
  const iconsLists = document.getElementsByClassName("form__field__icons");

  const ICONS_NAMES = [
    "plane",
    "utensils",
    "tent-tree",
    "landmark",
    "laptop",
    "graduation",
    "gamepad",
    "gift",
    "dumbbell",
    "drama",
    "clapperboard",
    "chart-spline",
    "cigarette",
    "church",
    "chef",
    "cat",
    "candy",
    "cake",
    "briefcase",
    "bike",
    "beef",
    "beer",
    "shopping",
    "shirt",
    "cart",
    "basket",
  ];

  if (!iconsLists && iconsLists.length <= 0) return;

  for (const selector of iconsLists) {
    selector.insertAdjacentHTML(
      "beforeend",
      `
      <li class="form__field__icons__item">
        <input
          class="form__field__icons__item__input"
          type="radio"
          name="icon"
          data-icon-name="none"
          id="create-category-form-icon--none"
          checked
        />
        <img
          class="form__field__icons__item__image"
          src="assets/img/icon/selectable/none.svg"            
          alt="icon-none"
        />
      </li>
      `
    );

    for (const iconName of ICONS_NAMES) {
      selector.insertAdjacentHTML(
        "beforeend",
        `
        <li class="form__field__icons__item">
          <input
            class="form__field__icons__item__input"
            type="radio"
            name="icon"
            data-icon-name="${iconName}"
            id="create-category-form-icon--${iconName}"
          />
          <img
            class="form__field__icons__item__image"
            src="assets/img/icon/selectable/${iconName}.svg"            
            alt="icon-${iconName}"
          />
        </li>
        `
      );
    }
  }
}
