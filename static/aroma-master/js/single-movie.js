async function film(id){
    var f = await (await fetch('http://127.0.0.1:8000/movies/' + id)).json();
    console.log(f)
    title.innerHTML = f.title;
    poster.innerHTML = `<div class="single-prd-item">
                        <img class="img-fluid" src="${f.imdb_image}" alt=""></img>
                        </div>`; 
    year.innerHTML = `Anno di uscita: ${f.release_year}`;
    genre.innerHTML = `Genere: ${f.genre}`;
    lngth.innerHTML = `Durata: ${f.movie_length} mins`;
    console.log(f.movie_length)
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

    return f
}

function handleLists(event, movie_id) {
    event.preventDefault();

    const iconElement = event.currentTarget.querySelector('i');

    if (iconElement.classList.contains('clk') || iconElement.classList.contains('clk-full')) {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

        if (watchlist.includes(movie_id.toString())) {
            iconElement.classList.remove('clk-full');
            iconElement.classList.add('clk');

            const index = watchlist.indexOf(movie_id.toString());
            if (index > -1) {
                watchlist.splice(index, 1);
            }
        } else {
            iconElement.classList.remove('clk');
            iconElement.classList.add('clk-full');
            watchlist.push(movie_id.toString());
        }

        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        console.log(`Film ${watchlist.includes(movie_id.toString()) ? 'added to' : 'removed from'} watchlist: ${movie_id.toString()}`);
    } else if (iconElement.classList.contains('heart') || iconElement.classList.contains('heart-full')) {
        const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

        if (favourites.includes(movie_id.toString())) {
            iconElement.classList.remove('heart-full');
            iconElement.classList.add('heart');

            const index = favourites.indexOf(movie_id.toString());
            if (index > -1) {
                favourites.splice(index, 1);
            }
        } else {
            iconElement.classList.remove('heart');
            iconElement.classList.add('heart-full');
            favourites.push(movie_id.toString());
        }
        localStorage.setItem('favourites', JSON.stringify(favourites));
        console.log(`Film ${favourites.includes(movie_id.toString()) ? 'added to' : 'removed from'} watchlist: ${movie_id.toString()}`);
    }
}



							
                            