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
})()

async function search(event) {
    event.preventDefault()
    results.innerHTML = ""
    resultsH1.removeAttribute("hidden")
    let url = "/movies/search?";
    const formData = new FormData(event.target)
    formData.forEach((value, key) => {
        if (value !== '') url += `${key}=${value}&`
    })
    const movies = await (await fetch(url)).json();
    if (movies["detail"]){
        results.innerHTML = movies.detail
    } else {
        movies.forEach(movie => {
            let loading = true;
            const movieElement = `<div class="col-md-6 col-lg-4 col-xl-3" id="${movie.id}">
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
                                        </a>
                                    </div>`;
            results.insertAdjacentHTML('beforeend', movieElement);
        });
    }


}

searchForm.addEventListener("submit", search)

