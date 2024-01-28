import api from "../utils/api";
import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import AdminRowMovie from "../components/AdminRowMovie";
import Cookies from "js-cookie";
import Button from "../components/Button";

const AdminSearchMovie = () => {
	const [movies, setMovies] = useState([]);

	const [search, setSearch] = useState('');
	const refSearch = useRef();
	const onchangeSearch = () => {
		setSearch(refSearch.current.value);
	};

	const token = Cookies.get("access-token");
	const config = {
		headers: {
			'Authorization': `Bearer ${token}`,
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get('/movies', config);

				const sl = search.toLowerCase();
				const tempMovies = response.data
					.filter((movie) => {
						return movie.title.toLowerCase().includes(sl);
					})
					.map((movie) => {
						return <AdminRowMovie movie={movie} key={movie.id}/>
					});

				setMovies(tempMovies);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, [search]);

	return (
		<div className="container mx-auto items-center justify-center">

			<div className="h-4"/>
			<h1 className="text-4xl font-bold">Edit and delete all movies</h1>
			<div className="h-4"/>

			<Link to={`/admin/movie/create`}>
				<Button
					rounded={true}
					label="Add a new movie"
				/>
			</Link>
			<div className="h-4"/>

			<input type="text" ref={refSearch} onChange={onchangeSearch}
			       className="border-2 border-gray-300 rounded-md w-64 p-2"/>
			<div className="h-5"/>

			{movies.length === 0 &&
				<p className="text-3xl font-normal">
					No movie found
					{search != "" &&
						<span> for <i>"{search}"</i></span>
					}
				</p>
			}
			<div className="max-h-[650px] overflow-y-scroll  max-w-fit mx-auto no-scrollbar">
				{movies}
			</div>
		</div>
	);
}

export default AdminSearchMovie;