import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Card from "../components/Card";
import Cookies from 'js-cookie';
import api from '../utils/api';

const BestLists = () => {
    const [bestLists, setBestLists] = useState([]);
    const token = Cookies.get("access-token");
    
    useEffect(() => {
        if (token) {
            api.get("/most_liked_lists",
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }).then((response) => {
                    setBestLists(response.data);
                }
            )
        }
    }, []);

    return(
        <div className='container'>
            <h1 className="mt-5 mb-5 text-4xl">Best Lists</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {bestLists.map((list) => (
                    <div key={Math.random()} className='flex justify-center'>
                        <Card
                            classes={" flex flex-col justify-between hover:shadow-2xl transition duration-300 ease-in-out hover:scale-105 cursor-pointer w-60"}
                            type={"best-lists"}
                            text={<h2
                                className="text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{list.name}</h2>
                            }
                            element={list}/>
                    </div>
                    ))}
            </div>
        </div>
    )
}

export default BestLists;