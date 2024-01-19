import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {useSelector} from "react-redux";
import api from "../utils/api";
import axios from 'axios';
import Filter from '../components/Filter';
import LoadingCardSkeleton from '../components/LoadingCardSkeleton';
import EditorComment from "../components/EditorComment";
import CommentList from '../components/CommentList';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import {BiLike, BiSolidLike} from "react-icons/bi";
import Button from '../components/Button';
import Card from '../components/Card';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const cardLoading = () => {
    return (
        Array.from({length: 6}).map((_) => (
            <LoadingCardSkeleton/>
        ))
    )
}

const SingleList = ({url}) => {
    const authState = useSelector((state) => state.auth);
    const {id} = useParams();
    const [movies, setMovies] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [loading, setLoading] = useState(true);
    const token = Cookies.get("access-token");
    const [refresh, setRefresh] = useState(true)
    const [listName, setListName] = useState('')
    const [likes, setLikes] = useState([])
    const [isLiked, setIsLiked] = useState(false)
    const [isPrivate, setIsPrivate] = useState(false)
    const navigate = useNavigate();

    const genres = [...new Set(movies.map((movie) => movie.genre))];
    const languages = [...new Set(movies.map((movie) => movie.language))];

    const cardType = url === "/mylists/" ? "my-movie" : "movie";

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
            if (token) {
                try {
                    res = await api.get(url + id, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                } catch (error) {
                    console.error(error);
                    navigate('/404');
                    return;
                }
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
            setIsPrivate(res.data.private);
        }
        fetchMoviesDB();
    }, []);

    useEffect(() => {
        setIsLiked(likes.some(like => like.user_id === authState.userId));
    }, [likes])

    const handleCommentSubmit = async (comment) => {
        if (token) {
            await api.post('/comment/' + id, null,
                {
                    params: {comment},
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
            setRefresh(!refresh);
        }

    }

    const handleLike = async () => {
        try {
            if (token) {
                if (!isLiked) {
                    await api.post('/like/' + id, null,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            }
                        });
                    setIsLiked(true)
                    likes.push(Object);
                } else {
                    await api.delete('/like/' + id,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            }
                        });
                    setIsLiked(false)
                    likes.pop(Object);
                }
            }
        } catch (error) {
            console.error('Errore: ', error);
        }
    }

    const removeMovieFromList = async (movieId) => {
        if (token) {
            try {
                await api.delete(`/mylists/${id}/${movieId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== movieId));
            } catch (error) {
                console.error('Errore nella rimozione del film dalla lista:', error);
            }
        }
    };

    const handleCommentDelete = () => {
        // Aggiornare lo stato refresh per forzare il render della CommentList
        setRefresh(!refresh);
    };
    

    return (
        <div className="mx-auto">
            <h1 className="mt-5 mb-5 text-4xl">{listName}</h1>

            { !isPrivate ? (
                <div className="flex space-x-4 justify-center items-center">
                    <div className="flex items-center space-x-1">
                        <Button
                            label={isLiked ? <BiSolidLike size={32} className='mr-1'/> : <BiLike size={32} className='mr-1'/>}
                            variant='nobg'
                            classes={"hover:shadow-none"}
                            onClick={handleLike}
                        />
                        {likes.length}
                    </div>
                </div>
            ) : null }

            <Filter
                genres={genres}
                languages={languages}
                onGenreChange={setSelectedGenre}
                onLanguageChange={setSelectedLanguage}
                onStartYearChange={setStartYear}
                onEndYearChange={setEndYear}
            />

            <div
                className={`${loading ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' : (filteredMovies.length === 0 ? 'flex justify-center items-center' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6')} mx-8 gap-8 mb-5`}>
                {loading ? (cardLoading()) : (
                    filteredMovies.length === 0 ? (
                        <div className="rounded-lg bg-sky-100 shadow-2xl p-4 text-center">
                            <p>No films with these filters.</p>
                        </div>
                    ) : (
                        filteredMovies.map((movie) => (
                            <div key={Math.random()}>
                                <Card key={movie.id}
                                    classes={" flex flex-col justify-between hover:shadow-2xl transition duration-300 ease-in-out hover:scale-105 cursor-pointer"}
                                    type={cardType}
                                    img={<Link to={`/movie/${movie.id}`} className="block">
                                        <img className="w-full h-80 object-cover rounded-t-lg -z-20" src={movie.poster}
                                            alt="Film"/>
                                    </Link>}
                                    text={<div>
                                        <Link to={`/movie/${movie.id}`} className="block">
                                            <h2 className="px-4 py-2 text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{movie.title}</h2>
                                        </Link>
                                        <p className="text-base">{movie.release_year}</p></div>}
                                    element={movie}
                                    removeMovieFromList={removeMovieFromList}/>
                            </div>
                        )))
                )}
            </div>

            { !isPrivate ? (
                <>
                <h1 className="mt-5 mb-5 text-2xl">Comments section</h1>
                <CommentList id={id} refresh={refresh} onCommentDelete={handleCommentDelete}/>

                <h1 className="mt-5 mb-5 text-2xl">Add a comment</h1>
                <div className="container px-0 mx-auto sm:px-5 mb-5 w-1/2">
                    <EditorComment onSubmit={handleCommentSubmit}/>
                </div>
                </>
            ) : null }

        </div>
    );
}

SingleList.propTypes = {url: PropTypes.string.isRequired}

export default SingleList;