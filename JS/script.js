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
        const paragraph = document.createElement("p");
        const orderList = document.createElement("ul");
        let levelsAPI = [json.ascension_materials.level_20, json.ascension_materials.level_40, json.ascension_materials.level_50, json.ascension_materials.level_60, json.ascension_materials.level_70, json.ascension_materials.level_80];
        let totals = [];
        let increment = 0;
        let materialNames=[];

        characterName.textContent = json.name;
        paragraph.textContent = "Nation: " + json.nation + " Vision: " + json.vision + " Weapon Type: " + json.weapon;

        for(let i = 0; i < levelsAPI.length; i++) {
            let materials = levelsAPI[i];
            let levelTitles = ["Level 20", "Level 40", "Level 50", "Level 60", "Level 70", "Level 80"];
            const levelTitleElement = document.createElement("h3");
            levelTitleElement.textContent = levelTitles[i];
            orderList.appendChild(levelTitleElement);
           for (let j = 0; j < materials.length; j++) {
               const list = document.createElement("li");
               list.textContent = `Material: ${materials[j].name}\n Value: ${materials[j].value}`;
               if(!materialNames.includes(materials[j].name)) {
                   materialNames[increment] = materials[j].name;
                   totals[increment] = materials[j].value;
                   increment++;
               }else {
                   for(let k = 0; k < materialNames.length; k++) {
                       if(materialNames[k] === materials[j].name) {
                           totals[k] += materials[j].value;
                       }
                       console.log(totals);
                   }

               }
               orderList.appendChild(list);
           }
        }
        section.appendChild(characterName);
        section.appendChild(paragraph);
        section.appendChild(orderList);
        characterDiv.appendChild(section);
        displayTotalMaterials(totals, materialNames);
    })
}
function displayTotalMaterials(totals, materials){

}
