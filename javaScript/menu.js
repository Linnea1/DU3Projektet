function ShowMenu() {

    document.querySelector("#popUpWindow").innerHTML = `
        <p id="prompt"></p>
    `;

    let PopupMenu = document.querySelector("#popUp");
    PopupMenu.classList.remove("hidden");
    let PopUpWindow = document.querySelector("#popUpWindow");

    let Startpage = document.createElement("button");
    let Nightmode = document.createElement("button");
    let LogOut = document.createElement("button");

    Startpage.classList.add("Startpage");
    Startpage.classList.add("goBack");
    Nightmode.classList.add("Nightmode");
    LogOut.classList.add("LogOut");

    PopUpWindow.append(Startpage);
    PopUpWindow.append(Nightmode);
    PopUpWindow.append(LogOut);

    Startpage.textContent = "Startpage";
    Nightmode.textContent = "Nightmode";
    if (user.guest) {
        LogOut.textContent = "Login or register";
    } else {
        LogOut.textContent = "Log out";
    }

    PopupMenu.addEventListener("click", e => {
        hideMenu(e)
    });

    Startpage.addEventListener("click", e => {
        newState();
        hideMenu(e)
        renderCategoriesPage()
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