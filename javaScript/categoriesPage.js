//render all categories in the open API
async function renderCategoriesPage() {
    // user = JSON.parse(localStorage.getItem("user"));
    currentState("renderCategoriesPage()");

    document.querySelector("header").innerHTML = `
    <div id="menu" onclick="">
        <div class="menuPart"></div>
        <div class="menuPart"></div>
        <div class="menuPart"></div>
    </div>  
    <div class="nameOfApplication"> The YumYumClub </div>
    <div id="profilePicture" class="icon"></div>
    `;

    main.innerHTML = `
        <div class="info">
            <h2>What kind of recepie are you looking for?</h2>
            <input type="text" name="search" placeholder="search for recipe">
        </div>
        <div class="categories"></div>
    `;

    document.querySelector(".icon").style.backgroundImage = `url(${user.pfp})`
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
    searchField.addEventListener("keyup", searchDish);
    document.querySelector("#menu").addEventListener("click", ShowMenu);

    newState("#profilePicture", `RenderUserPage(${localStorage.user})`, true);

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
    currentState(`renderRecipesAfterCategory(${event})`);
    main.innerHTML = `
        <div class="header">
            <h2>${category}</h2>
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

        divRecipes.prepend(recipeDiv);
        recipeDiv.dataset.id = recipe.idMeal;

        recipeDiv.querySelector("#first").addEventListener("click", AddRecipesAsFavourite);
        recipeDiv.querySelector("#second").addEventListener("click", AddRecipesAsFavourite);
        recipeDiv.addEventListener("click", e => { renderRecipe(data.meals[recipeName]) });

        // newState(recipeDiv, `renderRecipe(${JSON.stringify(data.meals[recipeName])})`);
    }

    // let testing = document.querySelectorAll(".recipe");
    // for (const test of testing) {
    //     newState(test, `renderRecipe(${data.meals[recipeName]})`)
    // }
}