async function renderRecipe(recipe) {
    let recipe_;
    let user = JSON.parse(localStorage.getItem('user'));
    console.log(recipe);
    if(recipe.idMeal.startsWith("x_")){
        console.log("pasta");
        recipe_=recipe;
        let creator=recipe_.author
        getRecipe(recipe_, creator);
    }else{
        try {
            let resourse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`);
            let data = await resourse.json();
            recipe_=data.meals[0];
            console.log(data);
            let creator="TheMealDB"
            getRecipe(recipe_, creator);
    
        } catch (e) {
            console.log(e);
        }
    }
    
    function getRecipe(recipe_, author){
        const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                if (recipe_[`strIngredient${i}`]) {
                    ingredients.push({
                        ingredient: recipe_[`strIngredient${i}`],
                        measurement: recipe_[`strMeasure${i}`]
                    });
                }
            }
            console.log(ingredients);
            main.innerHTML = `
            <div class="header">
            <button id="menu">Menu</button>
            <p>${user.username}</p>
            <div class=image></div>
            <button onclick = "renderRecepiesAfterCategory()">Go Back</button>
            </div>
            <div class="recipe">
                <h2><b>${recipe_.strMeal}</b></h2>
                <img src="${recipe_.strMealThumb}"> 
                <div class="author">
                <p>${author}</p>
                </div>
                <div class="ingredients">
                <h4>Ingredients</h4>
                <ul class="ingredientList"></ul>
                </div>
                <div class="howTo">
                    <h4>How to make ${recipe.strMeal}</h4>
                    <p>${recipe_.strInstructions}</p>
                </div>
            </div>
            
        `;
            const list = document.querySelector(".ingredientList");
            for (const ratio of ingredients) {
                list.innerHTML += `
            <li><b>${ratio.ingredient}</b> ${ratio.measurement}</li>
        `;
            }
            document.querySelector("#menu").addEventListener("click", ShowMenu);
    }
}



    // fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`)

    // .then(response => response.json())
    // .then(data => {
    //     console.log(data);
    //     const ingredients = [];
    //     for (let i = 1; i <= 20; i++) {
    //         if (data.meals[0][`strIngredient${i}`]) {
    //         ingredients.push({
    //             ingredient: data.meals[0][`strIngredient${i}`],
    //             measurement: data.meals[0][`strMeasure${i}`]
    //         });
    //         }
    //     }
    //     console.log(ingredients);
    //     main.innerHTML = `
    //     <div class="header">
    //     <button">Menu</button>
    //     <p>${username}</p>
    //     <div class=image></div>
    //     <button onclick = "renderRecepiesAfterCategory()">Go Back</button>
    //     </div>
    //     <div class="recipe">
    //         <h2><b>${recipe.strMeal}</b></h2>
    //         <img src="${recipe.strMealThumb}"> 
    //         <div class="ingredients">
    //         <h4>Ingredients</h4>
    //         <ul class="ingredientList"></ul>
    //         </div>
    //         <div class="howTo">
    //             <h4>How to make ${recipe.strMeal}</h4>
    //             <p>${data.meals[0].strInstructions}</p>
    //         </div>
    //     </div>

    // `;
    // const list = document.querySelector(".ingredientList");
    // for(const ratio of ingredients){
    //     list.innerHTML += `
    //     <li><b>${ratio.ingredient}</b> ${ratio.measurement}</li>
    // `;
    // }
    // })
    // .catch(error => console.error(error));
