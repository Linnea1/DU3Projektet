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
                    mealId: idOfMeal,
                }

                await fetching("api/add_and_remove_favourite.php", "POST", body);

            } catch (error) {
                popUp(error);
            }
        } else {
            RemoveFavourite(likedElement);
        }
    }
}

async function RemoveFavourite(recipe) {
    let parent = recipe.parentElement
    let idOfMeal = parent.dataset.id;

    try {
        let body= JSON.stringify({
            username: user.username,
            mealId: idOfMeal
        });

       await fetching("api/add_and_remove_favourite.php", "DELETE", body);

    } catch (error) {
        popUp(error);
    }
}

//Checking if recipe is liked
async function checkLiked(recipe) {

    let response = await fetch(`api/add_and_remove_favourite.php?mealId=${recipe}&user=${user.username}`);
    let resourse = await response.json();

    return resourse

}