function ShowMenu() {
    console.log("hej");
    let PopupMenu = document.querySelector("#popUp");
    PopupMenu.classList.remove("hidden");
    let PopUpWindow = document.querySelector("#popUpWindow");

    let Home = document.createElement("button");
    let Favourites = document.createElement("button");
    let ManageAccount = document.createElement("button");
    let Nightmode = document.createElement("button");
    let LogOut = document.createElement("button");

    PopUpWindow.append(Home);
    PopUpWindow.append(Favourites);
    PopUpWindow.append(ManageAccount);
    PopUpWindow.append(Nightmode);
    PopUpWindow.append(LogOut);

    Home.textContent = "Home";
    Favourites.textContent = "Favourites";
    ManageAccount.textContent = "Manage My Account";
    Nightmode.textContent = "Nightmode";
    LogOut.textContent = "Log out";


    PopupMenu.addEventListener("click", e => {
        Disguise(e)
    });

    Home.addEventListener("click", e => {
        Disguise(e)
        renderCategoriesPage()
    });

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
    localStorage.removeItem("user");
    location.reload();
}

