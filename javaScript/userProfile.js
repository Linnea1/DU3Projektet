async function RenderUserPage() {

    if (user.guest) {
        complexPopUp("Only registered users can use this feature", "Register or login", "OK", "logout()");
    } else {
        currentState("RenderUserPage()");

        main.innerHTML = `
            <div id="sticky"></div>
            <button class="goBack">Go Back</button>
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
        goBack();
        newState("#settings", "renderSettings()");

        if (user.pfp) { // if pfp then add it
            document.querySelector(".icon").style.backgroundImage = `url(${user.pfp})`;
        }

        document.querySelector(".create_recipe").addEventListener("click", renderCreateRecipe)

        try {
            const response = await fetch(`api/createRecipe.php?author=${user.username}`);
            const data = await response.json();
            renderRecipeBoxes(data);

            document.querySelector("#own_recipe").addEventListener("click", e => { renderRecipeBoxes(data) });
        } catch (error) {
            // Handle any errors
            popUp(error);
        }

        document.querySelector(".favorites").addEventListener("click", e => {
        favoriteRecipes(e, user.username)
        e.stopPropagation();

        });
    }
}

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

                    // if (recipe.idMeal.startsWith("x_")) {
                    //     recipe_ = recipe;
                    //     let creator = recipe_.author
                    //     getRecipe(recipe_, creator);

                    // }else{

                    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe}`);
                    let data = await response.json();

                    let recipe_name = data.meals[0].strMeal;
                    let recipe_img =  data.meals[0].strMealThumb;
                    let recipe_div = document.createElement("div");
                    recipe_div.classList.add("recipe");
                    recipe_div.innerHTML = `
                        <h2>${recipe_name}</h2>
                        <img src="${recipe_img}"> 
                        </div>`;
                    recipesDiv.appendChild(recipe_div);

                    recipe_div.addEventListener("click", renderRecipe.bind(this, data.meals[0]));

                }



            } else {
                popUp("There is no favourites yet");
            }
        } catch (e) {
            popUp(e);
        }
    }
}