
function like_recipe(event) {
    event.stopPropagation();
    const liker_dom = event.target.parentElement;
    liker_dom.classList.toggle("liked");
}

function renderCategoriesPage() {

    main.innerHTML = `
        <div id="sticky"></div>
        <div class="info">
            <header>
                <button onclick="">Menu</button>
                <div class=image></div>
            </header>
            <h2>What kind of recepie are you looking for?</h2>
            <input type="text" name="search" placeholder="search for recipe">
            <p>${username}</p>
        </div>
        <div class="categories"></div>
    `;
    const divCategories = document.querySelector(".categories");
    let searchField = main.querySelector("input");
    searchField.addEventListener("keyup", searhDish);


    fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
        .then(response => response.json())
        .then(data => {
            for (const categoryName in data.meals) {
                const category = data.meals[categoryName];
                const categoryDiv = document.createElement("div");
                categoryDiv.classList.add("category");
                categoryDiv.addEventListener("click", setCategory);
                categoryDiv.textContent = category.strCategory;
                divCategories.appendChild(categoryDiv);
            }
        })
        .catch(error => console.error(error));

    
}
function setCategory(event){
    category = event.target.innerHTML;
    renderRecepiesAfterCategory();
}
function renderRecepiesAfterCategory() {
    
    main.innerHTML = `
        <div class="header">
        <button onclick="">Menu</button>
        <div class=image></div>
        <h2>${category}</h2>
        <p>${username}</p>
        <button onclick="renderCategoriesPage()">Go Back</button>
        </div>
        <div class="recipes"></div>
    `;
    const divRecipes = document.querySelector(".recipes");
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)

            .then(response => response.json())
            .then(data => {
                console.log(data);
                for (const recipeName in data.meals) {
                    const recipe = data.meals[recipeName];
                    const recipeDiv = document.createElement("div");
                    recipeDiv.classList.add("recipe");
                    console.log(recipe.strMeal);
                    recipeDiv.innerHTML = `
                    <h2>${recipe.strMeal}</h2>
                    <div class="liker">
                        <button id="first"></button>
                        <button id="second"></button>
                    <div>
                        <img src="${recipe.strMealThumb}"> 
                    </div>
                `;
                    divRecipes.appendChild(recipeDiv);

                    recipeDiv.querySelector("#first").addEventListener("click", like_recipe);
                    recipeDiv.querySelector("#second").addEventListener("click", like_recipe);
                    recipeDiv.addEventListener("click",renderRecipe.bind(this, recipe))
                }

            })
            .catch(error => console.error(error));

    }

function searhDish(event) {

    if (event.key == "Enter") {
        let searchField = event.target.value
        console.log(searchField);

        document.querySelector("main").innerHTML = `
        <button onclick="renderCategoriesPage()">Go Back</button>
        <div class="recipes"></div>
        `;
        const divRecipes = document.querySelector(".recipes");


        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchField}`)
            .then(r => r.json())
            .then(response => {


                for (const recipeName in response.meals) {
                    let recipe_name = response.meals[recipeName].strMeal;
                    let recipe_img = response.meals[recipeName].strMealThumb;
                    let recipe_div = document.createElement("div");
                    recipe_div.classList.add("recipe");
                    recipe_div.innerHTML = `
                    <h2>${recipe_name}</h2>
                    <div class="liker">
                        <button id="first"></button>
                        <button id="second"></button>
                    <div>
                    <img src="${recipe_img}"> 
                    </div>`;
                    divRecipes.appendChild(recipe_div);

                    recipe_div.querySelector("#first").addEventListener("click", like_recipe);
                    recipe_div.querySelector("#second").addEventListener("click", like_recipe);
                }
            })
    }
}

