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
            <div className="mx-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 mb-5">
                {bestLists.map((list) => (
                        <Card img={<Link to={`/mylists/${list.id}`} className="block">
                            <div className="relative rounded-t-lg pb-80">
                                <img className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                                    src="https://img.freepik.com/free-vector/casting-call-abstract-concept-vector-illustration-open-call-models-commercial-shootings-photo-video-casting-modelling-agency-request-audition-brand-advertising-abstract-metaphor_335657-4165.jpg?w=740&t=st=1704554272~exp=1704554872~hmac=916b3767c735c328a768477449f8909ea9a9f4b65820ad5679fc467150362ba3"
                                    alt="List"/>
                            </div></Link>}
                            type={"best-lists"}
                            text={<h2
                                className="text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{list.name}</h2>
                            }
                            element={list}/>
                    ))}
            </div>
        </div>
    )
}

export default BestLists;