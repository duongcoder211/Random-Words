import { stringInputExport } from "./dictionaryrandom.js";
console.log(stringInputExport);
let clearBtn = document.querySelector("#clear-list-button");
let randomBtn = document.querySelector("#start-random-button");
let displayBtn = document.querySelector("#visible-list-button");
let inputElm = document.querySelector("#input-word");
let addBtn = document.querySelector("#add-button");
let editTabBtns;
let deleteTabBtns;
let listAreaElm = document.querySelector(".list-area");
let id = 0;
let isEdit = false;
let idEdit;
let currentTab;
let currentId;
let index;
let randomIndex;
let newRandomIndex;
let isDisplay = false;
let isOrigin = true;
let alertElm = document.querySelector(".alert");
let closeElm = document.querySelector(".close");
let contentAlertElm = document.querySelector(".content-alert");
let contentFrontElm = document.querySelector(".front");
let contentBackElm = document.querySelector(".back");
let wordAlert = "";
let scriptAlert = "";
const TABS_LIST = "tabList";
let tabList = []; // mang goc, dung de lay thong tin, du lieu cho code;
let tab_List = [];

let updateLocalStorage = function () {
    localStorage.setItem(TABS_LIST,JSON.stringify(tabList)); 
}
let getLocalStorage = function () {
    tab_List = JSON.parse(localStorage.getItem(TABS_LIST));
    tabList = tab_List;
}
let addTab = function (val,mns) {
    id = id + 1;
    let newTab = {
        id: id,
        content: val || inputElm.value.split("-")[0],
        script: mns || "Enter meaning"
    }
    tabList.push(newTab);
    updateLocalStorage();
    inputElm.value = "";
    render();
}
let setContent = function () {
    tabList[index].content = inputElm.value.trim();
    inputElm.value = "";
    render();
    updateLocalStorage();
    isEdit = !isEdit;
}
let alertContent = (word, mean) => {
    if(isOrigin) {
        contentAlertElm.style.transform = "rotateY(0deg)";
        contentFrontElm.style.transform = "rotateY(0deg)";
        contentBackElm.innerHTML = "";
        contentFrontElm.innerHTML = word;
    }
    else {
        contentAlertElm.style.transform = "rotateY(180deg)";
        contentBackElm.style.transform = "rotateY(180deg)";
        contentFrontElm.innerHTML = "";
        contentBackElm.innerHTML = mean;
    }
}
let active = function (act) {
    act.classList.add("active");
}
let deActive = function () {
    let activeElm = listAreaElm.querySelector(".active");
    if(activeElm) activeElm.classList.remove("active");
}
updateLocalStorage();
getLocalStorage();
let render = function () {
    let result = tabList.map((tab)=>{
        return `
            <div class="tags" id="${tab.id}">
                    <p class="content">${tab.content}</p>
                    <div class="setting-buttons">
                        <div class="tag_button" id="edit-button">
                            <img src="./Icons/edit.png" alt="Edit" srcset="">
                        </div>
                        <div class="tag_button" id="delete-button">
                            <img src="./Icons/delete.png" alt="Delete" srcset="">
                    </div>
                    </div>
                </div>
        `
    })
    result = result.join("");
    listAreaElm.innerHTML = result;
    editTabBtns = document.querySelectorAll("#edit-button");
    deleteTabBtns = document.querySelectorAll("#delete-button");
    editTabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            currentId = Number(btn.parentElement.parentElement.id);
            deActive();
            if(currentId == idEdit) {
                isEdit = !isEdit;
                if(isEdit) {
                    currentTab = tabList.find((tab) => (tab.id == currentId));
                    active(btn.parentElement.parentElement);
                    inputElm.focus();
                    inputElm.value = currentTab.content;
                }
                else {
                    inputElm.value = "";
                }
                
            }
            else {
                isEdit = true;
                active(btn.parentElement.parentElement);
                currentTab = tabList.find((tab) => (tab.id == currentId));
                inputElm.focus();
                inputElm.value = currentTab.content;
            }
            idEdit = currentId;
        })
    });
    deleteTabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            if(isEdit) {inputElm.value = ""};
            isEdit = false;
            deActive();
            btn.parentElement.parentElement.remove();
            currentId = Number(btn.parentElement.parentElement.id);
            currentTab = tabList.find((tab) => (tab.id == currentId));
            index = tabList.indexOf(currentTab);
            tabList.splice(index,1);
            updateLocalStorage();
        })
    });

}

function processInputString (stringInput) {
        if(stringInput.includes(";")) {
            let arrInput = inputElm.value.split(";");
            arrInput.forEach((elm) => {
                if(elm.trim() != "") { 
                    let setWord = elm.trim();
                    if(setWord.includes("-")) {
                        setWord = setWord.split("-");
                        addTab(setWord[0].trim(), setWord[1].trim());
                    }
                    else addTab(setWord,"")                    
                }
            })
        }
        if(stringInput.includes(";") == false) {
            inputElm.value.trim() == "" ? alert("You must enter a word!") : addTab(inputElm.value.split("-")[0],inputElm.value.split("-")[1]);
        }
}

let addOrEditTabs = function () {
    if (isEdit) {
        index = Number(tabList.indexOf(currentTab));
        inputElm.value.trim() == "" ? alert("You must enter a word!") : setContent();
    }
    else {
        let contentTab = inputElm.value;
        processInputString(contentTab);
    }
}


function loadDictionary () {
    inputElm.value = stringInputExport;
    if(stringInputExport) processInputString(inputElm.value);
    render()
}

loadDictionary();

clearBtn.onclick = () => {
    isEdit = false;
    tabList = [];
    inputElm.value = "";
    updateLocalStorage();
    render();
}

displayBtn.onclick = () => {
    isDisplay = !isDisplay;
    if(isDisplay) {
        listAreaElm.style.display = "none";
        displayBtn.src = "./Icons/invisible.png";
    } 
    else {
        listAreaElm.style.display = "block";
        displayBtn.src = "./Icons/visible.png";
    }
}

randomBtn.onclick = () => {
    if(tabList.length == 0) alert("Do not have any words in the list!");
    else {
        randomIndex = newRandomIndex;
        do {
            newRandomIndex = Math.floor((Math.random()/(1/tabList.length)));
        }
        while (newRandomIndex == tabList.length || (randomIndex == newRandomIndex && tabList.length > 1));
        // alert(tabList[newRandomIndex].content);
        alertElm.style.display = "block";
        isOrigin = true;
        alertContent(tabList[newRandomIndex].content,newRandomIndex);
        wordAlert = tabList[newRandomIndex].content.split("-")[0].trim();
        scriptAlert = tabList[newRandomIndex].script;
    }
}

addBtn.onclick = () => {
    addOrEditTabs();
}

inputElm.onkeydown = (e) => {
    if(e.key == "Enter") addOrEditTabs();
}

contentAlertElm.onclick = (e) => {
    isOrigin = !isOrigin;
    alertContent(wordAlert,scriptAlert)
}

closeElm.onclick = () => {
    alertElm.style.display = "none";  
}
