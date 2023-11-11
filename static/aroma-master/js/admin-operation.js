async function fillForm(id) {
    var f = await (await fetch('/movies/' + id)).json();
    console.log(f)
}

let [controller, method, id] = window.location.pathname.split("/");
alert([controller, method, id]);



							
                            