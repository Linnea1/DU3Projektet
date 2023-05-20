
async function AddRecipesAsFavourite(recipe) {


    let parent = recipe.parentElement
    console.log(parent.innerText);
    let nameOfDish = parent.innerText;
    let idOfMeal = parent.dataset.id;
    console.log(idOfMeal);

    try {
        let response = await fetch("../loginregister-api/add_and_remove_favourite.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: user.username,
                idMeal: idOfMeal
            }),
        })
        let data = await response.json();
        console.log(data);


    } catch (error) {
        console.log(error);
    }


}

async function RemoveFavourite(recipe) {
    console.log("hej");
    let parent = recipe.parentElement
    console.log(parent.innerText);
    let idOfMeal = parent.dataset.id;
    // let user = JSON.parse(localStorage.getItem('user'));
    console.log(user.username);

    try {
        let response = await fetch("../loginregister-api/add_and_remove_favourite.php", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: user.username,
                idMeal: idOfMeal
            }),
        })
        let data = await response.json();
        console.log(data);


    } catch (error) {
        console.log(error);
    }
}

async function like_recipe(event, recipe) {
    event.stopPropagation();
    // let parent = recipe.parentElement
    // console.log(parent);

    if (user.guest) {

        let PopupMenu = document.querySelector("#popUp");
        PopupMenu.classList.remove("hidden");
        let PopUpWindow = document.querySelector("#popUpWindow");

        let info = document.createElement("div");
        let OkButton = document.createElement("button");
        let registerButton = document.createElement("button");



        PopUpWindow.append(info);
        PopUpWindow.append(OkButton);
        PopUpWindow.append(registerButton);


        info.textContent = "Only registered users can use this feature";
        OkButton.textContent = "Ok";
        registerButton.textContent = "Register or login";

        OkButton.addEventListener("click", e => {
            Disguise(e)
        });

        registerButton.addEventListener("click", e => {
            logout();
            Disguise(e)
        });
    } else {

        const liker_dom = event.target.parentElement;
        console.log(liker_dom);
        liker_dom.classList.toggle("liked");


        let parent = liker_dom.parentElement
        console.log(parent.innerText);
        let idOfMeal = parent.dataset.id;
        console.log(idOfMeal);
        // let user = JSON.parse(localStorage.getItem('user'));
        console.log(user.username);

        if (liker_dom.classList.contains("liked")) {

            // let parent = event.target.parentElement

            // let idOfMeal = parent.dataset.id;

            try {
                console.log(user.username, idOfMeal);

                let body = {
                    username: user.username,
                    idMeal: idOfMeal,
                }

                let response = await fetching("loginregister-api/add_and_remove_favourite.php", "POST", body)
                let data = await response.json();
                console.log(data);


            } catch (error) {
                console.log(error);
            }

        } else {
            RemoveFavourite(liker_dom)
            console.log("Ej favorit");
        }
    }
}


async function checkClass(recipe) {

    // let user = JSON.parse(localStorage.getItem('user'));

    let response = await fetch(`/loginregister-api/add_and_remove_favourite.php?idMeal=${recipe}&user=${user.username}`);
    let resourse = await response.json();

    return resourse

}



async function renderCategoriesPage() {
    user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
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
    searchField.addEventListener("keyup", searhDish);
    document.querySelector("#menu").addEventListener("click", ShowMenu);

    newState("#user", "RenderUserPage()", true);

    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
        const data = await response.json();

        for (const categoryName in data.meals) {
            const category = data.meals[categoryName];
            const categoryDiv = document.createElement("div");
            categoryDiv.classList.add("category");
            categoryDiv.addEventListener("click", renderRecepiesAfterCategory);
            categoryDiv.textContent = category.strCategory;
            divCategories.appendChild(categoryDiv);
        }
    } catch (error) {
        console.error(error);
    }
}

function setCategory(event) {
    category = event.target.innerHTML;
    renderRecepiesAfterCategory();
}

async function renderRecepiesAfterCategory(event) {
    // let user = JSON.parse(localStorage.getItem('user'));


    let category = event.target.innerHTML;
    main.innerHTML = `
        <div class="header">
        <button id="menu" onclick="">Menu</button>
        <div class=image></div>
        <h2>${category}</h2>
        <p>${user.username}</p>
        <button onclick="renderCategoriesPage()">Go Back</button>
        </div>
        <div class="recipes"></div>
    `;
    const divRecipes = document.querySelector(".recipes");
    document.querySelector("#menu").addEventListener("click", ShowMenu);
    let all_recipes = [];
    try {
        let resourse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        let data = await resourse.json();

        renderRecipesFunction(data);
    } catch (error) {
        console.log(error);
    }
    try {
        const response = await fetch(`/loginregister-api/createRecipe.php?category=${category}`);
        const data = await response.json();
        // Process the retrieved data


        renderRecipesFunction(data);
    } catch (error) {
        // Handle any errors
        console.error(error);
    }

}

async function searhDish(event) {

    if (event.key == "Enter") {
        let searchField = event.target.value
        console.log(searchField);

        document.querySelector("main").innerHTML = `
        <button onclick="renderCategoriesPage()">Go Back</button>
        <div class="recipes"></div>
        `;
        let divForAllaRecipes = document.querySelector(".recipes");

        let resourse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?=${searchField}`);
        let response = await resourse.json();

        for (const recipeName in response.meals) {
            let recipe_name = response.meals[recipeName].strMeal;
            let recipe_img = response.meals[recipeName].strMealThumb;
            let recipe_id = response.meals[recipeName].idMeal;
            console.log(recipe_id);
            let recipe_div = document.createElement("div");
            recipe_div.classList.add("recipe");
            recipe_div.innerHTML = `
            <h2>${recipe_name}</h2>
            <div id="liker" class="${checkClass(recipe_name)}">
                <button id="first"></button>
                <button id="second"></button>
            <div>
            <img src="${recipe_img}"> 
            </div>`;
            divForAllaRecipes.appendChild(recipe_div);

            recipe_div.querySelector("#first").addEventListener("click", e => {
                like_recipe()
            });
            recipe_div.querySelector("#second").addEventListener("click", e => {
                like_recipe()
            });
            recipe_div.addEventListener("click", renderRecipe.bind(this, response.meals[recipeName]))


        }

    }
}
function callForRecipe(recipe, event) {
    console.log(event);
    renderRecipe(recipe);
}

async function renderRecipesFunction(data) {


    let recipesDiv = document.querySelector(".recipes");
    recipesDiv.innerHTML = "";

    const divRecipes = document.querySelector(".recipes");
    for (const recipeName in data.meals) {
        const recipe = data.meals[recipeName];
        const recipeDiv = document.createElement("div");
        recipeDiv.dataset.id = data.id;
        recipeDiv.classList.add("recipe");
        recipeDiv.innerHTML = `
        <h2>${recipe.strMeal}</h2>
        <div id="liker" class="${await checkClass(recipe.idMeal) ? 'liked' : 'false'}">
            <button id="first"></button>
            <button id="second"></button>
        <div>
            <img src="${recipe.strMealThumb}"> 
        </div>
    `;
        divRecipes.appendChild(recipeDiv);
        recipeDiv.dataset.id = recipe.idMeal;

        recipeDiv.querySelector("#first").addEventListener("click", e => {
            like_recipe(e, recipeDiv)
        });
        recipeDiv.querySelector("#second").addEventListener("click", e => {
            like_recipe(e, recipeDiv)
        });
        recipeDiv.addEventListener("click", renderRecipe.bind(this, data.meals[recipeName]));
    }
}



