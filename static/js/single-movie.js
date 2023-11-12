import {favouritesIcon, watchlistIcon} from './lists-buttons.js';

document.addEventListener('DOMContentLoaded', async function () {
    film();
});

async function film() {

    const path = window.location.pathname;
    const parts = path.split('/');
    const id = parts[parts.length - 1];

    if (id) {
        movieDetail.style.visibility = "hidden";
        let f = await (await fetch('/movies/' + id)).json();
        spinner.style.display = "none";
        const omdb_info = await (await fetch('https://www.omdbapi.com/?apikey=1dec15a8&i=' + f.imdb_url.split('/')[4])).json();
        title.innerHTML = f.title;
        poster.innerHTML = `<div class="single-prd-item">
                        <img class="img-fluid" src="${f.imdb_image}" alt=""></img>
                        </div>`;
        year.innerHTML = `Anno di uscita: ${f.release_year}`;
        genre.innerHTML = `Genere: ${f.genre}`;
        lngth.innerHTML = `Durata: ${f.movie_length} mins`;
        language.innerHTML = `Lingua: ${f.language}`;
        IMDBurl.innerHTML = `<a href="${f.imdb_url}" target="_blank">Pagina IMDB</a>`;

        plot.innerHTML = `<h4>Trama</h4> <p>${omdb_info.Plot}</p>`;
        director.innerHTML = `<h4>Regista</h4><p>${omdb_info.Director}</p>`;
        ratings.innerHTML = `<h4>Valutazioni</h4>`;
        omdb_info.Ratings.forEach((rating) => {
            ratings.innerHTML += `<p>${rating.Source}: ${rating.Value}</p>`;
        });
        boxoffice.innerHTML = `<h4>Incassi</h4><p>${omdb_info.BoxOffice}</p>`;

        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

        const buttonList = document.getElementById(id).querySelectorAll('a');

        const buttonClk = buttonList[0];
        if (watchlist.includes(id.toString())) {
            buttonClk.innerHTML = `<i class="clk-full"></i>`
        } else {
            buttonClk.innerHTML = `<i class="clk"></i>`
        }

        const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

        const buttonHeart = buttonList[1];
        if (favourites.includes(id.toString())) {
            buttonHeart.innerHTML = `<i class="heart-full"></i>`
        } else {
            buttonHeart.innerHTML = `<i class="heart"></i>`
        }

        const iconBtns = document.querySelectorAll('.icon_btn');
        iconBtns.forEach((btn) => {
            btn.addEventListener('click', function (event) {
                handleLists(event, id);
            });
        });
        movieDetail.style.visibility = "visible";

    }
}

export function handleLists(event, movie_id) {
    event.preventDefault();

    const iconElement = event.currentTarget.querySelector('i');

    if (iconElement.classList.contains('clk') || iconElement.classList.contains('clk-full')) {
        watchlistIcon(movie_id.toString(), iconElement);
    } else if (iconElement.classList.contains('heart') || iconElement.classList.contains('heart-full')) {
        favouritesIcon(movie_id.toString(), iconElement);
    }
}
				
