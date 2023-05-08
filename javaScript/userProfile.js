function RenderUserPage() {
    const user = JSON.parse(localStorage.getItem("user"));

    main.innerHTML = `
    <div id="sticky"></div>
    <button onclick="history.back()">Go Back</button>
    <button onclick="renderSettings()" id="settings">Settings</button>
    <div class="userInfo">
        <div class="icon"></div>
        <h2><b>${user.username}</b></h2>
    </div>
    <div class="columns">
        <div>Recipes</div>
        <div class="favorites">Favorites</div>
    </div>
`;
    document.querySelector(".favorites").addEventListener("click", favoriteRecipes(user.username));
}

function renderSettings() {
    const user = JSON.parse(localStorage.getItem("user"));

    main.innerHTML = `
    <button onclick="RenderUserPage()">Go Back</button>
    <div id="settings">
        <label for="pfp">Change profile picture</label>
        <input type="file" name="pfp">
        <button type="submit">Upload</button>
        
        <label for="email">Change email</label>
        <input type="text" placeholder="New email" name="email">

        <label for="username">Change username</label>
        <input type="text" placeholder="New username" name="username">
        
        <label for="password">Change password</label>
        <input type="password" placeholder="Old password" name="passwordold">
        <input type="password" placeholder="New password" name="passwordnew">
        
        <p class="red">Delete account</p>
    </div>
`;

    let newUsername = main.querySelector('input[name="username"]');
    let newEmail = main.querySelector('input[name="email"]');
    let newPassword = main.querySelector('input[name="passwordnew"]');
    let oldPassword = main.querySelector('input[name="passwordold"]');

    main.querySelector(".red").addEventListener("click", e => { popUp("Are you sure", true) }); // "delete account"
    newUsername.addEventListener("keydown", changeUsername); // "change username"
    newEmail.addEventListener("keydown", changeEmail); // "change username"
    newPassword.addEventListener("keydown", changePassword); // "change username"
    oldPassword.addEventListener("keydown", changePassword);

    function popUp(prompt, button) { // pop up
        document.querySelector("#popUp").classList.remove("hidden");
        document.querySelector("#prompt").textContent = prompt;

        if (button) {
            let yes = document.createElement("button");
            let no = document.createElement("button");
            yes.textContent = "Yes";
            no.textContent = "No";
            yes.classList = "yes";
            no.classList = "no";
            document.querySelector("#popUpWindow").append(yes);
            document.querySelector("#popUpWindow").append(no);

            document.querySelector(".yes").addEventListener("click", e => {
                document.querySelector("#popUp").classList.add("hidden");
                deleteAccount();
            });
            document.querySelector(".no").addEventListener("click", e => { document.querySelector("#popUp").classList.add("hidden") });
        }
        document.querySelector("#popUpBackground").addEventListener("click", e => { document.querySelector("#popUp").classList.add("hidden") });
    }

    async function change(body, URL, method, select) {
        let response = await fetching(URL, method, body);
        let data = await response.json();

        if (response.status == 200) {
            let storage = JSON.parse(localStorage.getItem("user"));
            storage[select] = data;
            localStorage.setItem("user", JSON.stringify(storage));

            popUp("Successfully changed!")
        } else {
            popUp(data.message);
        }
    }

    async function changeUsername(e) { // change username
        if (e.key === "Enter") {
            let body = {
                username: JSON.parse(localStorage.getItem("user")).username,
                new: newUsername.value,
                password: JSON.parse(localStorage.getItem("user")).password
            };

            await change(body, "../loginregister-api/settings.php", "POST", "username");
        }
    }

    async function changeEmail(e) { // change email
        if (e.key === "Enter") {
            let body = {
                email: JSON.parse(localStorage.getItem("user")).email,
                new: newEmail.value,
                password: JSON.parse(localStorage.getItem("user")).password
            };

            await change(body, "../loginregister-api/settings.php", "POST", "email");
        }
    }

    async function changePassword(e) { // change password
        if (e.key === "Enter") {
            let body = {
                old: oldPassword.value,
                new: newPassword.value,
                password: JSON.parse(localStorage.getItem("user")).password,
                username: JSON.parse(localStorage.getItem("user")).username
            };

            await change(body, "../loginregister-api/settings.php", "POST", "password");
        }
    }

    async function deleteAccount() { // delete
        let body = {
            username: user.username,
            password: user.password
        };

        let response = await fetching("../loginregister-api/settings.php", "DELETE", body);
        let data = await response.json();

        console.log(data);
        renderStartPage();
    }
}




function favoriteRecipes(username) {
    console.log("favvo");
}