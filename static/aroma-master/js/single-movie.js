import {favouritesIcon, watchlistIcon} from './lists-buttons.js';

document.addEventListener('DOMContentLoaded', async function() { film(); });

async function film(){
    
    var path = window.location.pathname;
    var parts = path.split('/');
    var id = parts[parts.length - 1];

    if(id){
    var f = await (await fetch('/movies/' + id)).json();
        title.innerHTML = f.title;
        poster.innerHTML = `<div class="single-prd-item">
                            <img class="img-fluid" src="${f.imdb_image}" alt=""></img>
                            </div>`; 
        year.innerHTML = `Anno di uscita: ${f.release_year}`;
        genre.innerHTML = `Genere: ${f.genre}`;
        lngth.innerHTML = `Durata: ${f.movie_length} mins`;
        language.innerHTML = `Lingua: ${f.language}`;
        IMDBurl.innerHTML = `<a href="${f.imdb_url}">Pagina IMDB</a>`;

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
				
