import api from "../utils/api";
import React, {useEffect, useRef, useState} from "react";
import AdminRowList from "../components/AdminRowList";
import Cookies from "js-cookie";

const AdminSearchList = () => {
	const [lists, setLists] = useState([]);

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
				const response = await api.get('/all_lists', config);

				const sl = search.toLowerCase();
				const tempLists = response.data
					.filter((list) => {
						return !list.private && list.name.toLowerCase().includes(sl);
					})
					.map((list) => {
						return <AdminRowList list={list} key={list.id}/>
					});

				setLists(tempLists);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, [search]);

	return (
		<div className="container mx-auto items-center justify-center">

			<div className="h-4"/>
			<h1 className="text-4xl font-bold">View and delete all lists</h1>
			<div className="h-4"/>

			<input type="text" ref={refSearch} onChange={onchangeSearch}
			       className="border-2 border-gray-300 rounded-md w-64 p-2"/>
			<div className="h-5"/>

			{lists.length == 0 &&
				<p className="text-3xl font-normal">
					No list found
					{search != "" &&
						<span> for <i>"{search}"</i></span>
					}
				</p>
			}
			<div className="max-h-[650px] overflow-y-scroll max-w-fit mx-auto no-scrollbar">
				{lists}
			</div>
		</div>
	);
}

export default AdminSearchList;