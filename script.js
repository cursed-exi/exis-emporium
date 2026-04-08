document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".toggle-btn");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const extra = this.nextElementSibling;

            if (extra.style.display === "none" || extra.style.display === "") {
                extra.style.display = "block";
                this.textContent = "Show Less";
            } else {
                extra.style.display = "none";
                this.textContent = "Read More";
            }
        });
    });
});