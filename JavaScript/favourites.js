async function AddRecipesAsFavourite(event) {
    event.stopPropagation();

    if (user.guest) {
        complexPopUp("Only registered users can use this feature", "Register or login", "OK", "logout()")
    } else {
        const recipe = event.target.parentElement;
        recipe.classList.toggle("liked");


        let parent = recipe.parentElement
        let idOfMeal = parent.dataset.id;

        if (recipe.classList.contains("liked")) {
            try {
                let body = {
                    username: user.username,
                    idMeal: idOfMeal,
                }

                await fetching("api/addAndRemoveFavourites.php", "POST", body);

            } catch (error) {
                popUp(error);
            }
        } else {
            RemoveFavourite(recipe);
        }
    }
}

async function RemoveFavourite(recipe) {
    let parent = recipe.parentElement
    let idOfMeal = parent.dataset.id;

    try {
        let body = {
            username: user.username,
            idMeal: idOfMeal
        };

        await fetching("api/addAndRemoveFavourites.php", "DELETE", body);

    } catch (error) {
        popUp(error);
    }
}

//Checking if recipe is liked
async function checkLiked(recipe) {

    let response = await fetch(`api/addAndRemoveFavourites.php?idMeal=${recipe}&user=${user.username}`);
    let data = await response.json();

    return data;

}