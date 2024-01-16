import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {useSelector} from "react-redux";
import api from "../utils/api";
import axios from 'axios';
import Filter from '../components/Filter';
import LoadingCardSkeleton from '../components/LoadingCardSkeleton';
import EditorComment from "../components/EditorComment";
import CommentList from '../components/CommentList';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { BiLike, BiSolidLike } from "react-icons/bi";
import {FaRegComment} from "react-icons/fa"
import Button from '../components/Button';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const cardLoading = () =>{ 
    return(
        Array.from({ length: 6 }).map((_) => (
        <LoadingCardSkeleton />
        ))
    )
}

const SingleList = ({url}) => {
    const authState = useSelector((state) => state.auth);
    const { id } = useParams();
    const [movies, setMovies] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [loading, setLoading] = useState(true);
    const token = Cookies.get("access-token");
    const [refresh, setRefresh] = useState(0)
    const [listName, setListName] = useState('')
    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([])
    const [isLiked, setIsLiked] = useState(false)

    // Array of unique genres and languages based on fetched movies
    const genres = [...new Set(movies.map((movie) => movie.genre))];
    const languages = [...new Set(movies.map((movie) => movie.language))];

    const filteredMovies = movies.filter((movie) => {
        const genreCondition = !selectedGenre || movie.genre === selectedGenre;
        const languageCondition = !selectedLanguage || movie.language === selectedLanguage;
        const startYearCondition = !startYear || parseInt(movie.release_year) >= parseInt(startYear);
        const endYearCondition = !endYear || parseInt(movie.release_year) <= parseInt(endYear);
    
    return genreCondition && languageCondition && startYearCondition && endYearCondition;
      });

    const fetchMoviePoster = async (IMDBId) => {
        const response = await axios.get(`http://omdbapi.com/?apikey=${OMDB_API_KEY}&i=${IMDBId}`);
        return response.data.Poster;
    };


    useEffect(() => {
        const fetchMoviesDB = async () => {
            let res = []
            if(token){
                res = await api.get(url + id, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
            }
            try {
                const moviesWithPosters = await Promise.all(res.data.movies.map(async (movie) => {
                    movie.poster = await fetchMoviePoster(movie.imdb_url.split('/')[4]);
                    return movie;
                }));
                setMovies(moviesWithPosters);
                setLoading(false);    
            } catch (error) {
                console.error(error);
            }
            setListName(res.data.name);
            setLikes(res.data.likes);
            setComments(res.data.comments);
        }
        fetchMoviesDB();
        console.log("state: ", isLiked)
    }, []);

    useEffect(() => {
        setIsLiked(likes.some(like => like.user_id === authState.userId));
    },[likes])
    
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
            <h1 className="mt-5 mb-5 text-4xl">{listName}</h1>

            <div className="flex space-x-4 justify-center items-center">
                <div className="flex items-center space-x-1">
                    <Button label={isLiked ? <BiSolidLike size={32} className='mr-1'/> : <BiLike size={32} className='mr-1'/>} variant='nobg' classes={"hover:shadow-none"}/>
                    {likes.length}
                </div>
            </div>

            <Filter
            genres={genres}
            languages={languages}
            onGenreChange={setSelectedGenre}
            onLanguageChange={setSelectedLanguage}
            onStartYearChange={setStartYear}
            onEndYearChange={setEndYear}
            />

            <div className="mx-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 mb-5">
                {loading ? (cardLoading()) : (
                    
                    filteredMovies.map((movie) => (
                    <div key={movie.id} className="rounded-lg bg-sky-100 shadow-2xl">
                        <Link to={`/movie/${movie.id}`} className="block">
                            <div className="relative rounded-t-lg pb-80">
                                <img className="absolute inset-0 w-full h-full object-cover rounded-t-lg" src={movie.poster} alt="Film" />
                            </div>
                        </Link>
                        <div className="p-4">
                            <Link to={`/movie/${movie.id}`} className="block">
                                <h2 className="text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{movie.title}</h2>
                            </Link>
                            <p className="text-base">{movie.release_year}</p>
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