function renderSettings() {
    currentState("renderSettings()");

    main.innerHTML = `
        <button class="goBack">Go Back</button>
        <div id="settings">
            <form id="upload">
                <label for="pfp">Change profile picture</label>
                <input type="file" name="pfp">
                <button type="submit">Upload</button>
            </form>
            
            <form>
                <label for="email">Change email</label>
                <input type="text" placeholder="New email" name="email">
            </form>

            <form>
                <label for="username">Change username</label>
                <input type="text" placeholder="New username" name="username" autocomplete="off">
            </form>
            
            <form>
                <label for="password">Change password</label>
                <input type="password" placeholder="Old password" name="passwordold" autocomplete="off">
                <input type="password" placeholder="New password" name="passwordnew">
            </form>
            
            <p class="red">Delete account</p>
        </div>
    `;

    goBack();

    let newUsername = main.querySelector('input[name="username"]');
    let newEmail = main.querySelector('input[name="email"]');
    let newPassword = main.querySelector('input[name="passwordnew"]');
    let oldPassword = main.querySelector('input[name="passwordold"]');
    let fileForm = main.querySelector("#upload");

    main.querySelector(".red").addEventListener("click", e => {
        complexPopUp("Are you sure", "Yes", "No", "deleteAccount()");
    }); // "delete account"

    newUsername.addEventListener("keydown", changeUsername); // "change username"
    newEmail.addEventListener("keydown", changeEmail); // "change username"
    newPassword.addEventListener("keydown", changePassword); // "change username"
    oldPassword.addEventListener("keydown", changePassword);
    fileForm.addEventListener("submit", changePfp);

    async function change(body, URL, method, select) {
        try{
            let response = await fetching(URL, method, body);
            let data = await response.json();
    
            if (response.status == 200) {
                let storage = JSON.parse(localStorage.getItem("user"));
                storage[select] = data;
                localStorage.setItem("user", JSON.stringify(storage));
    
                popUp("Successfully changed!")
            }else {
                popUp(data.message);
            }
        }catch(error){
            popUp(error);
        }
    }

    async function changeUsername(e) { // change username
        if (e.key === "Enter") {
            let body = {
                username: JSON.parse(localStorage.getItem("user")).username,
                new: newUsername.value,
                password: JSON.parse(localStorage.getItem("user")).password
            };

            await change(body, "api/settings.php", "PATCH", "username");
        }
    }

    async function changeEmail(e) { // change email
        if (e.key === "Enter") {
            let body = {
                email: JSON.parse(localStorage.getItem("user")).email,
                new: newEmail.value,
                password: JSON.parse(localStorage.getItem("user")).password
            };

            await change(body, "api/settings.php", "PATCH", "email");
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

            await change(body, "api/settings.php", "PATCH", "password");
        }
    }

    async function deleteAccount() { // delete
        let body = {
            username: user.username,
            password: user.password
        };

        let response = await fetching("api/settings.php", "DELETE", body);
        let data = await response.json();

        console.log(data);
        localStorage.clear;
        renderStartPage();
    }

    async function changePfp(e) {
        e.preventDefault();

        let formData = new FormData(fileForm);
        formData.append("username", user.username);
        formData.append("password", user.password);
        if (user.pfp) {
            formData.append("old", user.pfp);
        }

        if (main.querySelector('input[name="pfp"]').value === "") {
            popUp("Please upload a file")
        } else {
            const request = new Request("api/settings.php", {
                method: "POST",
                body: formData
            });

            try{
                const response = await fetch(request);
                const data = await response.json();

                if (data.message) {
                    popUp(data.message);
                } else {
                    user.pfp = data;
                    localStorage.setItem("user", JSON.stringify(user));
                }
            }catch(error){
                popUp(error);
            }
        }
    }
}