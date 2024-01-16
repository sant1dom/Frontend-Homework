import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from "../utils/api";
import axios from 'axios';
import Filter from '../components/Filter';
import LoadingCardSkeleton from '../components/LoadingCardSkeleton';
import Comment from '../components/Comment';
import EditorComment from "../components/EditorComment";
import CommentList from '../components/CommentList';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const SingleList = ({url}) => {
    const { id } = useParams();
    const [movies, setMovies] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [loading, setLoading] = useState(true);
    const token = Cookies.get("access-token");
    const [refresh, setRefresh] = useState(0)

    // Array of unique genres and languages based on fetched movies
    const genres = [...new Set(movies.map((movie) => movie.data.genre))];
    const languages = [...new Set(movies.map((movie) => movie.data.language))];

    const filteredMovies = movies.filter((movie) => {
        const genreCondition = !selectedGenre || movie.data.genre === selectedGenre;
        const languageCondition = !selectedLanguage || movie.data.language === selectedLanguage;
        const startYearCondition = !startYear || parseInt(movie.data.release_year) >= parseInt(startYear);
        const endYearCondition = !endYear || parseInt(movie.data.release_year) <= parseInt(endYear);
    
    return genreCondition && languageCondition && startYearCondition && endYearCondition;
      });

    const fetchMoviePoster = async (IMDBId) => {
        const response = await axios.get(`http://omdbapi.com/?apikey=${OMDB_API_KEY}&i=${IMDBId}`);
        return response.data.Poster;
    };

    const localStorageLists = () => {
        const lists = [];

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const items = JSON.parse(localStorage.getItem(key)) || [];
       
          lists.push({
            name: key,
            items: items
          });
        }
       
        return lists;
    }
       
    function fetchMovies(name) {
        const list = localStorageLists().find(list => list.name.toLowerCase() === name.toLowerCase());
        
        if (!list) {
            console.error('Collection not found');
            return;
        }
        
        const res = list.items.map(key => api.get('/movies/' + key));
        return res;
    }

    const fetchMoviesDB = async () => {
        let res = []
        if(token){
            res = await api.get(url + id, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
        }
        console.log("DBMovies: ", res);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const movies = fetchMovies(listname);
                const DBMovies = fetchMoviesDB();
                const items = await Promise.all(DBMovies);
                const moviesWithPosters = await Promise.all(items.map(async (movie) => {
                    movie.poster = await fetchMoviePoster(movie.data.imdb_url.split('/')[4]);
                    return movie;
                }));
                setMovies(moviesWithPosters);  
                setLoading(false);    
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    
    const handleCommentSubmit = async (comment) => {
        if (token) {
            api.post('/comment/' + id, null, 
                {
                    params: { comment },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
        }
        setRefresh(Math.random());
    }

    return(
        <div className="mx-auto">
            <h1 className="mt-5 mb-5 text-4xl">{id}</h1>
            <Filter
            genres={genres}
            languages={languages}
            onGenreChange={setSelectedGenre}
            onLanguageChange={setSelectedLanguage}
            onStartYearChange={setStartYear}
            onEndYearChange={setEndYear}
        />
            <div className="mx-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 mb-5">
                {loading ? (
                    Array.from({ length: 1 }).map((_) => (
                        <LoadingCardSkeleton />
                    ))
                    ) : (filteredMovies.map((movie) => (
                    <div key={movie.data.id} className="rounded-lg bg-sky-100 shadow-2xl">
                        <Link to={`/movie/${movie.data.id}`} className="block">
                            <div className="relative rounded-t-lg pb-80">
                                <img className="absolute inset-0 w-full h-full object-cover rounded-t-lg" src={movie.poster} alt="Film" />
                            </div>
                        </Link>
                        <div className="p-4">
                            <Link to={`/movie/${movie.data.id}`} className="block">
                                <h2 className="text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{movie.data.title}</h2>
                            </Link>
                            <p className="text-base">{movie.data.release_year}</p>
                        </div>
                    </div>
                 ))
                    )
                }
            </div>

            <h1 className="mt-5 mb-5 text-2xl">Comments section</h1>
            <CommentList id={id} refresh={refresh} />

            <h1 className="mt-5 mb-5 text-2xl">Add a comment</h1>
            <div className="container px-0 mx-auto sm:px-5 mb-5 w-1/2">
                <EditorComment onSubmit={handleCommentSubmit}/>
            </div>

        </div>
    );
}

SingleList.propTypes = {url: PropTypes.string.isRequired}

export default SingleList;