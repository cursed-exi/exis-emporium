const standardCategories = ["Traits", "Actions", "Bonus Actions", "Reactions", "Legendary Break Actions"];

document.addEventListener("DOMContentLoaded", () => {
    const groups = document.getElementById("entry-groups");
    standardCategories.forEach(category => addCategory(category));
    document.getElementById("statblock-form").addEventListener("input", renderPreview);
    document.getElementById("add-section").addEventListener("click", () => addCategory("New Category"));
    document.getElementById("export-webp").addEventListener("click", exportWebp);
    renderPreview();

    function addCategory(name) {
        const group = document.createElement("section");
        group.className = "builder-entry-group";
        group.innerHTML = `
            <div class="builder-category-title">
                <input class="ui-input category-name" value="${escapeAttribute(name)}" aria-label="Category name">
                <button type="button" class="ui-button remove-category">Remove</button>
            </div>
            <div class="builder-entries"></div>
            <button type="button" class="ui-button add-entry">Add entry</button>`;
        group.querySelector(".add-entry").addEventListener("click", () => addEntry(group));
        group.querySelector(".remove-category").addEventListener("click", () => {
            group.remove();
            renderPreview();
        });
        groups.appendChild(group);
        addEntry(group);
    }

    function addEntry(group) {
        const entry = document.createElement("div");
        entry.className = "builder-entry";
        entry.innerHTML = `
            <input class="ui-input entry-name" placeholder="Entry name">
            <textarea class="ui-input entry-description" placeholder="Description"></textarea>
            <button type="button" class="ui-button remove-entry" aria-label="Remove entry">Remove</button>`;
        entry.querySelector(".remove-entry").addEventListener("click", () => {
            entry.remove();
            renderPreview();
        });
        group.querySelector(".builder-entries").appendChild(entry);
    }
});

function formValue(name) {
    return document.querySelector(`[name="${name}"]`).value.trim();
}

function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function escapeAttribute(value) {
    return escapeHtml(value);
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
    const optional = [
        ["Skills", "skills"], ["Resistances", "resistances"], ["Immunities", "immunities"],
        ["Languages", "languages"], ["Senses", "senses"]
    ];
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

    document.getElementById("statblock-preview").innerHTML = `
        <h4>${escapeHtml(formValue("name") || "Unnamed Creature")}</h4>
        <div class="type">${escapeHtml(formValue("size"))} ${escapeHtml(formValue("type"))}, ${escapeHtml(formValue("alignment"))} | CR ${escapeHtml(formValue("cr"))}</div>
        <hr>
        <p><strong>AC</strong> ${escapeHtml(formValue("ac"))}</p>
        <p><strong>HP</strong> ${escapeHtml(formValue("hp"))}</p>
        <p><strong>Speed</strong> ${escapeHtml(formValue("speed"))}</p>
        ${detailLines}
        <hr>
        <div class="stats">${scores.map(score => `<div><strong>${score}</strong>${escapeHtml(formValue(score))} (${modifier(formValue(score))})</div>`).join("")}</div>
        ${categories}`;
}

async function exportWebp() {
    const preview = document.getElementById("statblock-preview");
    const status = document.getElementById("export-status");
    const width = 1000;
    const height = Math.max(300, Math.ceil(preview.scrollHeight * (width / preview.offsetWidth)) + 4);
    const clone = preview.cloneNode(true);
    clone.style.cssText = "box-sizing:border-box;width:1000px;min-height:100%;padding:32px;border:2px solid #555;background:#0f0f0f;color:#ddd;font:28px Arial,sans-serif;line-height:1.4;";
    clone.querySelectorAll("h4").forEach(el => el.style.cssText = "margin:0;font-size:42px;color:#fff;");
    clone.querySelectorAll(".type").forEach(el => el.style.cssText = "color:#aaa;font-style:italic;margin-bottom:20px;");
    clone.querySelectorAll("hr").forEach(el => el.style.cssText = "border:0;border-top:2px solid #444;margin:16px 0;");
    clone.querySelectorAll("p").forEach(el => el.style.cssText = "margin:10px 0;");
    clone.querySelectorAll(".stats").forEach(el => el.style.cssText = "display:flex;justify-content:space-between;margin:18px 0;");
    clone.querySelectorAll(".stats div").forEach(el => el.style.cssText = "flex:1;text-align:center;");
    clone.querySelectorAll(".stats strong").forEach(el => el.style.cssText = "display:block;");
    clone.querySelectorAll(".action").forEach(el => el.style.cssText = "margin-top:18px;font-size:30px;color:#fff;");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${clone.outerHTML}</div></foreignObject></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    const image = new Image();
    image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width * 2;
        canvas.height = height * 2;
        const context = canvas.getContext("2d");
        context.scale(2, 2);
        context.drawImage(image, 0, 0);
        URL.revokeObjectURL(url);
        canvas.toBlob(blob => {
            if (!blob) {
                status.textContent = "Your browser could not create a WebP image.";
                return;
            }
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${(formValue("name") || "statblock").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "statblock"}.webp`;
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 1000);
            status.textContent = "WebP downloaded.";
        }, "image/webp", 0.95);
    };
    image.onerror = () => {
        URL.revokeObjectURL(url);
        status.textContent = "Unable to render the image. Try a Chromium-based browser.";
    };
    status.textContent = "Preparing WebP…";
    image.src = url;
}
