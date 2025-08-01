const baseURL = "https://genshin.jmp.blue/";
const selection = document.querySelector("select");
const characterDiv = document.querySelector("div");

fetchAPI();
function fetchAPI() {
    let sections = ["artifacts", "boss", "characters", "consumables", "domains", "elements", "enemies", "materials", "nations", "weapons"];

    for (let i = 0; i < sections.length; i++) {
        let url = `${baseURL}${sections[i]}`;
        fetch(url)
            .then(response => {
                return response.json();
            })
            .then((json) => displayCharacterOptions(json, sections[i]));
    }
}
function displayCharacterOptions(json, sections) {
    if(sections === "characters"){
        let characters = json;
        for(let i = 0; i < characters.length; i++){
            const options = document.createElement("option");
            options.value = characters[i];
            options.textContent = characters[i];
            selection.appendChild(options);
        }
        console.log(json);
    }
}

selection.addEventListener("change", displayCharacter);
function displayCharacter(event) {
    event.preventDefault();
    if(characterDiv.hasChildNodes()) {
        characterDiv.removeChild(characterDiv.firstChild);
    }
    let url = `${baseURL}characters/${selection.value}`;
    fetch(url).then(response => {
        return response.json();
    }).then((json) => {
        const section = document.createElement("section");
        const characterName = document.createElement("h2")
        characterName.textContent = json.name;
        section.appendChild(characterName);
        characterDiv.appendChild(section);
        console.log(json);
    })
}