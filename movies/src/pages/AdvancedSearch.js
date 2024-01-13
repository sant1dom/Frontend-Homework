import {Link, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../utils/api";
import Button from "../components/Button";
import FadeContainer from "../components/FadeContainer";
import Card from "../components/Card";
import axios from "axios";
import LoadingCardSkeleton from "../components/LoadingCardSkeleton";

const AdvancedSearchForm = ({
                                title,
                                setTitle,
                                release_year_min,
                                setReleaseYearMin,
                                release_year_max,
                                setReleaseYearMax,
                                genre,
                                setGenre,
                                language,
                                setLanguage,
                                handleSearch,
                                genres,
                                languages,
                                setSearchParams
                            }) => {
    return (
        <div className="flex flex-col items-center px-4 space-y-4 justify-center py-2">
            <form onSubmit={handleSearch} className="w-3/4">
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                        <label className="text-gray-700 text-sm font-bold" htmlFor="title">Title:</label>
                        <input
                            className="flex-1 border rounded-md border-gray-300 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                        <label className="text-gray-700 text-sm font-bold" htmlFor="release_year_min">From
                            year:</label>
                        <input
                            className="flex-1 border rounded-md border-gray-300 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                            name="release_year_min"
                            id="release_year_min"
                            type="number"
                            placeholder="1920"
                            value={release_year_min}
                            onChange={(e) => setReleaseYearMin(e.target.value)}
                        />
                        <label className="text-gray-700 text-sm font-bold" htmlFor="release_year_max">To
                            Year:</label>
                        <input
                            className="flex-1 border rounded-md border-gray-300 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                            name="release_year_max"
                            id="release_year_max"
                            type="number"
                            placeholder="2023"
                            value={release_year_max}
                            onChange={(e) => setReleaseYearMax(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                        <label className="text-gray-700 text-sm font-bold" htmlFor="genre">Genre:</label>
                        <select name="genre" id="genre"
                                className="flex-1 border rounded-md border-gray-300 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                        >
                            <option value="">Select a genre</option>
                            {genres.map((genre, index) => (
                                <option key={index} value={genre}>{genre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                        <label className="text-gray-700 text-sm font-bold" htmlFor="language">Language:</label>
                        <select name="language" id="language"
                                className="flex-1 border rounded-md border-gray-300 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="">Select a language</option>
                            {languages.map((language, index) => (
                                <option key={index} value={language}>{language}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={"flex justify-center"}>
                    <button type="submit"
                            className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={title === ''}
                    > Search
                    </button>
                    <div className="w-4"/>
                    <button type="reset"
                            className="mt-4 px-4 py-2 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            disabled={title === '' && release_year_min === '' && release_year_max === '' && genre === '' && language === ''}
                            onClick={(e) => {
                                setTitle('');
                                setReleaseYearMin('');
                                setReleaseYearMax('');
                                setGenre('');
                                setLanguage('');
                                setSearchParams({});
                            }}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    )
}

const AdvancedSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [title, setTitle] = useState('');
    const [release_year_min, setReleaseYearMin] = useState('');
    const [release_year_max, setReleaseYearMax] = useState('');
    const [genre, setGenre] = useState('');
    const [language, setLanguage] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const genresResponse = await api.get('/genres');
                setGenres(genresResponse.data);

                const languagesResponse = await api.get('/languages');
                setLanguages(languagesResponse.data);

                const initialTitle = searchParams.get('title') || '';
                const initialReleaseYearMin = searchParams.get('release_year_min') || '';
                const initialReleaseYearMax = searchParams.get('release_year_max') || '';
                const initialGenre = searchParams.get('genre') || '';
                const initialLanguage = searchParams.get('language') || '';

                setTitle(initialTitle);
                setReleaseYearMin(initialReleaseYearMin);
                setReleaseYearMax(initialReleaseYearMax);
                setGenre(initialGenre);
                setLanguage(initialLanguage);

                let initialSearchParams = {
                    title: initialTitle,
                    release_year_min: initialReleaseYearMin,
                    release_year_max: initialReleaseYearMax,
                    genre: initialGenre,
                    language: initialLanguage,
                };
                initialSearchParams = Object.fromEntries(Object.entries(initialSearchParams).filter(([_, value]) => value !== ''));
                setSearchParams(initialSearchParams);
                if (Object.values(initialSearchParams).some((value) => value !== '')) {
                    api.get('/movies/search', {
                        params: initialSearchParams
                    }).then(async (response) => {
                        const moviesWithPosters = await Promise.all(response.data.map(async (movie) => {
                            movie.poster = await fetchMoviePoster(movie.imdb_url.split('/')[4]);
                            return movie;
                        }));
                        setSearchResults(moviesWithPosters);
                    }).catch((error) => {
                        console.log(error);
                    });
                } else {
                    setShowAdvancedSearch(true);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [searchParams]);

    const fetchMoviePoster = async (IMDBId) => {
        const response = await axios.get(`http://omdbapi.com/?apikey=${OMDB_API_KEY}&i=${IMDBId}`);
        return response.data.Poster;
    };

    const handleSearch = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        let data = Object.fromEntries(formData.entries());
        data = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== ''));
        setSearchParams(data);
        setLoading(true);
        api.get('/movies/search', {
            params: data
        }).then(async (response) => {
            const moviesWithPosters = await Promise.all(response.data.map(async (movie) => {
                movie.poster = await fetchMoviePoster(movie.imdb_url.split('/')[4]);
                return movie;
            }));
            setLoading(false);
            setSearchResults(moviesWithPosters);
        }).catch((error) => {
            console.log(error);
            setLoading(false);
        });
    }

    return (
        <>
            <Button label={showAdvancedSearch ? "Hide Advanced Search" : "Show Advanced Search"}
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)} rounded={true} classes={"mt-4"}/>
            <FadeContainer show={showAdvancedSearch}>
                <AdvancedSearchForm
                    title={title}
                    setTitle={setTitle}
                    release_year_min={release_year_min}
                    setReleaseYearMin={setReleaseYearMin}
                    release_year_max={release_year_max}
                    setReleaseYearMax={setReleaseYearMax}
                    genre={genre}
                    setGenre={setGenre}
                    language={language}
                    setLanguage={setLanguage}
                    handleSearch={handleSearch}
                    genres={genres}
                    languages={languages}
                    setSearchParams={setSearchParams}
                />
            </FadeContainer>
            {searchResults.length > 0 &&
                <>
                    <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
                    <div
                        className="mx-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 mb-5">
                        {loading ? (
                            Array.from({length: 6}).map((_) => (
                                <LoadingCardSkeleton/>
                            ))
                        ) : (
                            searchResults.map((movie) => (
                                <Card type={'movie'}
                                      img={<Link to={`/movie/${movie.id}`} className="block">
                                          <img className="w-full h-80 object-cover rounded-t-lg -z-20"
                                               src={movie.poster} alt="Film"/>
                                      </Link>}
                                      text={<div>
                                          <Link to={`/movie/${movie.id}`} className="block">
                                              <h2 className="px-4 py-2 text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{movie.title}</h2>
                                          </Link>
                                          <p className="text-base">{movie.release_year}</p></div>}
                                      element={`${movie}`}/>
                            ))
                        )
                        }
                    </div>
                </>
            }
        </>
    );
}

export default AdvancedSearch