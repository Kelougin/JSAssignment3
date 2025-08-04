const baseURL = "https://genshin.jmp.blue/"; //Base url
const selection = document.querySelector("select"); //Variable for hold select element from html
const characterDiv = document.querySelector("div"); //Variable for holding div from html

fetchCharactersAPI(); //Calls function
function fetchCharactersAPI() {
    let url = `${baseURL}characters`; //url to fetch from
    fetch(url) //fetches from url
        .then(response => {
                return response.json(); //Gets response in json
            })
        .then((json) => displayCharacterOptions(json)); //Calls function passing the json file

}

function displayCharacterOptions(json) {
    let characters = json; //Variable for holding character from json
    for(let i = 0; i < characters.length; i++){ //Loops through each character
        const options = document.createElement("option"); //creates element for option to store in selection
        options.value = characters[i]; //Set options elements value
        options.textContent = characters[i]; //Set options element text
        selection.appendChild(options); //Append options into selection
    }
    //console.log(json); for debuggin
}

selection.addEventListener("change", fetchCharacterInformationAPI); //Adds event listener to selection that detect change and calls function
function fetchCharacterInformationAPI(event) {
    event.preventDefault(); //Prevent default event
    if(characterDiv.hasChildNodes()) { //Check if div has a child
        characterDiv.removeChild(characterDiv.firstChild); //Removes the section from the div so only one character information is shown
    }
    let url = `${baseURL}characters/${selection.value}`; //Variable for url
    fetch(url)//fetch from url
        .then(response => {
        return response.json(); //Gets response in json
    }).then((json) => displayCharacterInformation(json)); //Calls function passing the json value
}

function displayCharacterInformation(json){
    const section = document.createElement("section"); //Variable for creating section
    const characterName = document.createElement("h2") //Variable for creating h2
    const paragraph = document.createElement("p"); //Variable for creating paragraph
    const unorderList = document.createElement("ul"); //Variable for creating un ordered list
    const button = document.createElement("button"); //Variable for creating un ordered list
    //Array for holding the level materials from the json
    let levelsAPI = [json.ascension_materials.level_20, json.ascension_materials.level_40, json.ascension_materials.level_50, json.ascension_materials.level_60, json.ascension_materials.level_70, json.ascension_materials.level_80];
    let totals = []; //Empty array for holding totals
    let increment = 0; //Increment for cycling array slot
    let materialNames=[]; //Empty array for item name

    characterName.textContent = json.name; //Set h2 element text content
    paragraph.innerHTML = "<strong>Nation:</strong> " + json.nation + " <strong>Vision:</strong> " + json.vision + " <strong>Weapon Type:</strong> " + json.weapon; //Set inner html for paragraph element
    button.textContent = "More information";

    for(let i = 0; i < levelsAPI.length; i++) { //Cycles through level api array
        let materials = levelsAPI[i]; //Variable for holding individual level value returned from json
        let levelTitles = ["Level 20", "Level 40", "Level 50", "Level 60", "Level 70", "Level 80"]; //Array for holding leve titles
        const levelTitleElement = document.createElement("h3"); //Variable for creating h3 element
        levelTitleElement.textContent = levelTitles[i]; //Set text content of h3 to corresponding level title
        unorderList.appendChild(levelTitleElement); //Add h3 to the ul element
        for (let j = 0; j < materials.length; j++) { //Loops through the element that were stored in materials
            const list = document.createElement("li"); //Creates list element
            list.innerHTML = `<strong>Material:</strong> ${materials[j].name}\n <strong>Value</strong>: ${materials[j].value}`; //Set list element inner html
            if(!materialNames.includes(materials[j].name)) { //Check if material names array includes the name from the json that were stored in materials
                materialNames[increment] = materials[j].name; //Adds name from to material names array
                totals[increment] = materials[j].value; //Adds value from json to totals arrays
                increment++; //Increase increment
            }else { //If a name already exists in array
                for(let k = 0; k < materialNames.length; k++) { //Cycle through material names array
                    if(materialNames[k] === materials[j].name) { //If the value at k equals the value at the current json name value do following
                        totals[k] += materials[j].value; //Increases total at the k index by value in json
                    }
                    //console.log(totals); debugging
                }
            }
            unorderList.appendChild(list); //Adds list to unorderList
        }
    }
    section.appendChild(characterName); //Adds h2 to section element
    section.appendChild(paragraph); //Adds paragraph to section element
    section.appendChild(unorderList); //Adds unordered list to section element
    characterDiv.appendChild(section); //Add section to the div
    displayTotalMaterials(totals, materialNames, section, unorderList); //Calls function to display materials
    section.appendChild(button);
    button.addEventListener("click", () => fetchBossMaterials(materialNames))
}

function displayTotalMaterials(totals, materials, section, unorderList) {
    const title = document.createElement("h3"); //Variable to create h3
    title.textContent = "Total Materials"; //Set h3 title
    unorderList.appendChild(title); //add title to ul
    for (let i = 0; i < totals.length; i++) { //cycles through element in totals array
        const list = document.createElement("li"); // Variable to create li element
        list.innerHTML = `<strong>Material</strong>: ${materials[i]} <strong>Total:</strong> ${totals[i]}`; //Set list element inner html
        unorderList.appendChild(list); //adds list to unordered list
    }
    section.appendChild(unorderList); //adds ul to section
}

function fetchBossMaterials(materialName) {
    let url = `${baseURL}materials/boss-material`; //String for url for boss materials
    let bossName; //Variable for bossName
    let bossDrop; //Variable for boss drops
    fetch(url) //fetch api from url
        .then(response => {
            return response.json(); //return response as json
        }).then((json) => {
            const bossMaterials = Object.values(json); //Store json as array
        for(let i = 0; i < bossMaterials.length; i++) {  //cycle through array
            if(materialName.includes(bossMaterials[i].name)) { //If materialName include the value of boss materials name
                bossName = bossMaterials[i].source; //Set boss name
                bossDrop = bossMaterials[i].name; //Set boss drop
            }
        }
        fetchEnemyMaterials(materialName,bossName, bossDrop); //Calls function
        //console.log(materialName);
    })
}

function fetchEnemyMaterials(materialName,bossName, bossDrop) {
    let url = `${baseURL}materials/common-ascension` //String for url for common materials
    let enemyName; //Variable for enemy name
    let characterDrops = []; //Array for drop names
    fetch(url) //fetch api from url
        .then(response => {
            return response.json(); //return response as json
        }).then((json) => {
        const enemyMaterials = Object.values(json); //Store json as array
        for(let i = 0; i < enemyMaterials.length - 1; i++) { //cycle through arrays
            let itemArray = enemyMaterials[i].items //Store array in variable
            for(let j = 0; j < itemArray.length; j++) { //cycle through arrays
                if(materialName.includes(itemArray[j].name)){ // if material name includes the value of item array name
                    if(enemyName !== enemyMaterials[i].sources[0]) { //If enemy name is not already stored in array
                        enemyName = enemyMaterials[i].sources[0] //Store enemy name in variable
                    }
                    characterDrops[j] = itemArray[j].name; //Store drops name in array
                    //console.log(enemyName); debugging
                }
            }
        }
        alert(`Farm ${bossName} to get ${bossDrop}\nFarm ${enemyName} to get ${characterDrops[0]}, ${characterDrops[1]}, ${characterDrops[2]}`); //Set alert for what to farm
    })
    //console.log(bossDrop); debugging
}