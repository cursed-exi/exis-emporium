const standardCategories = ["Traits", "Actions", "Bonus Actions", "Reactions", "Legendary Break Actions"];

document.addEventListener("DOMContentLoaded", () => {
    const groups = document.getElementById("entry-groups");
    standardCategories.forEach(category => addCategory(category));
    document.getElementById("statblock-form").addEventListener("input", renderPreview);
    document.getElementById("add-section").addEventListener("click", () => addCategory("New Category"));
    document.getElementById("download-statblock").addEventListener("click", downloadStatblockImage);
    document.querySelectorAll("#statblock-form .cr-spin").forEach(button => {
        button.addEventListener("click", () => {
            const input = button.closest(".cr-number-wrap").querySelector("input");
            const step = Number(input.step) || 1;
            const minimum = Number(input.min) || 0;
            input.value = Math.max(minimum, Number(input.value || 0) + (button.classList.contains("up") ? step : -step));
            input.dispatchEvent(new Event("input", { bubbles: true }));
        });
    });
    renderPreview();

    function addCategory(name) {
        const group = document.createElement("section");
        group.className = "builder-entry-group";
        group.innerHTML = `<div class="builder-category-title"><input class="ui-input category-name" value="${escapeHtml(name)}" aria-label="Category name"><button type="button" class="ui-button remove-category">Remove</button></div><div class="builder-entries"></div><button type="button" class="ui-button add-entry">Add entry</button>`;
        group.querySelector(".add-entry").addEventListener("click", () => addEntry(group));
        group.querySelector(".remove-category").addEventListener("click", () => { group.remove(); renderPreview(); });
        groups.appendChild(group);
        addEntry(group);
    }

    function addEntry(group) {
        const entry = document.createElement("div");
        entry.className = "builder-entry";
        entry.innerHTML = `<input class="ui-input entry-name" placeholder="Entry name"><textarea class="ui-input entry-description" placeholder="Description"></textarea><button type="button" class="ui-button remove-entry" aria-label="Remove entry">Remove</button>`;
        entry.querySelector(".remove-entry").addEventListener("click", () => { entry.remove(); renderPreview(); });
        group.querySelector(".builder-entries").appendChild(entry);
    }
});

function formValue(name) {
    return document.querySelector(`[name="${name}"]`).value.trim();
}

function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function textWithBreaks(value) {
    return escapeHtml(value).replace(/\n/g, "<br>");
}

function modifier(score) {
    const value = Math.floor((Number(score) - 10) / 2);
    return `${value >= 0 ? "+" : ""}${value}`;
}

function renderPreview() {
    const scores = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
    const optional = [["Skills", "skills"], ["Resistances", "resistances"], ["Immunities", "immunities"], ["Languages", "languages"], ["Senses", "senses"]];
    const detailLines = optional.map(([label, key]) => {
        const value = formValue(key);
        return value ? `<p><strong>${label}</strong> ${escapeHtml(value)}</p>` : "";
    }).join("");
    const categories = [...document.querySelectorAll(".builder-entry-group")].map(group => {
        const title = group.querySelector(".category-name").value.trim();
        const entries = [...group.querySelectorAll(".builder-entry")].map(entry => {
            const name = entry.querySelector(".entry-name").value.trim();
            const description = entry.querySelector(".entry-description").value.trim();
            return name || description ? `<p><strong>${escapeHtml(name || "Entry")}.</strong> ${textWithBreaks(description)}</p>` : "";
        }).join("");
        return entries ? `<hr><div class="action"><strong>${escapeHtml(title || "Category")}</strong></div>${entries}` : "";
    }).join("");
    document.getElementById("statblock-preview").innerHTML = `<h4>${escapeHtml(formValue("name") || "Unnamed Creature")}</h4><div class="type">${escapeHtml(formValue("size"))} ${escapeHtml(formValue("type"))}, ${escapeHtml(formValue("alignment"))} | CR ${escapeHtml(formValue("cr"))}</div><hr><p><strong>AC</strong> ${escapeHtml(formValue("ac"))}</p><p><strong>HP</strong> ${escapeHtml(formValue("hp"))}</p><p><strong>Speed</strong> ${escapeHtml(formValue("speed"))}</p>${detailLines}<hr><div class="stats">${scores.map(score => `<div><strong>${score}</strong>${escapeHtml(formValue(score))} (${modifier(formValue(score))})</div>`).join("")}</div>${categories}`;
}

async function downloadStatblockImage() {
    const button = document.getElementById("download-statblock");
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = "Preparing image...";
    try {
        const canvas = await window.html2canvas(document.getElementById("statblock-preview"), {
            backgroundColor: "#0f0f0f",
            scale: 2,
            useCORS: true
        });
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${(formValue("name") || "statblock").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "statblock"}.png`;
        link.click();
    } catch (error) {
        console.error("Statblock image export failed:", error);
        alert("The image exporter could not be loaded. Please check your internet connection and try again.");
    } finally {
        button.disabled = false;
        button.textContent = originalLabel;
    }
}
