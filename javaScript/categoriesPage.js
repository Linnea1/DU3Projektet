//render all categories in the open API
async function renderCategoriesPage() {
    currentState("renderCategoriesPage()");

    basicHeader();

    main.innerHTML = `
        <div class="info">
            <h2>What kind of recepie are you looking for?</h2>
            <input type="text" name="search" placeholder="search for recipe">
        </div>
        <div class="categories"></div>
    `;

    // When the user scrolls the page, execute myFunction
    window.onscroll = function () { headerSticky() };

    // Get the header
    let header = document.querySelector("header");

    // Get the offset position of the navbar
    let sticky = header.offsetTop;

    // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
    function headerSticky() {
        if (window.pageYOffset > sticky) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    }

    const divCategories = document.querySelector(".categories");
    let searchField = main.querySelector("input");
    searchField.addEventListener("keyup", e => {
        if (e.key == "Enter") {
            newState();
        }
        searchDish(e.key, e.target.value);
    });
    document.querySelector("#menu").addEventListener("click", ShowMenu);

    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
        const data = await response.json();

        for (const categoryName in data.meals) {
            const category = data.meals[categoryName];
            const categoryDiv = document.createElement("div");
            categoryDiv.classList.add("category");
            categoryDiv.addEventListener("click", () => {
                newState();
                renderRecipesAfterCategory(category.strCategory)
            });
            categoryDiv.textContent = category.strCategory;
            divCategories.append(categoryDiv);
        }
    } catch (error) {
        popUp(error);
    }
}

//Render specific recipes within a category
async function renderRecipesAfterCategory(category) {
    // let category = event.target.textContent;
    currentState(`renderRecipesAfterCategory(${JSON.stringify(category)})`);

    basicHeader();

    main.innerHTML = `
        <div class="header">
            <h2>${category}</h2>
            <button class="goBack">Go Back</button>
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
        await renderRecipeBoxes(data);
        try {
            let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
            let data = await response.json();
            
            renderRecipeBoxes(data);
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
        currentState(`searchDish(${JSON.stringify(key)}, ${JSON.stringify(searchField)})`)

        basicHeader();

        document.querySelector("main").innerHTML = `
            <button class="goBack">Go Back</button>
            <div class="recipes"></div>
        `;
        goBack();
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchField}`);
        let data = await response.json();

        renderRecipeBoxes(data);
    }
}

//Creating the recipes
async function renderRecipeBoxes(data) {
    const divRecipes = document.querySelector(".recipes");

    let listOfIds=[];
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
        listOfRatings=data;
        console.log(listOfRatings);
    } catch (error) {
        // Handle error
    }
    
    for (const recipeName in data.meals) {
        const recipe = data.meals[recipeName];
        const recipeDiv = document.createElement("div");
        recipeDiv.dataset.id = data.id;
        
        recipeDiv.classList.add("recipe");

        recipeDiv.innerHTML = `
            <h2>${recipe.strMeal}</h2>
            <div id="liker" class="${await checkLiked(recipe.idMeal) ? 'liked' : 'false'}">
                <button id="first"></button>
                <button id="second"></button>
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

        divRecipes.append(recipeDiv);
        recipeDiv.dataset.id = recipe.idMeal;

        recipeDiv.querySelector("#first").addEventListener("click", AddRecipesAsFavourite);
        recipeDiv.querySelector("#second").addEventListener("click", AddRecipesAsFavourite);
        recipeDiv.addEventListener("click", e => {
            newState();
            renderRecipe(data.meals[recipeName])
        });

        const ratingContainer = recipeDiv.querySelector('#rating-container');

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


async function usersFavoriteRecipes(data) {
    const divRecipes = document.querySelector(".recipes");

    divRecipes.innerHTML = "";


    for (const recipeName in data.meals) {
        const recipe = data.meals[recipeName];
        const recipeDiv = document.createElement("div");
        recipeDiv.dataset.id = data.id;
        recipeDiv.classList.add("recipe");

        recipeDiv.innerHTML = `
            <h2>${recipe.strMeal}</h2>
            <div id="liker" class="${await checkLiked(recipe.idMeal) ? 'liked' : 'false'}">
                <button id="first"></button>
                <button id="second"></button>
            <div>
                <img src="${recipe.strMealThumb}"> 
            </div>
        `;

        divRecipes.append(recipeDiv);
        recipeDiv.dataset.id = recipe.idMeal;

        recipeDiv.querySelector("#first").addEventListener("click", AddRecipesAsFavourite);
        recipeDiv.querySelector("#second").addEventListener("click", AddRecipesAsFavourite);
        recipeDiv.addEventListener("click", e => {
            renderRecipe(data.meals[recipeName])
        });
    }



}