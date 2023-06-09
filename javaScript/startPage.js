
function renderStartPage() {
    //User is a guest before logging in
    if (!localStorage.getItem("user")) {
        localStorage.setItem("user", JSON.stringify({
            "username": "Guest",
            "guest": true
        }))
    }

    swapStyleSheet("css/start.css");
    document.querySelector("header").innerHTML = `
        <div class=image></div>
    `;

    main.innerHTML = `
        <h2>Welcome to YumYumClub</h2>
        <p id=message></p>
        <button id="login" onclick="renderLoginPage()">Login</button>
        <button id="register" onclick="renderRegisterPage()">Register</button> 
        <button id="guest" onclick="renderCategoriesPage()">Continue as Guest</button>  
    `;
}