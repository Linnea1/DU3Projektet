renderStartPage();

//Stay on page if reload
if (localStorage.getItem("state")) {
    let view = JSON.parse(localStorage.getItem("state"));

    state = view.state;
    eval(view.function);
}