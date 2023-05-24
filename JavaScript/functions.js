// Get user from local storage
let user = JSON.parse(localStorage.getItem("user"));

// This is where we render all of our pages
let main = document.querySelector("main");
let wrapper = document.querySelector("#wrapper");

//The function we use to fetch our data
async function fetching(URL, method, body) {
    let response = await fetch(URL, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    return response;
}

//Function to display popup
function popUp(prompt) { // pop up
    document.querySelector("#popUpWindow").innerHTML = `
         <p id="prompt"></p>
    `;

    document.querySelector("#popUp").classList.remove("hidden");
    document.querySelector("#prompt").textContent = prompt;

    let button = document.createElement("button");
    button.textContent = "OK";
    button.classList = "OK";
    document.querySelector("#popUpWindow").append(button);
    document.querySelector(".OK").addEventListener("click", e => { document.querySelector("#popUp").classList.add("hidden") });
    document.querySelector("#popUpBackground").addEventListener("click", e => { document.querySelector("#popUp").classList.add("hidden") });
}

function complexPopUp(prompt, button1, button2, func) {
    document.querySelector("#popUpWindow").innerHTML = `
        <p id="prompt"></p>
    `;

    document.querySelector("#popUp").classList.remove("hidden");
    document.querySelector("#prompt").textContent = prompt;

    let firstButton = document.createElement("button");
    let secondButton = document.createElement("button");

    firstButton.textContent = button1;
    secondButton.textContent = button2;

    firstButton.classList = "firstButton";
    secondButton.classList = "secondButton";

    document.querySelector("#popUpWindow").append(firstButton);
    document.querySelector("#popUpWindow").append(secondButton);
    document.querySelector(".firstButton").addEventListener("click", e => {
        document.querySelector("#popUp").classList.add("hidden");
        eval(func);
    });
    document.querySelector(".secondButton").addEventListener("click", e => { document.querySelector("#popUp").classList.add("hidden") });
    document.querySelector("#popUpBackground").addEventListener("click", e => { document.querySelector("#popUp").classList.add("hidden") });
}

//To check current state
let state = {
    current_state: {
        function_name: "",
        params: "",
    },
    old_states: []
};

function goBack() { // use this to make the go back button work
    document.querySelector(".goBack").addEventListener("click", e => {
        eval(state.old_states.pop());
        // eval = make string into function
        // pop = return last element in array + splice it
    })
}

function currentState(renderFunction) {
    console.log(state);

    state.current_state = renderFunction;
    localStorage.setItem("state", JSON.stringify({
        "function": renderFunction,
        "state": state
    }));
}

function newState(Guest) { // use this when going to a new "state"
    if (Guest) {//This checks if restricted page
        if (user.guest) {// If the user is a guest
            complexPopUp("Only registered users can use this feature", "Register or login", "OK", "logout()");
        } else {//if user is not a guest
            state.old_states.push(state.current_state);
        }
    } else {
        state.old_states.push(state.current_state);
    }
}

function basicHeader() {
    let user = JSON.parse(localStorage.getItem("user"));

    document.querySelector("header").innerHTML = `
    <div id="menu" onclick="">
        <div class="menuPart"></div>
        <div class="menuPart"></div>
        <div class="menuPart"></div>
    </div>  
    <div class="nameOfApplication"> The YumYumClub </div>
    <div id="profilePicture" class="icon"></div>
    `;

    if (user.guest || !user.pfp) {
        document.querySelector("#profilePicture").removeAttribute("style");
    } else {
        document.querySelector("#profilePicture").style.backgroundImage = `url(${user.pfp})`;
    }

    document.querySelector("#profilePicture").addEventListener("click", e => {
        newState();
        RenderUserPage(user);
    });

    document.querySelector("#menu").addEventListener("click", ShowMenu);
}

function swapStyleSheet(styleSheet) {
    document.getElementById("styles").setAttribute("href", styleSheet);
}

function logout() {
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify({
        "username": "Guest",
        "guest": true
    }));
    renderStartPage();
    location.reload();
}