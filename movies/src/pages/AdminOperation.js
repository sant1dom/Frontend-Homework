const AdminOperation = () => {

    const input_title = useRef();
    const input_release_year = useRef();
    const input_movie_length = useRef();
    const input_genre = useRef();
    const input_language = useRef();
    const input_imdb_url = useRef();

    const error_title = useRef();
    const error_release_year = useRef();
    const error_movie_length = useRef();
    const error_genre = useRef();
    const error_language = useRef();
    const error_imdb_url = useRef();

    const clearError = () => {
    };
}

return (
    <div className="container mx-auto">
        <h1 className="text-2xl">AdminOperation</h1>

        <form>
            <div className="form-group">
                Title:
                <br/>
                <input ref={input_title} type="text" onChange={() => {clearError(error_title)}}/>
                <div ref={error_title} style="display: none; color: red">
                    Write Title
                </div>
            </div>
            <div className="form-group">
                Release year:

                    <input className="form-control" name="release_year" id="release_year_input"
                           type="number" min=1800 max=2050 onchange="release_year_error.style.display =
                        'none'">
                    <div id="release_year_error" style="display: none; color: red">
                        Write Release year
                    </div>
                </div>
                <div className="form-group">
                    Length:
                    <br>/><input className="form-control" name="movie_length" id="movie_length_input"
                                 type="number" min=0 max=999 onchange="movie_length_error.style.display
                        = 'none'">
                    <div id="movie_length_error" style="display: none; color: red">
                        Write Length
                    </div>
                </div>
                <div className="form-group">
                    Genre:
                    <br>
                        /> <input className="form-control" name="genre" id="genre_input" type="text"
                                  onChange="genre_error.style.display = 'none'">
                        /> <div id="genre_error" style="display: none; color: red">
                        Write Genre
                    </div>
                </div>
                <div className="form-group">
                    Language:
                    <br>
                        /> /> <input className="form-control" name="language" id="language_input"
                                     type="text" onChange="language_error.style.display = 'none'">
                        /> /> <div id="language_error" style="display: none; color: red">
                        Write Language
                    </div>
                </div>
                <div className="form-group">
                    IMDB's URL:
                    <br>
                        /> /> <input className="form-control" name="imdb_url" id="imdb_url_input"
                                     type="text" onChange="imdb_url_error.style.display = 'none'">
                        /> /> <div id="imdb_url_error" style="display: none; color: red">
                        Write a valid IMDB's URL
                    </div>
                </div>


                <button id="sendMovieButton" onClick="sendMovieForm(); return false;"
                        className="button button--active button-contactForm">Confirm

            </div>
        </form>

    </div>
);
}

export default AdminOperation;