document.addEventListener('DOMContentLoaded', async function () {

    let films = await (await fetch('http://127.0.0.1:8000/movies')).json();
    films.forEach(film => {
        const movieElement = `<tr id="${film.id}">
                                <td><p>${film.title}</p></td>
                                <td><h5><button class="btn btn-primary" onclick="window.open('/admin/operation');">EDIT</button></h5></td>
                                <td><p><button class="btn btn-danger" onclick="openConfirmationPopup(${film.id})">DELETE</button></p></td>
                              </tr>`;
        lista.insertAdjacentHTML('afterbegin', movieElement);
    });


});

function openConfirmationPopup(movieId) {
    const popupHTML = `<div id="overlay"></div>
                                  <div id="confirmationPopup">
                                    <h5>Are you sure you want to delete the movie?</h5>
                                    <br>
                                    <button class="btn btn-warning" onclick="closeConfirmationPopup()">CANCEL</button>
                                    <button class="btn btn-danger" onclick="deleteMovie(${movieId})">DELETE</button>
                                  </div>`;

    popup.insertAdjacentHTML('beforeend',popupHTML);
    // Mostra il popup e l'overlay
    document.getElementById("overlay").style.display = "block";
    document.getElementById("confirmationPopup").style.display = "block";
}

function closeConfirmationPopup() {
    // Nascondi il popup e l'overlay
    document.getElementById("overlay").style.display = "none";
    document.getElementById("confirmationPopup").style.display = "none";
}

function deleteMovie(id){
    closeConfirmationPopup();

    fetch(`http://127.0.0.1:8000/movies/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Movie deleted successfully');
                const movieRow = document.getElementById(id);

                // Rimuovi l'elemento graficamente se esiste
                if (movieRow) {
                    movieRow.parentNode.removeChild(movieRow);
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation: ', error);
            });
}