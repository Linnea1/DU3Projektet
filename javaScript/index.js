// The user starts out as `null` until we've logged in
let user = null;
// This is where we render all of our pages
let main = document.querySelector("main");

let wrapper = document.querySelector("#wrapper");


async function fetching(URL, method, body) {
    let response = await fetch(URL, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    return response;
}