import api from "../utils/api";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import AdminMovie from "../components/AdminMovie";

const AdminSearch = () => {

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);
    const [movies, setMovies] = useState([]);
    const [phase, setPhase] = useState("Loading");

    useEffect(() => {
        if (!authState.is_superuser) {
            navigate('/');
            return;
        }

        api.get('/movies').then((response) => {
            console.log(response.data);
            setPhase("Loaded " + response.data.length + " movies")

            const tempMovies = response.data.map((movie) => {
                return <AdminMovie movie={movie} key={movie.id}/>
            });
            console.log(tempMovies);
            setMovies(tempMovies);

        }).catch((error) => {
            console.log(error);
        });

    }, []);

    if (!authState.is_superuser) {
        return (<></>);
    }

    return (
        <div className="container mx-auto">
            <div class="container">
                <Link
                    key='admin/create'
                    to='/admin/create'
                >
                        Add a new film
                </Link>

                <h4>or</h4>

                <h2>Edit/Delete existing films</h2>

                <div class="order_details_table">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                            <tr>
                                <th scope="col">Film</th>
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                            </tr>
                            </thead>
                            <tbody id="lista">
                                {movies}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminSearch;