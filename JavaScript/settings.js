function renderSettings() {
    currentState("renderSettings()");

    swapStyleSheet("css/settings.css");
    document.querySelector("header").innerHTML = `
        <div id="menu" onclick="">
            <div class="menuPart"></div>
            <div class="menuPart"></div>
            <div class="menuPart"></div>
        </div>  
        <div class="nameOfApplication"> The YumYumClub </div>
    `;
    document.querySelector("#menu").addEventListener("click", ShowMenu);

    main.innerHTML = `
        <button class="goBack"></button>
        <div id="settings">
            <div id="pfpHolder">
                <form id="uploadPfp">
                    <p>Change profile picture</p>
                    <input type="file" id="pfp" name="pfp">
                    <label for="pfp">Choose a file...</label>
                    <button type="submit">Upload</button>
                </form>
            </div>
            
            <div id="emailHolder">
                <p>Change email</p>
                <input type="text" placeholder="New email" name="email">
                <button>Upload</button>
            </div>

            <div id="usernameHolder">
                <p>Change username</p>
                <input type="text" placeholder="New username" name="username" autocomplete="off">
                <button>Upload</button>
            </div>
        
            <div id="passwordHolder">
                <p>Change password</p>
                <input type="password" placeholder="Old password" name="passwordold" autocomplete="off">
                <input type="password" placeholder="New password" name="passwordnew">
                <button>Upload</button>
            </div>
            
            <p class="red">Delete account</p>
        </div>
    `;
    goBack();

    let newUsername = main.querySelector('input[name="username"]');
    let newEmail = main.querySelector('input[name="email"]');
    let newPassword = main.querySelector('input[name="passwordnew"]');
    let oldPassword = main.querySelector('input[name="passwordold"]');

    let emailButton = main.querySelector("#emailHolder > button");
    let usernameButton = main.querySelector("#usernameHolder > button");
    let passwordButton = main.querySelector("#passwordHolder > button");

    let fileForm = main.querySelector("#uploadPfp");
    let pfpInput = main.querySelector("#pfp");
    let pfpLabel = main.querySelector("label");

    pfpInput.addEventListener("click", e => { pfpLabel.classList.add("selected") });

    main.querySelector(".red").addEventListener("click", e => {
        document.querySelector("#popUpWindow").innerHTML = `
            <p id="prompt"></p>
        `;

        document.querySelector("#popUp").classList.remove("hidden");
        document.querySelector("#prompt").textContent = "Are you sure";

        let firstButton = document.createElement("button");
        let secondButton = document.createElement("button");

        firstButton.textContent = "Yes";
        secondButton.textContent = "No";

        firstButton.classList = "firstButton";
        secondButton.classList = "secondButton";

        document.querySelector("#popUpWindow").append(firstButton);
        document.querySelector("#popUpWindow").append(secondButton);
        document.querySelector(".firstButton").addEventListener("click", e => {
            document.querySelector("#popUp").classList.add("hidden");
            deleteAccount();
        });
        document.querySelector(".secondButton").addEventListener("click", e => { document.querySelector("#popUp").classList.add("hidden") });
        document.querySelector("#popUpBackground").addEventListener("click", e => { document.querySelector("#popUp").classList.add("hidden") });

        // complexPopUp("Are you sure", "Yes", "No", "deleteAccount()");
    }); // "delete account"

    usernameButton.addEventListener("click", changeUsername); // "change username"
    emailButton.addEventListener("click", changeEmail); // "change username"
    passwordButton.addEventListener("click", changePassword); // "change password"
    fileForm.addEventListener("submit", changePfp); // change pfp

    async function change(body, URL, method, select, newValue) {
        try {
            let response = await fetching(URL, method, body);
            let data = await response.json();

            if (response.status == 200) {
                let storage = JSON.parse(localStorage.getItem("user"));
                storage[select] = newValue;
                localStorage.setItem("user", JSON.stringify(storage));

                popUp(data.message);

                document.querySelector("#popUpBackground").addEventListener("click", backToProfile);
                document.querySelector(".OK").addEventListener("click", backToProfile);
            } else {
                popUp(data.message);
            }
        } catch (error) {
            popUp(error);
        }
    }

    function backToProfile() {
        state.old_states.pop();
        user = JSON.parse(localStorage.getItem("user"));
        RenderUserPage(user);

        document.querySelector("#popUpBackground").removeEventListener("click", backToProfile);
        document.querySelector(".OK").removeEventListener("click", backToProfile);
    }

    async function changeUsername(e) { // change username
        if (newUsername.value === "") {
            popUp("Please do not leave an empty field");
        } else {
            let body = {
                username: JSON.parse(localStorage.getItem("user")).username,
                new_username: newUsername.value,
                password: JSON.parse(localStorage.getItem("user")).password
            };

            await change(body, "api/settings.php", "PATCH", "username", newUsername.value);
        }
    }

    async function changeEmail(e) { // change email
        if (newEmail.value === "") {
            popUp("Please do not leave an empty field");
        } else {
            let body = {
                email: JSON.parse(localStorage.getItem("user")).email,
                new_email: newEmail.value,
                password: JSON.parse(localStorage.getItem("user")).password
            };

            await change(body, "api/settings.php", "PATCH", "email", newEmail.value);
        }
    }

    async function changePassword(e) { // change password
        if (newPassword.value === "" || oldPassword.value === "") {
            popUp("Please do not leave any empty fields");
        } else {
            let body = {
                password: oldPassword.value,
                new_password: newPassword.value,
                username: JSON.parse(localStorage.getItem("user")).username
            };

            await change(body, "api/settings.php", "PATCH", "password", newPassword.value);
        }
    }

    async function deleteAccount() { // delete
        let body = {
            username: user.username,
            password: user.password
        };

        try {
            let response = await fetching("api/settings.php", "DELETE", body);
            if (response.ok) {
                logout();
            } else {
                let data = await response.json();
                popUp(data.message);
            }
        } catch (error) {
            popUp(error);
        }
    }

    async function changePfp(e) {
        e.preventDefault();

        let formData = new FormData(fileForm);
        formData.append("username", user.username);
        formData.append("password", user.password);
        if (user.pfp) {
            formData.append("old", user.pfp);
        }
        console.log(formData);
        if (main.querySelector('input[name="pfp"]').value === "") {
            popUp("Please upload a file");
            pfpLabel.classList.remove("selected");
        } else {
            const request = new Request("api/settings.php", {
                method: "POST",
                body: formData
            });

            try {
                const response = await fetch(request);
                const data = await response.json();

                if (data.message) {
                    popUp(data.message);
                    pfpLabel.classList.remove("selected");
                } else {
                    user.pfp = data;
                    localStorage.setItem("user", JSON.stringify(user));

                    popUp("Successfully changed!");
                    pfpLabel.classList.remove("selected");

                    document.querySelector("#popUpBackground").addEventListener("click", backToProfile);
                    document.querySelector(".OK").addEventListener("click", backToProfile);
                }
            } catch (error) {
                popUp(error);
            }
        }
    }
}