// DOM Elements
const $logout = document.querySelector("#logout");
$infocontainerTitle = document.querySelector(".info-container_title");
const $name = document.querySelector("#name");
const $surname = document.querySelector("#surname");
const $username = document.querySelector("#username");
const $password = document.querySelector("#password");
const $email = document.querySelector("#email");
const $street = document.querySelector("#street");
const $number = document.querySelector("#number");
const $zip = document.querySelector("#zip");
const $city = document.querySelector("#city");
const $county = document.querySelector("#county");
const $country = document.querySelector("#country");
const $bank = document.querySelector("#bank");
const $iban = document.querySelector("#iban");
const $saveUser = document.querySelector("#saveUser");
const $deleteUser = document.querySelector("#deleteUser");
let isMessageActive = false;

// get user data
async function getUserInfo(username) {
  const response = await fetch(`/users/${username}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  return response.json();
}

async function saveUser() {
  try {
    if (!$password.value) {
      showMessage($password.parentElement, "Password required.");
      return;
    }

    const updatedUser = {
      loginCredentials: getCredentials(),
      contactInformation: getContactInformation(),
      billingInformation: getBillingInformation()
    };
    const pw = prompt("Enter your password!");
    if (!pw || $password.value !== pw) return;

    updatedUser.loginCredentials.password = pw;
    const res = await fetch(`/users/${getLoggedInUsername()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(updatedUser)
    });
    if (res.status === 422)
      throw new Error(`Error: ${res.statusText}`);
    showMessage($infocontainerTitle, "Data saved");
  } catch (err) {
    showMessage($infocontainerTitle, err.message);
  }
}

async function deleteUser() {
  try {
    await fetch(`/users/${getLoggedInUsername()}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    showMessage($infocontainerTitle, "User deleted.");
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 1500);
  } catch (err) {
    showMessage($infocontainerTitle, err.message);
  }
}

$saveUser.addEventListener("click", saveUser);
$deleteUser.addEventListener("click", deleteUser);
$logout.addEventListener("click", () => {
  localStorage.clear();
  window.location = "/";
});

window.onload = async () => {
  try {
    const user = await getUserInfo(getLoggedInUsername());
    setCredentials(user);
    setContactInformation(user);
    setBillingInformation(user);
  } catch (err) {
    console.log(err.message);
    localStorage.clear();
    window.location = "/public/index.html";
  }
};

function getLoggedInUsername() {
  return window.location.hash.replace("#", "");
}

function setBillingInformation(user) {
  $bank.value = user.billingInformation.bank;
  $iban.value = user.billingInformation.iban;
}

function setContactInformation(user) {
  $name.value = user.contactInformation.name;
  $surname.value = user.contactInformation.surname;
  setAddressInformation(user);
}

function setAddressInformation(user) {
  $street.value = user.contactInformation.address.street;
  $number.value = user.contactInformation.address.number;
  $city.value = user.contactInformation.address.city;
  $zip.value = user.contactInformation.address.zip;
  $county.value = user.contactInformation.address.county;
  $country.value = user.contactInformation.address.country;
}

function setCredentials(user) {
  $username.value = user.loginCredentials.username;
  $email.value = user.loginCredentials.email;
}

function getBillingInformation() {
  return {
    bank: $bank.value,
    iban: $iban.value
  };
}

function getCredentials() {
  return {
    username: $username.value,
    password: $password.value,
    email: $email.value
  };
}

function getContactInformation() {
  return {
    name: $name.value,
    surname: $surname.value,
    address: {
      street: $street.value,
      number: $number.value,
      city: $city.value,
      zip: $zip.value,
      county: $county.value,
      country: $country.value
    }
  };
}

function showMessage($parentElement, message) {
  if (!message || isMessageActive) return;
  isMessageActive = true;
  const text = document.createElement("h3");
  text.classList.add("info-message");
  text.innerText = message;
  $parentElement.appendChild(text);
  setTimeout(() => {
    $parentElement.removeChild(text);
    isMessageActive = false;
  }, 2000);
}
