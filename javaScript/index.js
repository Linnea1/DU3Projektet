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

function newState(element, renderFunction) { // use this when going to a new "state" (not working yet)
    document.querySelector(element).addEventListener("click", e => {
        state.old_states.push(state.current_state);
        renderFunction;
    })
}
