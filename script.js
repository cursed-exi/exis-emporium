document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".toggle-btn").forEach(button => {
        button.addEventListener("click", () => {
            const extra = button.nextElementSibling;

            extra.classList.toggle("show");

            button.textContent = extra.classList.contains("show")
                ? "Read Less"
                : "Read More";
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("/sidebar.html")
    .then(res => {
      if (!res.ok) {
        throw new Error("Sidebar not found: " + res.status);
      }
      return res.text();
    })
    .then(data => {
      document.getElementById("sidebar").innerHTML = data;
    })
    .catch(err => console.error(err));
});
