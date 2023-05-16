function ShowMenu() {
    console.log("hej");
    let PopupMenu = document.querySelector("#popUp");
    PopupMenu.classList.remove("hidden");
    let PopUpWindow = document.querySelector("#popUpWindow");

    let Startpage = document.createElement("button");
    let Profile = document.createElement("button");
    let ManageAccount = document.createElement("button");
    let Nightmode = document.createElement("button");
    let LogOut = document.createElement("button");

    PopUpWindow.append(Startpage);
    PopUpWindow.append(Profile);
    PopUpWindow.append(ManageAccount);
    PopUpWindow.append(Nightmode);
    PopUpWindow.append(LogOut);

    Startpage.textContent = "Startpage";
    Profile.textContent = "My Profile";
    ManageAccount.textContent = "Manage My Account";
    Nightmode.textContent = "Nightmode";
    LogOut.textContent = "Log out";


    PopupMenu.addEventListener("click", e => {
        Disguise(e)
    });

    Startpage.addEventListener("click", e => {
        Disguise(e)
        renderCategoriesPage()
    });

    Profile.addEventListener("click", e => {
        Disguise(e)
        // if-sats om du är inloggad eller ej 
        RenderUserPage();
    })

    ManageAccount.addEventListener("click", e => {
        Disguise(e)
        renderSettings()
    });

    LogOut.addEventListener("click", e => {
        Disguise(e);
        logout();
    })
}

function Disguise(object) {
    object.stopPropagation();
    document.querySelector("#popUp").classList.add("hidden");

    document.querySelector("#popUpWindow").innerHTML = `
    <p id="prompt"></p>
    `;
}

function logout() {
    localStorage.clear();
    renderStartPage();
}

