async function renderRecipe(recipe) {
    console.log(recipe);
    let recipe_;
    let user = JSON.parse(localStorage.getItem('user'));
    let usersname = user.username;
    console.log(recipe);
    if (recipe.idMeal.startsWith("x_")) {
        recipe_ = recipe;
        let creator = recipe_.author
        getRecipe(recipe_, creator);
    } else {
        try {
            let resourse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`);
            let data = await resourse.json();
            recipe_ = data.meals[0];
            console.log(data);
            let creator = "TheMealDB"
            getRecipe(recipe_, creator);

        } catch (e) {
            console.log(e);
        }
    }

    async function getRecipe(recipe_, author) {
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
        <p>${usersname}</p>
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
            <div  class="commentBox"></div>
                <div class="comments">
                </div>
                <p><b>Share your opinion on ${recipe.strMeal}</b></p>
                <form>
                <div class="rating">
                    <input type="radio" id="star5" name="rating" value="5" />
                    <label for="star5"></label>
                    <input type="radio" id="star4" name="rating" value="4" />
                    <label for="star4"></label>
                    <input type="radio" id="star3" name="rating" value="3" />
                    <label for="star3"></label>
                    <input type="radio" id="star2" name="rating" value="2" />
                    <label for="star2"></label>
                    <input type="radio" id="star1" name="rating" value="1" />
                    <label for="star1"></label>
                </div>
                <textarea id="comment" name="comment"></textarea><br><br>
                <button type="submit">Comment</button>
                </form>
            </div>
            `;
        const list = document.querySelector(".ingredientList");
        for (const ratio of ingredients) {
            list.innerHTML += `
                <li><b>${ratio.ingredient}</b> ${ratio.measurement}</li>
            `;
        }

        document.querySelector("#menu").addEventListener("click", ShowMenu);
        let RegisterButton = main.querySelector("form");
        RegisterButton.addEventListener("submit", sendComment);
        console.log(recipe_.idMeal);
        try {
            const response = await fetch(`/loginregister-api/comments.php?id=${recipe_.idMeal}`);
            const data = await response.json();
            for (const comment_ of data.comments) {
                let commentContainer = document.createElement("div");
                commentContainer.classList.add("comment");
                commentContainer.innerHTML = `
                    <div class="nameStarContainer">
                        <p><b>${comment_.author}</b></p>
                        <div class="starContainer"></div>
                    </div>
                    <p>${comment_.comment}</p>
                    <p class="timestamp">${comment_.timestamp}</p>
                `;
                main.querySelector(".commentBox").appendChild(commentContainer);

                let nameStarContainer = commentContainer.querySelector(".nameStarContainer");
                let starContainer = commentContainer.querySelector(".starContainer");

                for (let i = 0; i < Number(comment_.rating); i++) {
                    let star = document.createElement("div");
                    star.classList.add("star");
                    starContainer.appendChild(star);
                }

                if (comment_.author === usersname) {
                    let editButton = document.createElement("button");
                    let dropdownMenu = document.createElement("div");
                    editButton.classList.add("editButton");
                    dropdownMenu.classList.add("dropdownMenu");
                    editButton.innerHTML = `
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                    `
                    dropdownMenu.innerHTML = `
                    <div class="dropdown-item bin"></div>
                    <div class="dropdown-item edit"></div>
                    `
                    nameStarContainer.appendChild(editButton);
                    nameStarContainer.appendChild(dropdownMenu);

                    editButton.addEventListener('click', () => {
                        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
                    });

                    dropdownMenu.addEventListener('mouseleave', () => {
                        dropdownMenu.style.display = 'none';
                    });

                }
            }

            console.log(data);

        } catch (error) {
            // Handle any errors
            console.error(error);
        }

    }
    async function sendComment(event) {
        event.preventDefault();
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
            // if-sats här om det är en gäst eller inloggad person
            const form = main.querySelector("form");
            const dataform = new FormData(form);
            const recipeId = recipe_.idMeal;
            let rating;
            let comment;
            let output = [];
            for (const entry of dataform) {
                output = `${output}${entry[0]}=${entry[1]}\r`;
                if (`${entry[0]}` === "rating") {
                    rating = `${entry[1]}`;
                } else {
                    comment = `${entry[1]}`;
                }
                // console.log(output)
                event.preventDefault();
            }
            const commentData = {
                usersname,
                recipeId,
                rating,
                comment,
            };
            console.log(commentData);

            try {
                let response = await fetch("/loginregister-api/comments.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(commentData),
                });
                let data = await response.json();
                console.log(response);
                if (response.ok) {
                    renderRecipe(recipe);
                } else {
                    // popUp(`${data.message}`);
                }
            } catch (error) {
                //message.textContent = `${error.message}`;
            }
        }
    }
}

