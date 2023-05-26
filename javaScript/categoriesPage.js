//render all categories in the open API
async function renderCategoriesPage() {
    document.querySelector("#loading").classList.remove("hidden");
    user = JSON.parse(localStorage.getItem("user"));

    currentState("renderCategoriesPage()");

    swapStyleSheet("css/catergories.css");
    basicHeader();
    main.innerHTML = `
        <div class="info">
            <h2>What kind of recipe are you looking for?</h2>
            <input type="text" name="search" placeholder="search for recipe">
        </div>
        <div class="categories"></div>
    `;

    const divCategories = document.querySelector(".categories");
    let searchField = main.querySelector("input");
    searchField.addEventListener("keyup", e => {
        if (e.key == "Enter") {
            newState();
        }
        searchDish(e.key, e.target.value);
    });
    document.querySelector("#menu").addEventListener("click", ShowMenu);


    // Array of background classes
    const catagroriesBackground = ["background1", "background2", "background3", "background4"];

    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
        const data = await response.json();

        for (const categoryName in data.meals) {
            const category = data.meals[categoryName];
            const categoryDiv = document.createElement("div");
            categoryDiv.classList.add("category");

            // Assign a random background class to the category
            const randomBackground = catagroriesBackground[Math.floor(Math.random() * catagroriesBackground.length)];
            categoryDiv.classList.add(randomBackground);

            categoryDiv.addEventListener("click", () => {
                newState();
                renderRecipesAfterCategory(category.strCategory);
            });

            categoryDiv.textContent = category.strCategory;
            divCategories.append(categoryDiv);
        }
    } catch (error) {
        popUp(error);
    }

    document.querySelector("#loading").classList.add("hidden");
}
//Render specific recipes within a category

async function renderRecipesAfterCategory(category) {
    document.querySelector("#loading").classList.remove("hidden");

    // let category = event.target.textContent;
    currentState(`renderRecipesAfterCategory(${JSON.stringify(category)})`);

    swapStyleSheet("css/recipes.css");
    basicHeader();

    main.innerHTML = `
        <div class="header">
            <h2>${category}</h2>
            <button class="goBack"></button>
        </div>
        <div class="recipes"></div>
    `;
    goBack();

    const divRecipes = document.querySelector(".recipes");
    let all_recipes = [];
    //Fetching recipes from the open API

    //Fetching recipes from users
    try {
        const response = await fetch(`api/createRecipe.php?category=${category}`);
        const data = await response.json();
        await renderRecipeBoxes(data, false); ////////////kanske ta bort false som argument
        try {
            let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
            let data = await response.json();

            renderRecipeBoxes(data, false); ////////////kanske ta bort false som argument
        } catch (error) {
            popUp(error);
        }
    } catch (error) {
        popUp(error);
    }
}

//Getting recipes from search
async function searchDish(key, searchField) {
    if (key == "Enter") {
        document.querySelector("#loading").classList.remove("hidden");
        currentState(`searchDish(${JSON.stringify(key)}, ${JSON.stringify(searchField)})`)

        basicHeader();
        swapStyleSheet("css/recipes.css");
        document.querySelector("main").innerHTML = `
            <button class="goBack"></button>
            <div class="recipes"></div>
        `;

        try {

            let resourseOwnRecipe = await fetch(`api/fetchRecipesAndFavourites.php?ourOwnDatabase=${searchField}`);
            let dataOwnRecipe = await resourseOwnRecipe.json();

            if (!dataOwnRecipe.error) {

                let recipe = { meals: [dataOwnRecipe] }
                renderRecipeBoxes(recipe, false); ////////////kanske ta bort false som argument
            }

        } catch (error) {
            popUp(error);
        }
        try {
            let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchField}`);
            let data = await response.json();

            renderRecipeBoxes(data, false); ////////////kanske ta bort false som argument

            goBack();


        } catch (error) {
            popUp(error);
        }
    }
}



//Creating the recipes
async function renderRecipeBoxes(data, e) { ////////////kanske ta bort e som argument

    if (data.meals === null) {
        document.querySelector("#loading").classList.add("hidden");
        console.log("null");
        popUp("Could not find a matching recipe to your input");

    } else {
        const divRecipes = document.querySelector(".recipes");

        let listOfIds = [];
        let listOfRatings;
        for (let i = 0; i < data.meals.length; i++) {
            const meal = data.meals[i];
            listOfIds.push(meal.idMeal)
            // Perform actions with each meal object
        }
        try {
            console.log(listOfIds)
            const requestBody = {
                listOfIds,
            };
            let response = await fetching("api/ratings.php", "POST", requestBody);
            let data = await response.json();
            listOfRatings = data;
            console.log(listOfRatings);
        } catch (error) {
            // Handle error
        }
        let evenOrOdd = 0;
        for (const recipeName in data.meals) {
            const recipe = data.meals[recipeName];
            const recipeDiv = document.createElement("div");
            recipeDiv.dataset.id = recipe.idMeal;

            evenOrOdd++
            if (evenOrOdd %= 2) {
                recipeDiv.classList.add("odd");
            } else {
                recipeDiv.classList.add("even");
            }

            recipeDiv.classList.add("recipe");

            if (e === false) {   /// ta kanske bort detta, ingen if-sats

                recipeDiv.innerHTML = `
                <h2>${recipe.strMeal}</h2>
                <div id="liker" class="${await checkLiked(recipe.idMeal) ? 'liked' : 'false'}">
                <button id="first"></button>
                 <button id="second"></button>
                 <div>
                <div>
                    <img src="${recipe.strMealThumb}"> 
                </div>
                <div id="rating-container">
                    <span class="stars" id="stars1"></span>
                    <span class="stars" id="stars2"></span>
                    <span class="stars" id="stars3"></span>
                    <span class="stars" id="stars4"></span>
                    <span class="stars" id="stars5"></span>
                </div>
                `;

                recipeDiv.querySelector("#first").addEventListener("click", AddRecipesAsFavourite);
                recipeDiv.querySelector("#second").addEventListener("click", AddRecipesAsFavourite); ////// kanske ta bort om det blir dåligt

            } else {
                recipeDiv.innerHTML = `
                <h2>${recipe.strMeal}</h2>
                <div>
                    <img src="${recipe.strMealThumb}"> 
                </div>
                <div id="rating-container">
                    <span class="stars" id="stars1"></span>
                    <span class="stars" id="stars2"></span>
                    <span class="stars" id="stars3"></span>
                    <span class="stars" id="stars4"></span>
                    <span class="stars" id="stars5"></span>
                </div>
                `;
            }

            divRecipes.append(recipeDiv);
            recipeDiv.dataset.id = recipe.idMeal;


            recipeDiv.addEventListener("click", e => {
                // newState();
                renderRecipe(data.meals[recipeName])
            });
            divRecipes.append(recipeDiv);
            recipeDiv.dataset.id = recipe.idMeal;


            const filledStars = Math.round(listOfRatings[recipeName]);

            for (let i = 1; i <= 5; i++) {
                const star = recipeDiv.querySelector(`#stars${i}`);
                if (i <= filledStars) {
                    star.classList.remove('empty');
                } else {
                    star.classList.add('empty');
                }
            }
        }
    }

    document.querySelector("#loading").classList.add("hidden");
}

async function usersFavoriteRecipes(data, e) {   /// ta kanske bort e som argument

    const divRecipes = document.querySelector(".recipes");
    divRecipes.innerHTML = "";

    let listOfIds = [];
    let listOfRatings;
    for (let i = 0; i < data.meals.length; i++) {
        const meal = data.meals[i];
        listOfIds.push(meal.idMeal)
        // Perform actions with each meal object
    }
    try {
        const requestBody = {
            listOfIds,
        };
        let response = await fetching("api/ratings.php", "POST", requestBody);
        let data = await response.json();
        listOfRatings = data;

    } catch (error) {
        // Handle error
    }

    let evenOrOdd = 0;

    for (const recipeName in data.meals) {
        const recipe = data.meals[recipeName];
        const recipeDiv = document.createElement("div");
        recipeDiv.dataset.id = data.id;
        recipeDiv.classList.add("recipe");

        console.log(recipeName);
        evenOrOdd++
        console.log(evenOrOdd);
        if (evenOrOdd %= 2) {
            recipeDiv.classList.add("odd");
        } else {
            recipeDiv.classList.add("even");
        }

        if (e === false) {                             /// ta kanske bort detta, ingen if-sats

            recipeDiv.innerHTML = `
                <h2>${recipe.strMeal}</h2>
                <div id="liker" class="${await checkLiked(recipe.idMeal) ? 'liked' : 'false'}">
                <button id="first"></button>
                <button id="second"></button>
                <div>
                <div>
                    <img src="${recipe.strMealThumb}">
                </div>
                <div id="rating-container">
                    <span class="stars" id="stars1"></span>
                    <span class="stars" id="stars2"></span>
                    <span class="stars" id="stars3"></span>
                    <span class="stars" id="stars4"></span>
                    <span class="stars" id="stars5"></span>
                </div>
                `;

            recipeDiv.querySelector("#first").addEventListener("click", AddRecipesAsFavourite);
            recipeDiv.querySelector("#second").addEventListener("click", AddRecipesAsFavourite);  /// Detta kanske ska ner
        } else {   /// Hela delen i else kan behöva tas bort
            recipeDiv.innerHTML = `
            <h2>${recipe.strMeal}</h2>
            <div>
                <img src="${recipe.strMealThumb}"> 
            </div>
            <div id="rating-container">
                <span class="stars" id="stars1"></span>
                <span class="stars" id="stars2"></span>
                <span class="stars" id="stars3"></span>
                <span class="stars" id="stars4"></span>
                <span class="stars" id="stars5"></span>
            </div>
            `;
        }


        divRecipes.append(recipeDiv);
        recipeDiv.dataset.id = recipe.idMeal;


        recipeDiv.addEventListener("click", e => {
            renderRecipe(data.meals[recipeName])
        });

        const filledStars = Math.round(listOfRatings[recipeName]);

        for (let i = 1; i <= 5; i++) {
            const star = recipeDiv.querySelector(`#stars${i}`);
            if (i <= filledStars) {
                star.classList.remove('empty');
            } else {
                star.classList.add('empty');
            }
        }
    }
    document.querySelector("#loading").classList.add("hidden");
}