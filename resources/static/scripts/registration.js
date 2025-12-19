document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("register_btn")
    .addEventListener("click", async () => {
      const data = getFormData();

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(data),
      });

      const text = await res.text();
      alert(text);
    });

    document.getElementById("sign_in_btn").addEventListener("click", async () => {
    const data = getFormData();

    console.log("Login attempt:", data.username);
    console.log("Incoming password:", data.password);
    
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
    });

    const text = await res.text();
    console.log("text:", text)

    if (res.ok) {
      alert("Успешный вход");
      globalThis.location.href = "/index.html";
    } else {
      alert(text);
    }
  });

  function getFormData() {
    console.log("getFormData:");
    console.log("getFormData usename:", document.getElementById("username").value);
    console.log("getFormData email:", document.getElementById("email").value);
    console.log("getFormData password:", document.getElementById("password").value);
    
    return {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };
  }
});
