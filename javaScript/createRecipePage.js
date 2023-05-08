function renderCreateRecipe(event) {
    main.innerHTML = `
      <form>
        <label for="picture">Picture:</label>
        <input type="file" id="picture" name="picture"><br>
  
        <label for="strMeal">Meal Name:</label>
        <input type="text" id="strMeal" name="strMeal"><br><br>
  
        <label for="strCategory">Meal Category:</label>
        <select id="strCategory" name="strCategory" multiple>
            <option value="Beef">Beef</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Chicken">Chicken</option>
            <option value="Dessert">Dessert</option>
            <option value="Goat">Goat</option>
            <option value="Lamb">Lamb</option>
            <option value="Miscellaneous">Miscellaneous</option>
            <option value="Pasta">Pasta</option>
            <option value="Pork">Pork</option>
            <option value="Seafood">Seafood</option>
            <option value="Side">Side</option>
            <option value="Starter">Starter</option>
            <option value="Vegan">Vegan</option>
            <option value="Vegetarian">Vegetarian</option>
        </select>
  
        <div id="ingredients">
          <div class="ingredientGroup">
            <div class="ingredientDiv1">
                <label for="strIngredient1">Ingredient 1:</label>
                <input type="text" id="strIngredient1" name="strIngredient1">
            </div>
            <div class="ingredientDiv2">
                <label for="strMeasure1">Measurement 1:</label>
                <input type="text" id="strMeasure1" name="strMeasure1"><br><br>
            </div>
          </div>
          <div class="ingredientGroup">
            <div class="ingredientDiv1">
                <label for="strIngredient2">Ingredient 2:</label>
                <input type="text" id="strIngredient2" name="strIngredient2">
            </div>
            <div class="ingredientDiv2">
                <label for="strMeasure2">Measurement 2:</label>
                <input type="text" id="strMeasure2" name="strMeasure2"><br><br>
            </div>  
          </div>
          <div class="ingredientGroup">
                <div class="ingredientDiv1">
                    <label for="strIngredient3">Ingredient 3:</label>
                    <input type="text" id="strIngredient3" name="strIngredient3">
                </div>
                <div class="ingredientDiv1">
                    <label for="strMeasure3">Measurement 3:</label>
                    <input type="text" id="strMeasure3" name="strMeasure3"><br><br>
                </div>
          </div>
        </div>

        <button type="button" onclick="addIngredientGroup()">Add more ingredients</button>
  
        <label for="strInstructions">Instructions:</label>
        <textarea id="strInstructions" name="strInstructions"></textarea><br><br>
  
        <input type="submit" value="Submit">
      </form>
    `;
    let RegisterButton = main.querySelector("form");
    RegisterButton.addEventListener("submit", submitRecipe);
}
  
let ingredientGroupCounter = 3;
  
function addIngredientGroup() {
    const ingredients = document.getElementById("ingredients");
  
    const ingredientGroup = document.createElement("div");
    ingredientGroup.classList.add("ingredientGroup");
    const ingredientDiv1 = document.createElement("div");
    const ingredientDiv2 = document.createElement("div");
  
    const ingredientLabel = document.createElement("label");
    ingredientLabel.setAttribute("for", `strIngredient${ingredientGroupCounter + 1}`);
    ingredientLabel.textContent = `Ingredient ${ingredientGroupCounter + 1}:`;
    ingredientDiv1.appendChild(ingredientLabel);
  
    const ingredientInput = document.createElement("input");
    ingredientInput.setAttribute("type", "text");
    ingredientInput.setAttribute("id", `strIngredient${ingredientGroupCounter + 1}`);
    ingredientInput.setAttribute("name", `strIngredient${ingredientGroupCounter + 1}`);
    ingredientDiv1.appendChild(ingredientInput);
  
    const measureLabel = document.createElement("label");
    measureLabel.setAttribute("for", `strMeasure${ingredientGroupCounter + 1}`);
    measureLabel.textContent = `Measurement ${ingredientGroupCounter + 1}:`;
    ingredientDiv2.appendChild(measureLabel);
  
    const measureInput = document.createElement("input");
    measureInput.setAttribute("type", "text");
    measureInput.setAttribute("id", `strMeasure${ingredientGroupCounter + 1}`);
    measureInput.setAttribute("name", `strMeasure${ingredientGroupCounter + 1}`);
    ingredientDiv2.appendChild(measureInput);
  
    ingredients.appendChild(ingredientGroup);
    ingredientGroup.appendChild(ingredientDiv1);
    ingredientGroup.appendChild(ingredientDiv2);

  
    ingredientGroupCounter++;
}

async function submitRecipe(event){
    event.preventDefault();
    
    const recipeImage = main.querySelector("#picture").value;
    const mealName = main.querySelector("#strMeal").value;
    const mealCategory = main.querySelector("#strCategory").value;
    const instructions = main.querySelector("#strInstructions").value;
    
    const ingredients = [];
    const measurements = [];
    
    for (let i = 1; i <= ingredientGroupCounter; i++) {
      const ingredient = main.querySelector(`#strIngredient${i}`).value.trim();
      const measurement = main.querySelector(`#strMeasure${i}`).value.trim();
      
      if (ingredient !== "" && measurement !== "") {
        ingredients.push(ingredient);
        measurements.push(measurement);
      }
    }
    let author=user.username;
    const recipeData = {
      author,
      mealName,
      mealCategory,
      instructions,
      ingredients,
      measurements,
      recipeImage
    };

    console.log(recipeData)
    
    try {
        let response = await fetch("../loginregister-api/createRecipe.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recipeData),
        });
        let data = await response.json();

        //if the response is ok and the user is added
        if (response.ok) {
            message.innerHTML = `The user ${data.username} was successfully added!`;
            //if it's not ok
        } else {
            message.innerHTML = `<span>${data.message}</span>.`;
        }
        //if something went wrong, we print out the error message we got from the database
    } catch (error) {
        message.textContent = `${error.message}`;
    }
  }
  
  