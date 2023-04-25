// if (!window.localStorage.getItem("user")) {
renderStartPage();
// }
function renderStartPage() {
    main.innerHTML = `
    <h2>Welcome to YumYumClub</h2>
    <div class=image>image</div>
    <p id=message></p>
    <button onclick="renderLoginPage()">Login</button>
    <button onclick="renderRegisterPage()">Register</button> 
    <button onclick="renderCategoriesPage()">Continue as Guest</button>  
    `;
}