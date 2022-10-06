const AuthService = require("../services/auth.service.js");

async function login({ url, formData }) {
  const body = {};
  formData.forEach((value, key) => {
    body[key] = value;
    console.log("looped data: ", value)
  });
  const fetchOptions = {
    method: "POST",
    mode: "no-cors",
    redirect: "follow",
    headers: {
      "Accept-encoding": "gzip, deflate, br",
      "Content-type": "application/x-www-form-urlencoded"
    },
    body: JSON.stringify(body)
  };

  const res = await fetch(url, fetchOptions);
  console.log("res:", res)
  if (!res.ok) {
    //const errorMessage = await res.text();
    throw new Error();
  }
  return res.json();
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const url = form.action;
  const formData = new FormData(form);
  const responseData = await login({ url, formData });
}

const submitForm = document.getElementById("example-form");
submitForm.addEventListener("submit", handleFormSubmit);
