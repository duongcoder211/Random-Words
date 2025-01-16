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
let randomIndex;
let newRandomIndex;
let isDisplay = false;
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
let addTab = function () {
    id = id + 1;
    newTab = {
        id: id,
        content: inputElm.value.trim(),
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
let addOrEditTabs = function () {
    if (isEdit) {
        index = Number(tabList.indexOf(currentTab));
        inputElm.value.trim() == "" ? alert("You must enter a word!") : setContent();
    }
    else {
        inputElm.value.trim() == "" ? alert("You must enter a word!") : addTab();
    }
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
            if(currentId == idEdit) {
                isEdit = !isEdit;
                currentTab = tabList.find((tab) => (tab.id == currentId));
                inputElm.focus();
                inputElm.value = currentTab.content;
            }
            else {
                isEdit = true;
                currentTab = tabList.find((tab) => (tab.id == currentId));
                inputElm.focus();
                inputElm.value = currentTab.content;
            }
            idEdit = currentId;
        })
    });
    deleteTabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            isEdit = false;
            btn.parentElement.parentElement.remove();
            currentId = Number(btn.parentElement.parentElement.id);
            currentTab = tabList.find((tab) => (tab.id == currentId));
            index = tabList.indexOf(currentTab);
            tabList.splice(index,1);
            updateLocalStorage();
        })
    });

}
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
        alert(tabList[newRandomIndex].content);
    }
}

addBtn.onclick = () => {
    addOrEditTabs();
}

inputElm.onkeydown = (e) => {
    if(e.key == "Enter") addOrEditTabs();
}
