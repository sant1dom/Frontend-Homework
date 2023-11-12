let [empty, controller, method, movie_id] = window.location.pathname.split("/");

async function fillForm(id) {
    var film = await (await fetch('/movies/' + id)).json();

    const checks = ["title", "release_year", "movie_length", "genre", "language", "imdb_url"];
    for (let i in checks) {
        const field = checks[i];
        document.getElementById(field + "_input").value = film[field];
    }
}

function openErrorPopup(text){
        const popupHTML = `<div id="overlay"></div>
                                  <div id="confirmationPopup">
                                    <h5>${text}</h5>
                                    <button class="btn btn-danger" onclick="closeConfirmationPopup()">OK</button>
                                  </div>`;

    //popup.insertAdjacentHTML('beforeend',popupHTML);
    popup.innerHTML = popupHTML;
    // Mostra il popup e l'overlay
    document.getElementById("overlay").style.display = "block";
    document.getElementById("confirmationPopup").style.display = "block";
}

function openSuccessPopup(text){
        const popupHTML = `<div id="overlay"></div>
                                  <div id="confirmationPopup">
                                    <h5>${text}</h5>
                                    <button class="btn btn-success" onclick="window.location.href = '/'">Go Home</button>
                                  </div>`;

    //popup.insertAdjacentHTML('beforeend',popupHTML);
    popup.innerHTML = popupHTML;
    // Mostra il popup e l'overlay
    document.getElementById("overlay").style.display = "block";
    document.getElementById("confirmationPopup").style.display = "block";
}

function closeConfirmationPopup() {
    // Nascondi il popup e l'overlay
    document.getElementById("overlay").style.display = "none";
    document.getElementById("confirmationPopup").style.display = "none";
}

function sendMovieForm(){
    let count_error = 0;
    let formData = {};

    const checks = ["title", "release_year", "movie_length", "genre", "language", "imdb_url"];
    for (let i in checks)
    {
        const field = checks[i];
        const value = document.getElementById(field + "_input").value;
        const error = document.getElementById(field + "_error");

        if (field == "movie_length" || field == "release_year"){
            formData[field] = parseInt(value);
        }
        else {
            formData[field] = value;
        }

        if (value == ""){
            count_error++;
            error.style.display = "block";
        }
        else{
            error.style.display = "none";
        }
    }

    if (count_error > 0){
        return;
    }

    if (method == "update"){
        fetch(`/movies/${movie_id}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
                headers: {
                  'Content-Type': 'application/json'
                },
            })
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                    openErrorPopup('There was a problem with the PUT method: ' + response.statusText);
                    return;
                }

                openSuccessPopup('Movie updated successfully');
            })
    }
    else if (method == "create"){
        fetch(`/movies`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                  'Content-Type': 'application/json'
                },
            })
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                    openErrorPopup('There was a problem with the POST method: ' + response.statusText);
                    return;
                }

                openSuccessPopup('Movie created successfully');
            })
    }

    return;
}

if (method == "update"){
    fillForm(movie_id);
}
