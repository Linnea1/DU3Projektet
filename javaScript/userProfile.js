function RenderUserPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);

    main.innerHTML = `
    <div id="sticky"></div>
    <button onclick="history.back()">Go Back</button>
    <div class="userInfo">
        <div class="icon"></div>
        <h2><b>${user.username}</b></h2>
    </div>
    <div class="columns">
        <div>Recipes</div>
        <div>Favorites</div>
    </div>
`;
}