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
        <div>Favorites</div>
    </div>
`;
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
        
        <label for="username">Change password</label>
        <input type="text" placeholder="Old password" name="passwordold">
        <input type="text" placeholder="New password" name="passwordnew">
        
        <p class="red">Delete account</p>
    </div>
`;

    let newUsername = main.querySelector('input[name="username"]');
    let newEmail = main.querySelector('input[name="email"]');
    let newPassword = main.querySelector('input[name="passwordnew"]');
    let oldPassword = main.querySelector('input[name="passwordold"]');

    main.querySelector(".red").addEventListener("click", popUp); // "delete account"
    newUsername.addEventListener("keydown", changeUsername); // "change username"
    newEmail.addEventListener("keydown", changeEmail); // "change username"
    newPassword.addEventListener("keydown", changePassword); // "change username"
    oldPassword.addEventListener("keydown", changePassword);

    function popUp(prompt) { // pop up
        document.querySelector("#popUp").classList.remove("hidden");
        document.querySelector("#prompt").textContent = "Are you sure?"

        document.querySelector("#yes").addEventListener("click", e => {
            document.querySelector("#popUp").classList.add("hidden");
            deleteAccount();
        });
        document.querySelector("#no").addEventListener("click", e => { document.querySelector("#popUp").classList.add("hidden") });
    }

    async function changeUsername(e) { // change username
        if (e.key === "Enter") {

            let body = {
                username: JSON.parse(localStorage.getItem("user")).username,
                new: newUsername.value,
                password: JSON.parse(localStorage.getItem("user")).password
            };

            let response = await fetching("../loginregister-api/settings.php", "POST", body);
            let data = await response.json();

            if (response.status == 200) {
                let storage = JSON.parse(localStorage.getItem("user"));
                storage.username = data;
                localStorage.setItem("user", JSON.stringify(storage));
            } else {
                console.log(data);
            }
        }
    }

    async function changeEmail(e) { // change email
        if (e.key === "Enter") {

            let body = {
                email: JSON.parse(localStorage.getItem("user")).email,
                new: newEmail.value,
                password: JSON.parse(localStorage.getItem("user")).password
            };

            let response = await fetching("../loginregister-api/settings.php", "POST", body);
            let data = await response.json();

            if (response.status == 200) {
                let storage = JSON.parse(localStorage.getItem("user"));
                storage.email = data;
                localStorage.setItem("user", JSON.stringify(storage));
            } else {
                console.log(data);
            }
        }
    }

    async function changePassword(e) { // change password
        if (e.key === "Enter") {

            if (oldPassword.value == "" || newPassword.value == "") {
                console.log("Don't leave any field empty");
            }

            let body = {
                old: oldPassword.value,
                new: newPassword.value,
                username: JSON.parse(localStorage.getItem("user")).username
            };

            let response = await fetching("../loginregister-api/settings.php", "POST", body);
            let data = await response.json();

            if (response.status == 200) {
                let storage = JSON.parse(localStorage.getItem("user"));
                storage.password = data;
                localStorage.setItem("user", JSON.stringify(storage));
            } else {
                console.log(data);
            }
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