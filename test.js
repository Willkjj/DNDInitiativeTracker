function createDropdownEditor(character) {
    const form = document.createElement("form");
    form.classList.add("dropdownEditor");

    const select = document.createElement("select");
    const input = document.createElement("input");

    // Add character keys to dropdown
    Object.keys(character).forEach(key => {
        if (key === "id") return; // skip id

        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        select.appendChild(option);
    });

    // Set initial input value
    let currentKey = select.value;
    input.value = character[currentKey];
    input.type = typeof character[currentKey] === "number"
        ? "number"
        : "text";

    // When dropdown changes
    select.addEventListener("change", () => {
        currentKey = select.value;
        input.value = character[currentKey];

        input.type = typeof character[currentKey] === "number"
            ? "number"
            : "text";
    });

    // When input changes
    input.addEventListener("input", (e) => {
        if (input.type === "number") {
            character[currentKey] = Number(e.target.value);
        } else {
            character[currentKey] = e.target.value;
        }
    });

    form.appendChild(select);
    form.appendChild(input);

    return form;
}