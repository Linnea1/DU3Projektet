async function RenderUserPage(userInfo) {
    document.querySelector("#loading").classList.remove("hidden");
    user = JSON.parse(localStorage.getItem("user"));

    if (user.guest) {
        complexPopUp("Only registered users can use this feature", "Register or login", "OK", "logout()");
    } else {
        currentState(`RenderUserPage(${JSON.stringify(userInfo)})`);

        swapStyleSheet("css/profile.css");
        main.innerHTML = `
            <button class="goBack">Go Back</button>
            <button class="hidden" id="settings">Settings</button>
            <div class="userInfo">
                <div class="icon"></div>
                <h2><b>${userInfo.username}</b></h2>
            </div>
            <div class="create_recipe hidden">Create new recipe</div>
            <div class="columns">
                <div id="own_recipe" class="profileButton">Recipes</div>
                <div class="favorites" class="profileButton">Favorites</div>
            </div>
            <div class="recipes"></div>
        `;
        goBack();
        document.querySelector("#settings").addEventListener("click", e => {
            newState();
            renderSettings();
        })
        if (userInfo.pfp) { // if pfp then add it
            main.querySelector(".icon").style.backgroundImage = `url(${userInfo.pfp})`;
        } else {
            document.querySelector(".icon").removeAttribute("style");

        }


        if (userInfo.username == user.username) { // is this your own profile?
            document.querySelector(".create_recipe").classList.remove("hidden");
            document.querySelector("#settings").classList.remove("hidden");
        }

        document.querySelector(".create_recipe").addEventListener("click", e => {
            newState();
            renderCreateRecipe()
        });
        try {
            if (userInfo.username === user.username) {

                document.querySelector("header").innerHTML = `
                <div id="menu" onclick="">
                <div class="menuPart"></div>
                <div class="menuPart"></div>
                <div class="menuPart"></div>
                </div>  
                <div class="nameOfApplication"> The YumYumClub </div>
                `;
                document.querySelector("#menu").addEventListener("click", ShowMenu);

                const response = await fetch(`api/createRecipe.php?author=${user.username}`);
                const data = await response.json();
                usersFavoriteRecipes(data, true);////// kanske ta bort false som argument
                document.querySelector("#own_recipe").addEventListener("click", e => {
                    document.querySelector("#loading").classList.remove("hidden");
                    usersFavoriteRecipes(data, true)
                });////// kanske ta bort false som argument

                document.querySelector(".favorites").addEventListener("click", e => {
                    document.querySelector("#loading").classList.remove("hidden");
                    favoriteRecipes(e, user.username, true)////// kanske ta bort false som argument
                    e.stopPropagation();

                });

            } else {
                basicHeader();
                document.querySelector("#profilePicture").style.backgroundImage = `url(${user.pfp})`

                let response = await fetch(`api/createRecipe.php?author=${userInfo.username}`);
                const data = await response.json();
                usersFavoriteRecipes(data, false);   ////// kanske ta bort false som argument

                document.querySelector("#own_recipe").addEventListener("click", e => {
                    document.querySelector("#loading").classList.remove("hidden");
                    usersFavoriteRecipes(data, false)
                });///// kanske ta e som argument

                document.querySelector(".favorites").addEventListener("click", e => {
                    document.querySelector("#loading").classList.remove("hidden");
                    favoriteRecipes(e, userInfo.username, false)   ///// kanske ta bort false som argument
                    e.stopPropagation();

                });
            }

        } catch (error) {
            // Handle any errors
            popUp(error);
        }
    }
}


async function favoriteRecipes(object, user, e) { ///////// kanske ta bort e som argument

    if (e === false) { //////// kanske ta bort if-satsen
        e === true;
    };

    let divForAllRecipes = document.querySelector(".favorites");
    let recipesDiv = document.querySelector(".recipes");
    recipesDiv.innerHTML = "";

    object.stopPropagation();
    if (divForAllRecipes.childElementCount === 0) {

        try {
            let resourse = await fetch(`api/fetchRecipesAndFavourites.php?favourites=${user}`);
            let response = await resourse.json();

            if (!response.length == 0) {

                for (let recipe of response) {

                    if (recipe.startsWith("x_")) {

                        let resourse = await fetch(`api/fetchRecipesAndFavourites.php?ownRecipe=${recipe}`);
                        let response = await resourse.json();
                        console.log(response);
                        let meals = []
                        meals.push(response)
                        const data = { meals: meals }; //Making sure the format for the function call is right

                        renderRecipeBoxes(data, e); ////////////kanske ta bort e som argument

                    } else {

                        let resoursefood = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe}`);
                        let responsefood = await resoursefood.json();
                        renderRecipeBoxes(responsefood, e); ////////////kanske ta bort e som argument
                    }
                }

            } else {
                popUp("There is no favourites yet");

            }
        } catch (e) {
            console.log(e);

        }
    }
}