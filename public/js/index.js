const $modalContainer = document.querySelector(".modal-container");
const $register = document.querySelector("#register");
const $login = document.querySelector("#login");

// Event listeners
$register.addEventListener("click", async () => {
  $modalContainer.innerHTML = "";
  await createModal({ title: "Register", isRegistration: true });
  showModal();
});

$login.addEventListener("click", async () => {
  $modalContainer.innerHTML = "";
  await createModal({ title: "Login", isRegistration: false });
  showModal();
});

window.addEventListener("keydown", e => {
  if (e.keyCode !== 27) return;
  hideModal();
});

$modalContainer.addEventListener("click", e => {
  if (e.target !== $modalContainer) return;
  hideModal();
});

function hideModal() {
  $modalContainer.innerHTML = "";
  $modalContainer.classList.remove("modal-container--active");
}

function showModal() {
  $modalContainer.classList.add("modal-container--active");
}

// get ready made registration / login form
async function createModal(modalInfo) {
  const $modalBox = getModalBox();
  addModalHeader($modalBox, modalInfo.title);
  addInputBox($modalBox, modalInfo.isRegistration);
  if (modalInfo.isRegistration)
    addModalButtons($modalBox, "Confirm", "Cancel", registerUser);
  else addModalButtons($modalBox, "Confirm", "Cancel", login);
  $modalContainer.appendChild($modalBox);
  Promise.resolve($modalContainer);
}

// get modal container for registration / login
function getModalBox() {
  const modalBox = document.createElement("div");
  modalBox.classList.add("modal");
  return modalBox;
}

// set forms title
function addModalHeader($modalBox, title) {
  const header = document.createElement("h1");
  header.innerText = title;
  $modalBox.appendChild(header);
}

// add data fields in modal box
function addInputBox($modalBox, isRegistration) {
  const inputContainer = document.createElement("div");
  inputContainer.classList.add("modal_input-box");
  addBasicAuthFields(inputContainer);
  addRegistrationFields(isRegistration, inputContainer);
  $modalBox.appendChild(inputContainer);
}

// set general data fields
function addBasicAuthFields($inputContainer) {
  $inputContainer.appendChild(getInputField("text", "username", "username"));
  $inputContainer.appendChild(
    getInputField("password", "password", "password")
  );
}

// set specific registration data fields
function addRegistrationFields(isRegistration, $inputContainer) {
  if (isRegistration) {
    $inputContainer.appendChild(getInputField("email", "email", "email"));
    $inputContainer.appendChild(
      getInputField("text", "registration code", "registrationCode")
    );
  }
}

// create a data field with type, id and placeholder text
function getInputField(type, placeholder, id) {
  const input = document.createElement("input");
  input.classList.add("input-box_input");
  setInputAttributes(input, placeholder, type, id);
  return input;
}

// set data fields placeholder, type and id
function setInputAttributes($input, placeholder, type, id) {
  $input.setAttribute("placeholder", placeholder);
  $input.setAttribute("type", type);
  $input.setAttribute("id", id);
}

// set confirmation and cancel button for registration / login
function addModalButtons(
  $modalBox,
  buttonOneText,
  buttonTowText,
  confirmCallBack
) {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("modal_buttons");
  setSubmissionButtons(
    buttonOneText,
    confirmCallBack,
    buttonTowText,
    buttonContainer
  );
  $modalBox.appendChild(buttonContainer);
}

function setSubmissionButtons(
  buttonOneText,
  confirmCallBack,
  buttonTowText,
  $buttonContainer
) {
  const confirm = getModalButtons(buttonOneText.toLowerCase(), buttonOneText);
  confirm.addEventListener("click", () => {
    confirmCallBack();
  });
  const cancel = getModalButtons(buttonTowText.toLowerCase(), buttonTowText);
  cancel.addEventListener("click", hideModal);
  $buttonContainer.appendChild(confirm);
  $buttonContainer.appendChild(cancel);
}

function login() {
  const userData = getUserData(false);

  if (!isDataValid(userData)) {
    showMessage("Info: All fields need to be filled out and valid!");
    return;
  }

  fetch("/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  })
    .then(res => res.json())
    .then(res => {
      localStorage.setItem("token",res.token);
      localStorage.setItem("user", res.user.username);
      showMessage("Logged in...").then(res => {
        hideModal();
        window.location = `/login.html#${userData.username}`;
      });
    })
    .catch(err => {
      console.log(err);
      showMessage("User not found.");
    });
}

// send user data to server
function registerUser() {
  const userData = getUserData(true);

  if (!isDataValid(userData)) {
    showMessage("Info: All fields need to be filled out and valid!");
    return;
  }

  fetch("/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  })
    .then(res => res.json())
    .then(res => {
      showMessage("Successfully registered...").then(() => {
        hideModal();
      });
    })
    .catch(err => {
      showMessage("Registration failed.");
      console.log(err.message);
    });
}

// check for empty data fields in registration / login form
function isDataValid(userData) {
  for (const value of Object.values(userData)) {
    if (!value) return false;
  }
  return true;
}

// get user data from registration / login form
function getUserData(isRegistration) {
  const userData = {
    username: document.querySelector("#username").value,
    password: document.querySelector("#password").value
  };
  if (isRegistration) {
    userData.registrationCode = document.querySelector(
      "#registrationCode"
    ).value;
    const email = document.querySelector("#email").value;
    userData.email = email.includes("@") && email.includes(".") ? email : "";
  }
  return userData;
}

// display error message in modal box
function showMessage(message) {
  if (document.querySelector("#error-message"))
    return Promise.reject(Error("Missing DOM element"));
  const errorMessage = document.createElement("h5");
  errorMessage.setAttribute("id", "error-message");
  errorMessage.innerText = message;
  document.querySelector(".modal_input-box").appendChild(errorMessage);
  return new Promise(res => {
    setTimeout(() => {
      document.querySelector(".modal_input-box").removeChild(errorMessage);
      res();
    }, 1500);
  });
}

// create essential buttons for modal box
function getModalButtons(id, innerText) {
  const button = document.createElement("button");
  button.classList.add("buttons_button");
  setButtonAttributes(button, id);
  button.innerText = innerText;
  return button;
}

// set modal buttons id and type
function setButtonAttributes(button, id) {
  button.setAttribute("id", id);
  button.setAttribute("type", "button");
}

window.onload = () => {
  const user = localStorage.getItem("user");
  if(user && localStorage.getItem("token")) location = `/login.html#${user}`;
};


