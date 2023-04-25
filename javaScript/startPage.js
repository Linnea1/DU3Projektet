// if (!window.localStorage.getItem("user")) {
renderStartPage();
// }
function renderStartPage() {
    main.innerHTML = `
    <div class=image></div>
    <h2>Welcome to YumYumClub</h2>
    <p id=message></p>
    <button onclick="renderLoginPage()">Login</button>
    <button onclick="renderRegisterPage()">Register</button> 
    <button onclick="renderCategoriesPage()">Continue as Guest</button>  
    `;
}