var x;

async function film(id){
    var f = await (await fetch('http://127.0.0.1:8000/movies/' + id)).json();
    console.log(f)
    //x = f
    title.innerHTML = f.title;
    poster.innerHTML = `<div class="single-prd-item">
                        <img class="img-fluid" src="${f.imdb_image}" alt=""></img>
                        </div>`; 
    year.innerHTML = `Anno di uscita: ${f.release_year}`;
    genre.innerHTML = `Genere: ${f.genre}`;
    lngth.innerHTML = `Durata: ${f.movie_length}`;
    console.log(f.movie_length)
    language.innerHTML = `Lingua: ${f.language}`;
    IMDBurl.innerHTML = `Pagina IMDB: ${f.imdb_url}`;
    return f
}



							
                            