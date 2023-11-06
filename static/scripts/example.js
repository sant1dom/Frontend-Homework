async function home() {
    let movies = await (await fetch("/movies")).json()
    let prova = document.getElementById("prova")
    prova.innerHTML = "<ul>"
    movies.forEach(movie => {
        prova.innerHTML +=
        `<li style="list-style-type: none; display: inline-block; margin: 10px;">
            <div style="text-align: center;">
                <a href="/movies/${movie.id}" style="text-decoration: none; color: black; font-size: 20px; font-weight: bold;">
                    ${movie.title}
                    <br>
                    <img src="${movie.imdb_image}" style="border-radius: 10px; margin: 10px;"/>
                </a>
            </div>
        </li>`
    })
}

home()