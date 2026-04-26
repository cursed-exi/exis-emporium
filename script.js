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

fetch('/sidebar.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('sidebar').innerHTML = data;
  });
