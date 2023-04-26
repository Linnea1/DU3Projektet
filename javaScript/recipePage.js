function renderRecipe(recipe, event) {
    console.log(recipe);
    console.log(event);
    
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`)

    .then(response => response.json())
    .then(data => {
        console.log(data);
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (data.meals[0][`strIngredient${i}`]) {
            ingredients.push({
                ingredient: data.meals[0][`strIngredient${i}`],
                measurement: data.meals[0][`strMeasure${i}`]
            });
            }
        }
        console.log(ingredients);
        main.innerHTML = `
        <div class="header">
        <button">Menu</button>
        <p>${username}</p>
        <div class=image></div>
        <button onclick = "renderRecepiesAfterCategory()">Go Back</button>
        </div>
        <div class="recipe">
            <h2><b>${recipe.strMeal}</b></h2>
            <img src="${recipe.strMealThumb}"> 
            <div class="ingredients">
            <h4>Ingredients</h4>
            <ul class="ingredientList"></ul>
            </div>
            <div class="howTo">
                <h4>How to make ${recipe.strMeal}</h4>
                <p>${data.meals[0].strInstructions}</p>
            </div>
        </div>
        
    `;
    const list = document.querySelector(".ingredientList");
    for(const ratio of ingredients){
        list.innerHTML += `
        <li><b>${ratio.ingredient}</b> ${ratio.measurement}</li>
    `;
    }
    })
    .catch(error => console.error(error));
    
  

}