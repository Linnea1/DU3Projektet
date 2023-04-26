function renderCategoriesPage() {
    let username;
    if (!window.localStorage.getItem("user")) {
        username = "Guest";
    } else {
        username = localStorage.getItem("user");
    }

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

    fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
        .then(response => response.json())
        .then(data => {
            for (const categoryName in data.meals) {
                const category = data.meals[categoryName];
                const categoryDiv = document.createElement("div");
                categoryDiv.classList.add("category");
                categoryDiv.addEventListener("click", renderRecepiesAfterCategory);
                categoryDiv.textContent = category.strCategory;
                divCategories.appendChild(categoryDiv);
            }
        })
        .catch(error => console.error(error));

    function renderRecepiesAfterCategory(event) {
        let category = event.target.innerHTML;
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
                         <button></button>
                         <button></button>
                    </div>
                    <div>
                        <img src="${recipe.strMealThumb}"> 
                    </div>
                `;
                    divRecipes.appendChild(recipeDiv);

                    recipeDiv.querySelector("button:first-child").addEventListener("click", like_city);
                    recipeDiv.querySelector("button:last-child").addEventListener("click", like_city);
                }


                function like_city(event) {
                    event.stopPropagation();
                    const liker_dom = event.target.parentElement;
                    liker_dom.classList.toggle("liked");
                }
            })
            .catch(error => console.error(error));

    }
}