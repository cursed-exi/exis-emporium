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

function createExportLayout(context, width) {
    const commands = [];
    const margin = 32;
    const maxWidth = width - margin * 2;
    let y = 58;
    const addText = (text, font, color, gap = 10) => {
        context.font = font;
        const words = String(text || "").split(/\s+/).filter(Boolean);
        let line = "";
        const lines = [];
        words.forEach(word => {
            const candidate = line ? `${line} ${word}` : word;
            if (line && context.measureText(candidate).width > maxWidth) { lines.push(line); line = word; }
            else line = candidate;
        });
        if (line) lines.push(line);
        const fontSize = Number(font.match(/(\d+)px/)[1]);
        lines.forEach(lineText => { commands.push({ kind: "text", text: lineText, font, color, x: margin, y }); y += fontSize + gap; });
    };
    const addRule = () => { y += 8; commands.push({ kind: "line", y }); y += 24; };

    addText(formValue("name") || "Unnamed Creature", "bold 42px Arial", "#ffffff", 12);
    addText(`${formValue("size")} ${formValue("type")}, ${formValue("alignment")} | CR ${formValue("cr")}`, "italic 24px Arial", "#aaaaaa", 12);
    addRule();
    [["AC", "ac"], ["HP", "hp"], ["Speed", "speed"], ["Skills", "skills"], ["Resistances", "resistances"], ["Immunities", "immunities"], ["Languages", "languages"], ["Senses", "senses"]].forEach(([label, key]) => {
        const value = formValue(key);
        if (value) addText(`${label}  ${value}`, "24px Arial", "#dddddd");
    });
    addRule();
    addText(["STR", "DEX", "CON", "INT", "WIS", "CHA"].map(score => `${score} ${formValue(score)} (${modifier(formValue(score))})`).join("    "), "bold 21px Arial", "#ffffff", 14);
    [...document.querySelectorAll(".builder-entry-group")].forEach(group => {
        const entries = [...group.querySelectorAll(".builder-entry")].map(entry => ({ name: entry.querySelector(".entry-name").value.trim(), description: entry.querySelector(".entry-description").value.trim() })).filter(entry => entry.name || entry.description);
        if (!entries.length) return;
        addRule();
        addText(group.querySelector(".category-name").value.trim() || "Category", "bold 28px Arial", "#ffffff", 12);
        entries.forEach(entry => addText(`${entry.name || "Entry"}.  ${entry.description}`, "24px Arial", "#dddddd"));
    });
    return { commands, height: y + 30 };
}

function exportWebp() {
    const status = document.getElementById("export-status");
    const width = 1000;
    const layoutCanvas = document.createElement("canvas");
    const layout = createExportLayout(layoutCanvas.getContext("2d"), width);
    const canvas = document.createElement("canvas");
    canvas.width = width * 2;
    canvas.height = Math.ceil(layout.height * 2);
    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.fillStyle = "#0f0f0f";
    context.fillRect(0, 0, width, layout.height);
    context.strokeStyle = "#555";
    context.lineWidth = 2;
    context.strokeRect(1, 1, width - 2, layout.height - 2);
    layout.commands.forEach(command => {
        if (command.kind === "line") {
            context.strokeStyle = "#444";
            context.beginPath(); context.moveTo(32, command.y); context.lineTo(width - 32, command.y); context.stroke();
        } else {
            context.font = command.font;
            context.fillStyle = command.color;
            context.fillText(command.text, command.x, command.y);
        }
    });
    status.textContent = "Preparing WebP...";
    canvas.toBlob(blob => {
        if (!blob) { status.textContent = "Your browser could not create a WebP image."; return; }
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${(formValue("name") || "statblock").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "statblock"}.webp`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        status.textContent = "WebP downloaded.";
    }, "image/webp", 0.95);
}
