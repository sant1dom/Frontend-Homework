let [empty, controller, method, movie_id] = window.location.pathname.split("/");

async function fillForm(id) {
    var film = await (await fetch('/movies/' + id)).json();

    const checks = ["title", "release_year", "movie_length", "genre", "language", "imdb_url"];
    for (let i in checks) {
        const field = checks[i];
        document.getElementById(field + "_input").value = film[field];
    }
}

function sendMovieForm(){
    let count_error = 0;
    let formData = new FormData();

    const checks = ["title", "release_year", "movie_length", "genre", "language", "imdb_url"];
    for (let i in checks)
    {
        const field = checks[i];
        const value = document.getElementById(field + "_input").value;
        const error = document.getElementById(field + "_error");

        formData.append(field, value);

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
                body: formData,
            })
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                    alert('There was a problem with the Update operation: ' + response.statusText);
                    return;
                }

                alert('Movie updated successfully, redirect to Home Page');
                window.location.href = "/";
            })
    }
    else if (method == "create"){
        fetch(`/movies/`, {
                method: 'POST',
                body: formData,
            })
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                    alert('There was a problem with the Create operation: ' + response.statusText);
                    return;
                }

                alert('Movie created successfully, redirect to Home Page');
                window.location.href = "/";
            })
    }

    return;
}

if (method == "update"){
    fillForm(movie_id);
}
