async function home() {
    let movies = await (await fetch("/movies")).json()
    for (let movie of movies) {
        prova.innerHTML += `<div><h3>${movie.title}</h3></div>`
    }
}

home()
