function renderRegisterPage() {
    let main = document.querySelector("main");

    main.innerHTML = `
                <div class=image></div>
                <h2>Register</h2>
                <p id=message></p>
                <form>
                <input type=text id=email placeholder=email>
                    <input type=text id=username placeholder=Username>
                    <input type=password id=password placeholder=Password>
                    <button type=submit>Register</button>
                </form>
                <button id=login>Already got an account? Login here</button>
            `;

    let ButtonForLogin = main.querySelector("#login");
    ButtonForLogin.addEventListener("click", renderLoginPage);

    let RegisterButton = main.querySelector("form");
    RegisterButton.addEventListener("submit", async function (event) {
        event.preventDefault();
        let emailInput = main.querySelector("#email").value;
        let usernameInput = main.querySelector("#username").value;
        let passwordInput = main.querySelector("#password").value;
        let message = main.querySelector("#message");

        //Try to register
        try {
            let response = await fetch("../loginregister-api/register.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    //The value is from the two inputs
                    email: emailInput,
                    username: usernameInput,
                    password: passwordInput,

                }),
            });
            let data = await response.json();

            //if the response is ok and the user is added
            if (response.ok) {
                message.innerHTML = `The user ${data.username} was successfully added!`;
                //if it's not ok
            } else {
                message.innerHTML = `Something went wrong`;
            }
            //if something went wrong, we print out the error message we got from the database
        } catch (error) {
            message.textContent = `${error.message}`;
        }

    });
}

