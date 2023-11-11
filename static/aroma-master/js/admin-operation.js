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

    if (method == "update"){
        fetch(`/movies/${movie_id}`, {
                method: 'PUT',
                body: formData,
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                alert('Movie updated successfully');
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation: ', error);
            });
    }
    else if (method == "create"){
        fetch(`/movies/`, {
                method: 'POST',
                body: formData,
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                alert('Movie updated successfully');
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation: ', error);
            });
    }

    return false;
}

if (method == "update"){
    fillForm(movie_id);
}
