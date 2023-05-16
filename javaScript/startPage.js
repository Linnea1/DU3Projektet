
renderStartPage();

function renderStartPage() {
    localStorage.setItem("user", JSON.stringify({
        "username": "Guest",
        "guest": true
    }))
    console.log(user);

    main.innerHTML = `
    <header>
        <div class=image></div>
    </header>
    <h2>Welcome to YumYumClub</h2>
    <p id=message></p>
    <button onclick="renderLoginPage()">Login</button>
    <button onclick="renderRegisterPage()">Register</button> 
    <button onclick="renderCategoriesPage()">Continue as Guest</button>  
    `;
}