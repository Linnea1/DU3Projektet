async function RenderUserPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    currentState("RenderUserPage()");

    main.innerHTML = `
    <div id="sticky"></div>
    <button class="goback">Go Back</button>
    <button id="settings">Settings</button>
    <div class="userInfo">
        <div class="icon"></div>
        <h2><b>${user.username}</b></h2>
    </div>
    <div class="create_recipe">Create new recipe</div>
    <div class="columns">
        <div id="own_recipe" class="profileButton">Recipes</div>
        <div class="favorites" class="profileButton">Favorites</div>
    </div>
    <div class="recipes"></div>
    
`;
    goback();
    newState("#settings", "renderSettings()");

    if (user.pfp) { // if pfp then add it
        document.querySelector(".icon").style.backgroundImage = `url(${user.pfp})`;
    }

    document.querySelector(".create_recipe").addEventListener("click", renderCreateRecipe)
    document.querySelector(".favorites").addEventListener("click", favoriteRecipes(user.username));

    try {
        const response = await fetch(`/loginregister-api/createRecipe.php?author=${user.username}`);
        const data = await response.json();
        // Process the retrieved data
        console.log(data);
        renderRecipesFunction(data);
        //if-sats om du är inloggad eller ej 

        document.querySelector("#own_recipe").addEventListener("click", e => { renderRecipesFunction(data) });

    } catch (error) {
        // Handle any errors
        console.error(error);
    }
    goback();

    // newState("#settings", renderSettings());
    document.querySelector("#settings").addEventListener("click", e => {
        state.old_states.push(state.current_state);
        renderSettings();
    })

    document.querySelector(".favorites").addEventListener("click", e => {
        favoriteRecipes(e, user.username)
        e.stopPropagation();

    });
    document.querySelector(".create_recipe").addEventListener("click", renderCreateRecipe)
}

function renderSettings() {
    const user = JSON.parse(localStorage.getItem("user"));
    currentState("renderSettings()");

    main.innerHTML = `
    <button class="goback">Go Back</button>
    <div id="settings">
        <form id="upload">
            <label for="pfp">Change profile picture</label>
            <input type="file" name="pfp">
            <button type="submit">Upload</button>
        </form>
        
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

    goback();

    let newUsername = main.querySelector('input[name="username"]');
    let newEmail = main.querySelector('input[name="email"]');
    let newPassword = main.querySelector('input[name="passwordnew"]');
    let oldPassword = main.querySelector('input[name="passwordold"]');
    let fileForm = main.querySelector("#upload");

    main.querySelector(".red").addEventListener("click", e => {
        popUp("Are you sure", true)
        document.querySelector(".yes").addEventListener("click", e => {
            document.querySelector("#popUp").classList.add("hidden");
            deleteAccount();
        });
    }); // "delete account"
    newUsername.addEventListener("keydown", changeUsername); // "change username"
    newEmail.addEventListener("keydown", changeEmail); // "change username"
    newPassword.addEventListener("keydown", changePassword); // "change username"
    oldPassword.addEventListener("keydown", changePassword);
    fileForm.addEventListener("submit", changePfp);

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

            await change(body, "../loginregister-api/settings.php", "PATCH", "username");
        }
    }

    async function changeEmail(e) { // change email
        if (e.key === "Enter") {
            let body = {
                email: JSON.parse(localStorage.getItem("user")).email,
                new: newEmail.value,
                password: JSON.parse(localStorage.getItem("user")).password
            };

            await change(body, "../loginregister-api/settings.php", "PATCH", "email");
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

            await change(body, "../loginregister-api/settings.php", "PATCH", "password");
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
            const request = new Request("/loginregister-api/settings.php", {
                method: "POST",
                body: formData
            })
            fetch(request)
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        popUp(data.message);
                    } else {
                        user.pfp = data;
                        localStorage.setItem("user", JSON.stringify(user));
                    }

                    console.log(data);
                });

            // let response = await fetching("/loginregister-api/settings.php", "POST", formData);
            // let data = await response.json();

            // console.log(data);

            // let div = document.createElement("div");
            // div.classList.add("test");
            // div.style.backgroundImage = main.querySelector('input[name="pfp"]').value;
            // main.append(div);
        }
    }
}




async function favoriteRecipes(object, user) {

    //if-sats om du är inloggad eller ej

    let divForAllRecipes = document.querySelector(".favorites");
    let recipesDiv = document.querySelector(".recipes");
    recipesDiv.innerHTML = "";

    object.stopPropagation();
    if (divForAllRecipes.childElementCount === 0) {

        try {
            let resourse = await fetch(`/loginregister-api/add_and_remove_favourite.php?favourites=${user}`);
            let response = await resourse.json();

            if (!response.length == 0) {

                for (let recipe of response) {

                    let resoursefood = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipe}`);
                    let responsefood = await resoursefood.json();

                    console.log(responsefood);

                    let recipe_name = await responsefood.meals[0].strMeal;
                    let recipe_img = responsefood.meals[0].strMealThumb;
                    let recipe_div = document.createElement("div");
                    recipe_div.classList.add("recipe");
                    recipe_div.innerHTML = `
                        <h2>${recipe_name}</h2>
                        <img src="${recipe_img}"> 
                        </div>`;
                    recipesDiv.appendChild(recipe_div);

                    recipe_div.addEventListener("click", renderRecipe.bind(this, responsefood.meals[0]))

                }



            } else {

                console.log(response);

                let PopupMenu = document.querySelector("#popUp");
                PopupMenu.classList.remove("hidden");
                let PopUpWindow = document.querySelector("#popUpWindow");

                let info = document.createElement("div");
                let OkButton = document.createElement("button");

                PopUpWindow.append(info);
                PopUpWindow.append(OkButton);

                info.textContent = "There is no favourites yet";
                OkButton.textContent = "Ok";

                OkButton.addEventListener("click", e => {
                    Disguise(e)
                });
            }
        } catch (e) {
            console.log(e);

        }
    }
}