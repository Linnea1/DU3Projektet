function ShowMenu() {

    document.querySelector("#popUpWindow").innerHTML = `
        <p id="prompt"></p>
    `;

    let PopupMenu = document.querySelector("#popUp");
    PopupMenu.classList.remove("hidden");
    let PopUpWindow = document.querySelector("#popUpWindow");

    let Startpage = document.createElement("button");
    let Profile = document.createElement("button");
    let ManageAccount = document.createElement("button");
    let Nightmode = document.createElement("button");
    let LogOut = document.createElement("button");

    Startpage.classList.add("Startpage");
    Startpage.classList.add("goBack");
    Profile.classList.add("Profile");
    ManageAccount.classList.add("ManageAccount");
    Nightmode.classList.add("Nightmode");
    LogOut.classList.add("LogOut");

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

    newState(".Startpage", "renderCategoriesPage()");
    newState(".Profile", `RenderUserPage(${localStorage.user})`);
    newState(".ManageAccount", "renderSettings()");

    PopupMenu.addEventListener("click", e => {
        hideMenu(e)
    });

    Startpage.addEventListener("click", e => {
        hideMenu(e)
        renderCategoriesPage()
    });

    Profile.addEventListener("click", e => {
        hideMenu(e)
        // if-sats om du är inloggad eller ej 
        RenderUserPage();
    })

    ManageAccount.addEventListener("click", e => {
        hideMenu(e)
        renderSettings()
    });

    LogOut.addEventListener("click", e => {
        hideMenu(e);
        logout();
    })
}

function hideMenu(object) {
    object.stopPropagation();
    document.querySelector("#popUp").classList.add("hidden");

    document.querySelector("#popUpWindow").innerHTML = `
    <p id="prompt"></p>
    `;
}