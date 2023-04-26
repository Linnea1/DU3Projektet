function renderLoginPage() {
    main.innerHTML =
        `
        <header>
            <div class=image></div>
        </header>
        <h2>Login</h2>
        <p id=message></p>
        <form>
            <input type=text id=username placeholder=Username>
            <input type=password id=password placeholder=Password>
            <button type=submit>Login</button>
        </form>
        <button id=register>New to this? Sign up for free</button>
        `;

    // go to register
    main.querySelector("#register").addEventListener("click", renderRegisterPage);

    let loginForm = main.querySelector("form");
    let username = main.querySelector("#username");
    let password = main.querySelector("#password");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        let errorMessage = main.querySelector("#message");

        try { // trying to log in...
            let response = await fetch("../loginregister-api/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value,
                }),
            });

            let data = await response.json();

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