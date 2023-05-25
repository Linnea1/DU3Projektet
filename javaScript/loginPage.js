
function renderLoginPage() {
    main.innerHTML = `
        <h2>Login</h2>
        <p id=message></p>
        <form>
            <input type=text id=username placeholder=Username>
            <input type=password id=password placeholder=Password>
            <button id=login type=submit>Login</button>
        </form>
        <button id=register>New to this?</br>Sign up for free</button>
    `;

    // go to register
    main.querySelector("#register").addEventListener("click", renderRegisterPage);

    let loginForm = main.querySelector("form");
    let username = main.querySelector("#username");
    let password = main.querySelector("#password");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        let errorMessage = main.querySelector("#message");

        let body = {
            username: username.value,
            password: password.value,
        };

        // trying to log in...
        try {
            let response = await fetching("api/login.php", "POST", body);
            let data = await response.json();

            data.password = password.value;

            if (!response.ok) {
                errorMessage.innerHTML = `<span>${data.message}</span>.`; // error message
            } else {
                // add to local storage
                window.localStorage.setItem("user", JSON.stringify(data));

                user = data;

                // logged in! (adding function later)
                renderCategoriesPage()
            }
        } catch (err) { // if something went wrong
            errorMessage.textContent = `Error: ${err.message}`;
        }
    });
}