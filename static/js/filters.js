export async function filters(items){

    //Riempio dinamicamente le opzioni del filtro sui generi
    let films = await (await fetch('/movies/')).json();
    let insertedGenres = []; // Array per memorizzare i generi già inseriti
    films.forEach((film) => {
        if (film && !insertedGenres.includes(film.genre)) { // Controllo se il genere è già stato inserito
            const ul = `<li class="filter-list"><input class="pixel-radio" type="checkbox" id="${film.genre}" name="genre"><label for="${film.genre}">${film.genre}</label></li> `
            genres.insertAdjacentHTML('beforeend', ul);
            insertedGenres.push(film.genre); // Aggiungo il genere all'array
        }
    });

    // Variabile globale per il genere selezionato
    var selectedGenres = [];

    // Variabile globale per il range di anni selezionato
    var selectedYearRange = [1920, 2023];

    //FILTRO GENERE----------------------------------------------------------------
    // Variabile globale per i checkbox
    var checkboxes = document.querySelectorAll('.pixel-radio');

    // Aggiungi gli event listener per i checkbox
    checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
    if (this.checked) {
    selectedGenres.push(this.id);
    } else {
    selectedGenres = selectedGenres.filter(genre => genre !== this.id);
    }
    updateDisplay();
    });
    });
    //FINE FILTRO GENERE-----------------------------------------------------------

    //FILTRO ANNO DI USCITA--------------------------------------------------------
    var formatForSlider = {
        from: function(value) {
            return Number(value);
        },
        to: function(value) {
            return Math.round(value);
        }
    };

    var slider = document.getElementById('price-range');

    noUiSlider.create(slider, {
        connect: true,
        behaviour: 'tap',
        start: [ 1920, 2023 ],
        range: {'min': [ 1920, 1 ],'max': [ 2023 ]},
        format: formatForSlider
    });

    var nodes = [
        document.getElementById('lower-value'), // 0
        document.getElementById('upper-value')  // 1
    ];

    slider.noUiSlider.on('update', function ( values, handle ) {
        nodes[handle].innerHTML = values[handle];
        selectedYearRange = [values[0], values[1]];
        updateDisplay();
    });
    //FINE FILTRO ANNO DI USCITA---------------------------------------------------

    // Funzione per aggiornare la visualizzazione dei film
    function updateDisplay() {
        items.forEach(function (movie) {
            if(movie.id)
                document.getElementById(movie.id).hidden = true;
        });

        var filteredMovies = items.filter(function (movie) {
            return (!selectedGenres.length || selectedGenres.includes(movie.genre)) && 
                (!selectedYearRange || (movie.release_year >= selectedYearRange[0] && movie.release_year <= selectedYearRange[1]));
        });

        filteredMovies.forEach(function (movie) {
            document.getElementById(movie.id).hidden = false;
        });
    }
}