document.addEventListener('DOMContentLoaded', async function () {
    const array = [];
    const arr = [];
    moviesList.innerHTML = '<div class="spinner"></div>'
    await new Promise((resolve) => setTimeout(resolve, 500));
    let films = await (await fetch('/movies')).json();
    moviesList.innerHTML = '';
    films.forEach(movie => {
        const movieElement = `<div class="col-md-6 col-lg-4 col-xl-3" id="${movie.id}">
                                        <div class="card text-center card-product">
                                            <div class="card-product__img">
                                                <a href="/films/${movie.id}">
                                                    <img class="card-img" src="${movie.imdb_image}" alt="">
                                                </a>
                                                <ul class="card-product__imgOverlay">
                                                    <li><button id="clock1"><i></i></button></li>
                                                    <li><button id="cuore1"><i></i></button></li>
                                                </ul>
                                            </div>
                                            <div class="card-body">
                                                <p>${movie.movie_length} min.</p>
                                                <h4 class="card-product__title"><a href="/films/${movie.id}">${movie.title}</a></h4>
                                                <p class="card-product__price">${movie.genre}</p>
                                                
                                            </div>
                                        </div>
                                        </a>
                                    </div>`;
        moviesList.insertAdjacentHTML('beforeend', movieElement);
    });



    //Management of the heart icon------------------------------------------------//    
    const elements = document.querySelectorAll('[id^="cuore"]');
    for (let i = 0; i < elements.length; i++) {
        array[i] = elements[i];
        var element = array[i].querySelector('i');

        var par = element;
        for (let j = 0; j < 6; j++) {
            par = par.parentNode;
        }
        const key = par.id;

        const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

        if (favourites.includes(key)) {
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

            const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

            if (favourites.includes(key)) {
                element.classList.remove('heart-full');
                element.classList.add('heart');

                const index = favourites.indexOf(key);
                if (index > -1) {
                    favourites.splice(index, 1);
                }
            } else {
                element.classList.remove('heart');
                element.classList.add('heart-full');

                favourites.push(key);
            }

            localStorage.setItem('favourites', JSON.stringify(favourites));
            console.log(`Film ${favourites.includes(key) ? 'added to' : 'removed from'} favourites: ${key}`);
        });
    }

    //Management of the clock icon------------------------------------------------//        
    const els = document.querySelectorAll('[id^="clock"]');
    for (let i = 0; i < els.length; i++) {
        arr[i] = els[i];
        var el = arr[i].querySelector('i');

        var par = el;
        for (let j = 0; j < 6; j++) {
            par = par.parentNode;
        }
        const key = par.id;
        
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

        if (watchlist.includes(key)) {
            el.classList.add('clk-full');
        } else {
            el.classList.add('clk');
        }

        arr[i].addEventListener('click', function () {
            var el = arr[i].querySelector('i');

            var par = el;
            for (let j = 0; j < 6; j++) {
                par = par.parentNode;
            }
            const key = par.id;

            const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

            if (watchlist.includes(key)) {
                el.classList.remove('clk-full');
                el.classList.add('clk');

                const index = watchlist.indexOf(key);
                if (index > -1) {
                    watchlist.splice(index, 1);
                }
            } else {
                el.classList.remove('clk');
                el.classList.add('clk-full');
                watchlist.push(key);
            }

            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            console.log(`Film ${watchlist.includes(key) ? 'added to' : 'removed from'} watchlist: ${key}`);
        });
    }

});