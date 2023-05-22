//render all categories in the open API
async function renderCategoriesPage() {
    user = JSON.parse(localStorage.getItem("user"));
    currentState("renderCategoriesPage()");

    main.innerHTML = `
      <div id="sticky"></div>
      <div class="info">
        <header>
          <button id="menu" onclick="">Menu</button>
          <div class=image></div>
        </header>
        <h2>What kind of recepie are you looking for?</h2>
        <input type="text" name="search" placeholder="search for recipe">
        <p id="user">${user.username}</p>
      </div>
      <div class="categories"></div>
    `

    const divCategories = document.querySelector(".categories");
    let searchField = main.querySelector("input");
    searchField.addEventListener("keyup", searchDish);
    document.querySelector("#menu").addEventListener("click", ShowMenu);

    newState("#user", "RenderUserPage()", true);

    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
        const data = await response.json();

        for (const categoryName in data.meals) {
            const category = data.meals[categoryName];
            const categoryDiv = document.createElement("div");
            categoryDiv.classList.add("category");
            categoryDiv.addEventListener("click", renderRecipesAfterCategory);
            categoryDiv.textContent = category.strCategory;
            divCategories.append(categoryDiv);
        }
    } catch (error) {
        popUp(error);
    }
}

//Render specific recipes within a category
async function renderRecipesAfterCategory(event) {
    let category = event.target.textContent;
    currentState(`renderRecipesAfterCategory(${event})`)
    main.innerHTML = `
        <div class="header">
            <button id="menu" onclick="">Menu</button>
            <div class=image></div>
            <h2>${category}</h2>
            <p>${user.username}</p>
            <button class="goBack">Go Back</button>
        </div>
        <div class="recipes"></div>
    `;
    goBack();
    const divRecipes = document.querySelector(".recipes");
    document.querySelector("#menu").addEventListener("click", ShowMenu);
    let all_recipes = [];
    //Fetching recipes from the open API
    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        let data = await response.json();

        renderRecipeBoxes(data);
    } catch (error) {
        popUp(error);
    }
    //Fetching recipes from users
    try {
        const response = await fetch(`api/createRecipe.php?category=${category}`);
        const data = await response.json();
        renderRecipeBoxes(data);
    } catch (error) {
        popUp(error);
    }
}

//Getting recipes from search
async function searchDish(event) {
    if (event.key == "Enter") {
        let searchField = event.target.value

        document.querySelector("main").innerHTML = `
        <button onclick="renderCategoriesPage()">Go Back</button>
        <div class="recipes"></div>
        `;

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchField}`);
        let data = await response.json();

        renderRecipeBoxes(data);
    }
}

//Creating the recipes
async function renderRecipeBoxes(data) {
    const divRecipes = document.querySelector(".recipes");

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
        divRecipes.appendChild(recipeDiv);
        recipeDiv.dataset.id = recipe.idMeal;

        recipeDiv.querySelector("#first").addEventListener("click", AddRecipesAsFavourite);
        recipeDiv.querySelector("#second").addEventListener("click", AddRecipesAsFavourite);
        recipeDiv.addEventListener("click", e => {renderRecipe(data.meals[recipeName])});
    }
}