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
  const el = document.getElementById("sidebar");

  // Detect if we're in project repo (GitHub Pages)
  const base = window.location.pathname.includes("/exis-emporium/")
    ? "/exis-emporium"
    : "";

  fetch(base + "/sidebar.html")
    .then(res => {
      if (!res.ok) throw new Error("Sidebar not found: " + res.status);
      return res.text();
    })
    .then(data => {
      el.innerHTML = data;
    })
    .catch(err => console.error(err));
});
