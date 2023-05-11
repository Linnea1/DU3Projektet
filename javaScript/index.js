// The user starts out as `null` until we've logged in
let user = null;
// This is where we render all of our pages
let main = document.querySelector("main");

let wrapper = document.querySelector("#wrapper");


let username;
if (!window.localStorage.getItem("user")) {
    username = "Guest";
} else {
    username = localStorage.getItem("user");
}


async function fetching(URL, method, body) {
    let response = await fetch(URL, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    return response;
}

function popUp(prompt, button) { // pop up
    document.querySelector("#popUp").classList.remove("hidden");
    document.querySelector("#prompt").textContent = prompt;

    if (button) {
        let yes = document.createElement("button");
        let no = document.createElement("button");
        yes.textContent = "Yes";
        no.textContent = "No";
        yes.classList = "yes";
        no.classList = "no";
        document.querySelector("#popUpWindow").append(yes);
        document.querySelector("#popUpWindow").append(no);

        document.querySelector(".yes").addEventListener("click", e => {
            // document.querySelector("#popUp").classList.add("hidden");
            // deleteAccount();
        });
        document.querySelector(".no").addEventListener("click", e => { document.querySelector("#popUp").classList.add("hidden") });
    }
    document.querySelector("#popUpBackground").addEventListener("click", e => { document.querySelector("#popUp").classList.add("hidden") });
}


// vvv "Go back"-button related vvv 

let state = { // template 
    current_state: "",
    old_states: []
};

function goback() { // use this to make the go back button work
    document.querySelector(".goback").addEventListener("click", e => {
        eval(state.old_states.pop());
        // eval = make string into function
        // pop = return last element in array + splice it
    })
}

function currentState(renderFunction) {
    state.current_state = renderFunction;
    localStorage.setItem("state", JSON.stringify({
        "function": renderFunction,
        "state": state
    }));
}

function newState(element, renderFunction) { // use this when going to a new "state"
    document.querySelector(element).addEventListener("click", e => {
        state.old_states.push(state.current_state);
        eval(renderFunction);
    })
}
