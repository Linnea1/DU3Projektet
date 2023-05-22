async function renderRecipe(recipe) {
    let currentRecipe;
    let username = user.username;

    console.log(recipe);
    if (recipe.idMeal.startsWith("x_")) {
        currentRecipe = recipe;
        let creator = currentRecipe.author
        getRecipe(currentRecipe, creator);
    } else {
        try {
            let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`);
            let data = await response.json();
            currentRecipe = data.meals[0];
            let creator = "TheMealDB";
            getRecipe(currentRecipe, creator);

        } catch (e) {
            popUp(e);
        }
    }

    async function getRecipe(currentRecipe, author) {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (currentRecipe[`strIngredient${i}`]) {
                ingredients.push({
                    ingredient: currentRecipe[`strIngredient${i}`],
                    measurement: currentRecipe[`strMeasure${i}`]
                });
            }
        }

        main.innerHTML = `
            <div class="header">
            <button id="menu">Menu</button>
            <p>${username}</p>
            <div class=image></div>
            <button onclick = "renderRecepiesAfterCategory()">Go Back</button>
            </div>
                <div class="recipe">
                    <h2><b>${currentRecipe.strMeal}</b></h2>
                    <img src="${currentRecipe.strMealThumb}"> 
                    <div class="author">
                        <p>${author}</p>
                    </div>
                    <div class="ingredients">
                        <h4>Ingredients</h4>
                        <ul class="ingredientList"></ul>
                    </div>
                    <div class="howTo">
                        <h4>How to make ${recipe.strMeal}</h4>
                        <p>${currentRecipe.strInstructions}</p>
                    </div>
                </div>
                <div class="commentBox"></div>
                    <div class="comments"></div>
                    <div class="ratingBox"></div>
                </div>
        `;

        const list = document.querySelector(".ingredientList");
        for (const ratio of ingredients) {
            list.innerHTML += `
                <li><b>${ratio.ingredient}</b> ${ratio.measurement}</li>
            `;
        }

        document.querySelector("#menu").addEventListener("click", ShowMenu);
        let usersComment=false;

        try {
            const response = await fetch(`api/commentsAndRatings.php?id=${currentRecipe.idMeal}`);
            const data = await response.json();
            
            for (const Comment of data.comments) {
                let commentContainer = document.createElement("div");
                commentContainer.classList.add("comment");
                commentContainer.innerHTML = `
                    <div class="nameStarContainer">
                        <div class="commentPfp"></div>
                        <p><b>${Comment.author}</b></p>
                        <div class="starContainer"></div>
                    </div>
                    <p>${Comment.comment}</p>
                    <p class="timestamp">${Comment.timestamp}</p>
                `;
                main.querySelector(".commentBox").append(commentContainer);
                console.log(Comment.pfp)

                const profilePicture=commentContainer.querySelector(".commentPfp");
                if (Comment.pfp!==undefined) { // if pfp then add it
                    profilePicture.style.backgroundImage = `url(${Comment.pfp})`;
                }

                let nameStarContainer = commentContainer.querySelector(".nameStarContainer");
                let starContainer = commentContainer.querySelector(".starContainer");

                for (let i = 0; i < Number(Comment.rating); i++) {
                    let star = document.createElement("div");
                    star.classList.add("star");
                    starContainer.append(star);
                }

                if (Comment.author === username) {
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
                    nameStarContainer.append(editButton);
                    nameStarContainer.append(dropdownMenu);

                    editButton.addEventListener('click', () => {
                        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
                    });

                    dropdownMenu.addEventListener('mouseleave', () => {
                        dropdownMenu.style.display = 'none';
                    });

                    document.querySelector(".bin").addEventListener("click", e => {deleteComment(username, recipe)});

                    usersComment=true;
                }
                
            }

        } catch (error) {
            console.error(error);
        }
        if(usersComment===false){
            document.querySelector(".ratingBox").innerHTML= `
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
            `
            let submitButton = main.querySelector("form");
            submitButton.addEventListener("submit", sendComment);
        }
    }
    async function sendComment(event) {
        event.preventDefault();
        if (user.guest) {
            complexPopUp("Only registered users can use this feature", "Register or login", "OK", "logout()");
        } else {
            const form = main.querySelector("form");
            const dataform = new FormData(form);
            const recipeId = currentRecipe.idMeal;
            let rating;
            let comment;
            let pfp=user.pfp
            let output = [];
            
            //Kanske ta bort /r
            for (const entry of dataform) {
               // output = `${output}${entry[0]}=${entry[1]}\r`;
                if (`${entry[0]}` === "rating") {
                    rating = `${entry[1]}`;
                } else {
                    comment = `${entry[1]}`;
                }
            }
            console.log(username)
            const commentData = {
                username,
                pfp,
                recipeId,
                rating,
                comment,
            };

            try {
                let response = await fetching("api/commentsAndRatings.php", "POST", commentData);
                let data = await response.json();
       
                if (response.ok) {
                    renderRecipe(recipe);
                } else {
                    popUp(`${data.message}`);
                }
            } catch (error) {
                popUp(error.message);
            }
        }
    }
}

async function deleteComment(username, recipe){
    console.log(recipe.idMeal)
    try{
    const response = await fetch(`api/commentsAndRatings.php?author=${username}&recipeId=${recipe.idMeal}`, {
        method: "DELETE"
    });
    if (response.ok) {
        renderRecipe(recipe);
      } else {
        console.log('Failed to delete comment');
      }
    }catch(error){
        popUp(error);
    }
}