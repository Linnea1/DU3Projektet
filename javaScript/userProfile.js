async function RenderUserPage(userInfo) {
    console.log(userInfo);
    if (user.guest) {
        complexPopUp("Only registered users can use this feature", "Register or login", "OK", "logout()");
    } else {
        currentState(`RenderUserPage(${JSON.stringify(userInfo)})`);

        document.querySelector("header").innerHTML = `
            <div id="menu" onclick="">
                <div class="menuPart"></div>
                <div class="menuPart"></div>
                <div class="menuPart"></div>
            </div>  
            <div class="nameOfApplication"> The YumYumClub </div>
            `;


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
        newState("#settings", "renderSettings()");

        document.querySelector("#menu").addEventListener("click", ShowMenu);


        if (userInfo.pfp) { // if pfp then add it
            document.querySelector(".icon").style.backgroundImage = `url(${userInfo.pfp})`;
        }

        if (userInfo.username == user.username) {
            document.querySelector(".create_recipe").classList.remove("hidden");
            document.querySelector("#settings").classList.remove("hidden");
        }

        document.querySelector(".create_recipe").addEventListener("click", renderCreateRecipe);

        try {
            if (userInfo === user.username) {

                const response = await fetch(`api/createRecipe.php?author=${user.username}`);
                const data = await response.json();
                usersFavoriteRecipes(data);
                document.querySelector("#own_recipe").addEventListener("click", e => { usersFavoriteRecipes(data) });

                document.querySelector(".favorites").addEventListener("click", e => {
                    favoriteRecipes(e, user.username)
                    e.stopPropagation();

                });

            } else {
                let response = await fetch(`api/createRecipe.php?author=${userInfo.username}`);
                const data = await response.json();
                usersFavoriteRecipes(data);

                document.querySelector("#own_recipe").addEventListener("click", e => { usersFavoriteRecipes(data) });

                document.querySelector(".favorites").addEventListener("click", e => {
                    favoriteRecipes(e, userInfo.username)
                    e.stopPropagation();

                });
            }

        } catch (error) {
            // Handle any errors
            popUp(error);
        }

        // document.querySelector(".favorites").addEventListener("click", e => {
        //     favoriteRecipes(e, user.username)
        //     e.stopPropagation();

        // });
    }
}

// async function favoriteRecipes(object, user) {
//     let divForAllRecipes = document.querySelector(".favorites");
//     let recipesDiv = document.querySelector(".recipes");
//     recipesDiv.innerHTML = "";

//     object.stopPropagation();
//     if (divForAllRecipes.childElementCount === 0) {

//         try {
//             let resourse = await fetch(`api/add_and_remove_favourite.php?favourites=${user}`);
//             let response = await resourse.json();

//             if (!response.length == 0) {

//                 for (let recipe of response) {

//                     // if (recipe.idMeal.startsWith("x_")) {
//                     //     recipe_ = recipe;
//                     //     let creator = recipe_.author
//                     //     getRecipe(recipe_, creator);

//                     // }else{

//                     let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe}`);
//                     let data = await response.json();

//                     let recipe_name = data.meals[0].strMeal;
//                     let recipe_img =  data.meals[0].strMealThumb;
//                     let recipe_div = document.createElement("div");
//                     recipe_div.classList.add("recipe");
//                     recipe_div.innerHTML = `
//                         <h2>${recipe_name}</h2>
//                         <img src="${recipe_img}"> 
//                         </div>`;
//                     recipesDiv.appendChild(recipe_div);

//                     recipe_div.addEventListener("click", renderRecipe.bind(this, data.meals[0]));

//                 }



//             } else {
//                 popUp("There is no favourites yet");
//             }
//         } catch (e) {
//             popUp(e);
//         }
//     }
// }

async function favoriteRecipes(object, user) {

    let divForAllRecipes = document.querySelector(".favorites");
    let recipesDiv = document.querySelector(".recipes");
    recipesDiv.innerHTML = "";

    object.stopPropagation();
    if (divForAllRecipes.childElementCount === 0) {

        try {
            let resourse = await fetch(`api/add_and_remove_favourite.php?favourites=${user}`);
            let response = await resourse.json();

            if (!response.length == 0) {

                for (let recipe of response) {

                    if (recipe.startsWith("x_")) {

                        let resourse = await fetch(`api/add_and_remove_favourite.php?ownRecipe=${recipe}`);
                        let response = await resourse.json();

                        let recipe_name = response.strMeal;
                        let recipe_img = response.strMealThumb;
                        let recipe_div = document.createElement("div");
                        recipe_div.classList.add("recipe");
                        recipe_div.innerHTML = `
                        <h2>${recipe_name}</h2>
                        <img src="${recipe_img}"> 
                        </div>
                        `;
                        recipesDiv.appendChild(recipe_div);

                        recipe_div.addEventListener("click", e => { renderRecipe(response) });

                    } else {

                        let resoursefood = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe}`);
                        let responsefood = await resoursefood.json();

                        let recipe_name = responsefood.meals[0].strMeal;
                        let recipe_img = responsefood.meals[0].strMealThumb;
                        let recipe_div = document.createElement("div");
                        recipe_div.classList.add("recipe");
                        recipe_div.innerHTML = `
                        <h2>${recipe_name}</h2>
                        <img src="${recipe_img}"> 
                        </div>`;
                        recipesDiv.appendChild(recipe_div);

                        recipe_div.addEventListener("click", e => { renderRecipe(responsefood.meals[0]) });
                    }
                }



            } else {

                popUp("There is no favourites yet");

                // console.log(response);

                // let PopupMenu = document.querySelector("#popUp");
                // PopupMenu.classList.remove("hidden");
                // let PopUpWindow = document.querySelector("#popUpWindow");

                // let info = document.createElement("div");
                // let OkButton = document.createElement("button");

                // PopUpWindow.append(info);
                // PopUpWindow.append(OkButton);

                // info.textContent = "There is no favourites yet";
                // OkButton.textContent = "Ok";

                // OkButton.addEventListener("click", e => {
                //     Disguise(e)
                // });
            }
        } catch (e) {
            console.log(e);

        }
    }
}