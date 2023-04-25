function renderCategoriesPage() {
    let username;
    if (!window.localStorage.getItem("user")) {
        username = "Guest";
    } else {
        username = localStorage.getItem("user");
    }

    main.innerHTML = `
        <div class="header">
            <button onclick="">Menu</button>
            <h2>YumYumClub</h2>
            <p>${username}</p>
        </div>
        <div class="categories"></div>
    `;
    const divCategories = document.querySelector(".categories");

    fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
        .then(response => response.json())
        .then(data => {
            data.forEach(category => {
                const categoryDiv = document.createElement("div");
                categoryDiv.textContent = category.name;
                divCategories.appendChild(categoryDiv);
            });
        })
        .catch(error => console.error(error));

}

