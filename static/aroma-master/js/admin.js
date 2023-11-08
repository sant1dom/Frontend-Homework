document.addEventListener('DOMContentLoaded', async function () {
    let films = await (await fetch('http://127.0.0.1:8000/movies')).json();
    films.forEach(film => {
        const movieElement = `<tr>
                                <td><p>${film.title}</p></td>
                                <td><h5><button class="button button--active button-contactForm" onclick="window.open('/admin/operation');">edit</button></h5></td>
                                <td><p><button class="button button--active button-contactForm">delete</button></p></td>
                              </tr>`;
        lista.insertAdjacentHTML('afterbegin', movieElement);
    });

});