
function renderStartPage() {
    //User is a guest before logging in
    if(!localStorage.getItem("user")){
        localStorage.setItem("user", JSON.stringify({
            "username": "Guest",
            "guest": true
        }))
    }
   
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