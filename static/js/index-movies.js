import {handleLists} from "./single-movie.js";

document.addEventListener('DOMContentLoaded', async function () {
    const array = [];
    const arr = [];
    moviesList.innerHTML = '<div class="spinner"></div>'
    await new Promise((resolve) => setTimeout(resolve, 500));
    let films = await (await fetch('/movies')).json();
    moviesList.innerHTML = '';
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    films.forEach(movie => {
        const movieElement = `<div class="col-md-6 col-lg-4 col-xl-3" id="${movie.id}">
                                        <div class="card text-center card-product">
                                            <div class="card-product__img">
                                                <a href="/films/${movie.id}">
                                                    <img class="card-img" src="${movie.imdb_image}" alt="">
                                                </a>
                                                <ul class="card-product__imgOverlay">
                                                    <li><button id="clock1" class="btn"></button></li>
                                                    <li><button id="cuore1" class="btn"></button></li>
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

    const iconBtns = document.querySelectorAll('.btn');
    iconBtns.forEach((btn) => {
        let par = btn;
        for (let j = 0; j < 5; j++) {
            par = par.parentNode;
        }
        if (btn.id == 'clock1') {
            if (watchlist.includes(par.id.toString())) {
                btn.innerHTML = `<i class="clk-full"></i>`
            } else {
                btn.innerHTML = `<i class="clk"></i>`
            }
        } else if (btn.id == 'cuore1') {
            if (favourites.includes(par.id.toString())) {
                btn.innerHTML = `<i class="heart-full"></i>`
            } else {
                btn.innerHTML = `<i class="heart"></i>`
            }
        }
        btn.addEventListener('click', function (event) {
            handleLists(event, par.id);
        });
    });

});