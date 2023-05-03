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

    main.querySelector(".red").addEventListener("click", deleteAccount);

    console.log(user);

    async function deleteAccount(e) {

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
    }
}