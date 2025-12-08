const tabs = document.querySelectorAll(".tab-btn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const target = tab.getAttribute("data-target");

    if (target === "loginForm") {
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
    } else {
      registerForm.classList.remove("hidden");
      loginForm.classList.add("hidden");
    }
  });
});