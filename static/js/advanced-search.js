(async function () {
    let genresList = await (await fetch('/genres')).json();
    const genres = document.getElementById('genre');
    genresList.forEach(genre => {
        genres.add(new Option(genre, genre));
    });

    let languagesList = await (await fetch('/languages')).json();
    const language = document.getElementById('language');
    languagesList.forEach(lang => {
        language.add(new Option(lang, lang));
    });

    title.value = new URLSearchParams(window.location.search).get("title")
    if (title.value) {
        submit.click()
        searchDiv.classList.remove("show")
        showFilters.innerHTML = "Show filters &darr;";
    } else {
        showFilters.innerHTML = "Hide filters &uarr;";
    }


})()

async function advancedSearch(event) {
    event.preventDefault()
    results.innerHTML = ""
    resultsH1.removeAttribute("hidden")
    let url = "/movies/search?";
    const formData = new FormData(event.target)
    formData.forEach((value, key) => {
        if (value !== '') url += `${key}=${value}&`
    })
    const movies = await (await fetch(url)).json();
    if (movies.detail) {
        results.innerHTML = `<div class="col-md-4 col-lg-3 col-sm-6 text-center">${movies.detail}</div>`
    } else {
        movies.forEach(movie => {
            let loading = true;
            const movieElement = `<div class="col-md-4 col-lg-3 col-sm-6" id="movie-${movie.id}">
                                            <div class="card text-center card-product">
                                                <div class="card-product__img">
                                                    <a href="/films/${movie.id}">
                                                    <div class="spinner" style="visibility: ${loading ? 'visible' : 'hidden'}"></div>
                                                    <img class="card-img" src="${movie.imdb_image}" alt="" onload="this.parentNode.querySelector('.spinner').style.visibility = 'hidden';">
                                                    </a>
                                                </div>
                                                <div class="card-body">
                                                    <p>${movie.movie_length} min.</p>
                                                    <h4 class="card-product__title"><a href="/films/${movie.id}">${movie.title}</a></h4>
                                                    <p class="card-product__price">${movie.genre}</p>   
                                                </div>
                                            </div>
                                          </div>`;
            results.insertAdjacentHTML('beforeend', movieElement);
        });
    }


}

searchForm.addEventListener("submit", advancedSearch)


showFilters.addEventListener("click", () => {
    showFilters.innerHTML = showFilters.innerHTML === "Hide filters ↑" ? "Show filters &darr;" : "Hide filters &uarr;";
});

