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
import Spinner from '../components/Spinner';
import FeedbackMessage from '../components/FeedbackMessage';
import { createPortal } from 'react-dom';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const cardLoading = () => {
    return (
        Array.from({length: 6}).map(i => (
            <LoadingCardSkeleton key={i}/>
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
    const [isPrivate, setIsPrivate] = useState(true)
    const [uid, setUID] = useState(0)
    const [cardType, setCardType] = useState('')
    const [feedbackMessage, setFeedbackMessage] = useState('')
    const [showFeedback, setShowFeedback] = useState(false)
    const navigate = useNavigate();

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
        try {
            const response = await axios.get(`https://omdbapi.com/?apikey=${OMDB_API_KEY}&i=${IMDBId}`);
            return response.data.Poster;
        } catch (error) {
            console.error("Errore durante il recupero delle immagini: "+error)
        }

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
            setUID(res.data.user_id);
            setListName(res.data.name);
            setLikes(res.data.likes);
            setIsPrivate(res.data.private);
        }
        fetchMoviesDB();
    }, []);

    useEffect(() => {
        setIsLiked(likes.some(like => like.user_id === authState.userId));
    }, [likes])

    useEffect(() => {
        setCardType(authState.userId === uid ? "my-movie" : "movie");
    }, [uid])

    const showAndHideFeedbackMessage = (message, duration) => {
        setFeedbackMessage(message);
        setShowFeedback(true);

        setTimeout(() => {
            setShowFeedback(false);
            setFeedbackMessage('');
        }, duration);
    };

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
            showAndHideFeedbackMessage('Comment correctly published!', 2000)
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
        showAndHideFeedbackMessage('Movie correctly deleted from the list!', 2000)
    };

    const handleCommentDelete = () => {
        // Aggiornare lo stato refresh per forzare il render della CommentList
        setRefresh(!refresh);
    };


    return (
        <div className="mx-auto">

            {loading ? <div className='flex justify-center mt-4'><Spinner /></div> : ( <h1 className="mt-5 mb-5 text-4xl">{listName}</h1>)}           

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
                key="Filter"
                genres={genres}
                languages={languages}
                onGenreChange={setSelectedGenre}
                onLanguageChange={setSelectedLanguage}
                onStartYearChange={setStartYear}
                onEndYearChange={setEndYear}
            />

            <div
                className={`${loading ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : (filteredMovies.length === 0 ? 'flex justify-center items-center' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5')} mx-8 gap-8 mb-5`}>
                {loading ? (cardLoading()) : (
                    filteredMovies.length === 0 ? (
                        <div className="rounded-lg bg-sky-100 shadow-2xl p-4 text-center">
                            <p>No films with these filters.</p>
                        </div>
                    ) : (
                        filteredMovies.map((movie) => (
                            <div key={Math.random()} className='flex justify-center'>
                                <Card key={movie.id}
                                    classes={"flex flex-col justify-between hover:shadow-2xl transition duration-300 ease-in-out hover:scale-105 cursor-pointer w-52"}
                                    type={cardType}
                                    img={<Link to={`/movie/${movie.id}`} className="block">
                                        <img className="h-80 object-cover rounded-t-lg -z-20" src={movie.poster}
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
                <div className="container px-0 mx-auto mb-5 w-1/2">
                    <EditorComment onSubmit={handleCommentSubmit}/>
                </div>
                </>
            ) : null }

            {showFeedback && createPortal (
                            <FeedbackMessage
                                message={feedbackMessage}
                            />, document.body
            )}

        </div>
    );
}

SingleList.propTypes = {url: PropTypes.string.isRequired}

export default SingleList;