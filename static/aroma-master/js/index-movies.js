// Store information in localStorage
document.addEventListener('DOMContentLoaded', async function () {
    const array = [];
    moviesList.innerHTML = '<div class="spinner"></div>'
    await new Promise((resolve) => setTimeout(resolve, 500));
    let films = await (await fetch('http://127.0.0.1:8000/movies')).json();
    moviesList.innerHTML = '';
    films.forEach(movie => {
        const movieElement = `<div class="col-md-6 col-lg-4 col-xl-3" id="${movie.id}">
                                        <div class="card text-center card-product">
                                            <div class="card-product__img">
                                                <a href="single-product.html">
                                                    <img class="card-img" src="${movie.imdb_image}" alt="">
                                                    <ul class="card-product__imgOverlay">
                                                    <li><button><i class="ti-search"></i></button></li>
                                                    <li><button><i class="ti-shopping-cart"></i></button></li>
                                                    <li><button id="cuore1"><i></i></button></li>
                                                    </ul>
                                                </a>
                                            </div>
                                            <div class="card-body">
                                                <a href="single-product.html">
                                                <p>${movie.movie_length} min.</p>
                                                <h4 class="card-product__title">${movie.title}</h4>
                                                <p class="card-product__price">${movie.genre}</p>
                                                </a>
                                            </div>
                                        </div>
                                        </a>
                                    </div>`;
        moviesList.insertAdjacentHTML('beforeend', movieElement);
    });


    //Manage the heart icons            
    const elements = document.querySelectorAll('[id^="cuore"]');
    for (let i = 0; i < elements.length; i++) {
        array[i] = elements[i];
        var element = array[i].querySelector('i');

        var par = element;
        for (let j = 0; j < 6; j++) {
            par = par.parentNode;
        }
        const key = par.id;

        const item = localStorage.getItem(key);
        //if (typeof(Storage) !== "undefined") {
        if (item) {
            element.classList.add('heart-full');
        } else {
            element.classList.add('heart');
        }

        array[i].addEventListener('click', function () {
            var element = array[i].querySelector('i');

            var par = element;
            for (let j = 0; j < 6; j++) {
                par = par.parentNode;
            }
            const key = par.id;

            const item = localStorage.getItem(key);
            // Code for localStorage/sessionStorage
            if (item) {
                element.classList.remove('heart-full');
                element.classList.add('heart');
                localStorage.removeItem(key);
                console.log(`Element removed from local storage: ${key}`);
            } else {
                element.classList.remove('heart');
                element.classList.add('heart-full');
                for (let k = 0; k < films.length; k++) {
                    if (films[k].id == key)
                        localStorage.setItem(key, JSON.stringify(films[k]));
                }
                console.log(`Element added to local storage: ${key}`);
            }
        });
    }
});