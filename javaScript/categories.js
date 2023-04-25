function renderCategoriesPage(){
    let user
    if (!window.localStorage.getItem("user")) {
        user="Guest"
    }else{
        const username = localStorage.getItem("user");
    }
    
    main.innerHTML=`

    `;
}