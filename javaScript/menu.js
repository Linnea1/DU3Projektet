function ShowMenu() {

    document.querySelector("#popUpWindow").innerHTML = `
        <p id="prompt"></p>
    `;

    let PopupMenu = document.querySelector("#popUp");
    PopupMenu.classList.remove("hidden");
    let PopUpWindow = document.querySelector("#popUpWindow");

    let Startpage = document.createElement("button");
    let Profile = document.createElement("button");
    let Nightmode = document.createElement("button");
    let LogOut = document.createElement("button");

    Startpage.classList.add("Startpage");
    Startpage.classList.add("goBack");
    Profile.classList.add("Profile");
    Nightmode.classList.add("Nightmode");
    LogOut.classList.add("LogOut");

    PopUpWindow.append(Startpage);
    PopUpWindow.append(Profile);
    PopUpWindow.append(Nightmode);
    PopUpWindow.append(LogOut);

    Startpage.textContent = "Startpage";
    Profile.textContent = "My Profile";
    Nightmode.textContent = "Nightmode";
    LogOut.textContent = "Log out";

    PopupMenu.addEventListener("click", e => {
        hideMenu(e)
    });

    Startpage.addEventListener("click", e => {
        newState();
        hideMenu(e)
        renderCategoriesPage()
    });

    Profile.addEventListener("click", e => {
        newState();
        hideMenu(e)
        RenderUserPage(user);
    })


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