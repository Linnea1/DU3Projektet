// The user starts out as `null` until we've logged in
let user = null;
// This is where we render all of our pages
let main = document.querySelector("main");

let username;
if (!window.localStorage.getItem("user")) {
    username = "Guest";
} else {
    username = localStorage.getItem("user");
}