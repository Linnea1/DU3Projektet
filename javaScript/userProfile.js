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
        
        <form>
            <label for="email">Change email</label>
            <input type="hidden" name="hidden" value="${user.username}">
            <input type="text" placeholder="New email" name="email">
            <button type="submit">Confirm</button>
        </form>

        <label for="username">Change username</label>
        <input type="text" placeholder="New username" name="username">
        
        <label for="username">Change password</label>
        <input type="text" placeholder="New password" name="password">
        
        <p class="red">Delete account</p>
    </div>
`;

    // let storage = JSON.parse(localStorage.getItem("user"));
    // storage.username = "hejsan";
    // localStorage.setItem("user", JSON.stringify(storage));

    let newUsername = main.querySelector('input[name="username"]');

    main.querySelector(".red").addEventListener("click", popUp); // "delete account"
    newUsername.addEventListener("keydown", changeUsername); // "change username"

    function popUp(prompt) { // pop up
        document.querySelector("#popUp").classList.remove("hidden");
        document.querySelector("#prompt").textContent = "Are you sure?"

        document.querySelector("#yes").addEventListener("click", e => {
            document.querySelector("#popUp").classList.add("hidden");
            deleteAccount();
        });
        document.querySelector("#no").addEventListener("click", e => { document.querySelector("#popUp").classList.add("hidden"); });
    }


    async function changeUsername(e) { // change username
        if (e.key === "Enter") {

            let response = await fetch("../loginregister-api/settings.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: user.username,
                    new: newUsername.value,
                    password: user.password
                }),
            });

            let data = await response.json();

            if (response.status == 200) {
                let storage = JSON.parse(localStorage.getItem("user"));
                storage.username = data;
                localStorage.setItem("user", JSON.stringify(storage));
            }

            console.log(data);

        }
    }

    async function deleteAccount() { // delete
        let response = await fetch("../loginregister-api/settings.php", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: user.username,
                password: user.password
            }),
        });

        let data = await response.json();
        console.log(data);
        renderStartPage();
    }
}