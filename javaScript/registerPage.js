function renderRegisterPage() {
    let main = document.querySelector("main");

    main.innerHTML = `
                <h2>Register</h2>
                <p id=message></p>
                <form>
                    <input type=text id=username placeholder=Username>
                    <input type=password id=password placeholder=Password>
                    <button type=submit>Register</button>
                </form>
                <button id=login>Already got an account? Login here</button>
            `;

    let ButtonForLogin = main.querySelector("#id");
    ButtonForLogin.addEventListener("click", renderLoginPage());

    let RegisterButton = main.querySelector("form");
    RegisterButton.addEventListener("submit", async function (event) {
        event.preventDefault();
        let usernameInput = main.querySelector("#id");
        let passwordInput = main.querySelector("#password");
        let message = main.querySelector("#message");

        try {
            let response = await fetch("loginregister-api/register.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: usernameInput.value,
                    password: passwordInput.value,

                }),
            });
            let data = await response.json();

            if (response.ok) {
                message.innerHTML = `The user ${data.username} was successfully added!`;
            } else {
                message.innerHTML = `Something went wrong`;
            }
        } catch (error) {
            message.innerHTML = `${error.message}`;
        }

    });
}

