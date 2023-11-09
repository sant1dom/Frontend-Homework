document.addEventListener('DOMContentLoaded', async function () {
    let films = await (await fetch('http://127.0.0.1:8000/movies')).json();
    films.forEach(film => {
        const movieElement = `<tr>
                                <td><p>${film.title}</p></td>
                                <td><h5><button class="button button--active button-contactForm" onclick="window.open('/admin/operation');">edit</button></h5></td>
                                <td><p><button class="button button--active button-contactForm" onclick="deleteMovie(${film.id})">delete</button></p></td>
                              </tr>`;
        lista.insertAdjacentHTML('afterbegin', movieElement);
    });

});

function deleteMovie(id){
    fetch(`http://127.0.0.1:8000/movies/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Movie deleted successfully');
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation: ', error);
            });
}