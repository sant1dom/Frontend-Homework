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


    const handleSearch = async (term) => {
        setSearch(term);
        console.log("searching for " + term);
        const token = Cookies.get("access-token");
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        };
        try {
            const response = await api.get('/all_lists', config);
            const sl = search.toLowerCase();

            let tempLists = await Promise.all(response.data
                .map(async (list) => {
                    const response_author = await api.get('/users/' + list.user_id, config);
                    list.author = response_author.data.email;
                    list.avatar = process.env.REACT_APP_BASE_URL + response_author.data.image;
                    return list;
                }));

            tempLists = tempLists.filter((list) => {
                return list.author.toLowerCase().includes(sl) || list.name.toLowerCase().includes(sl);
            });

            setLists(tempLists);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleSearch(search);
    }, [search]);

    useEffect(() => {
const token = Cookies.get("access-token");
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        };
        async function fetchData() {
            try {
                const response = await api.get('/all_lists', config);
                const sl = search.toLowerCase();

                let tempLists = await Promise.all(response.data
                    .map(async (list) => {
                        const response_author = await api.get('/users/' + list.user_id, config);
                        list.author = response_author.data.email;
                        list.avatar = process.env.REACT_APP_BASE_URL + response_author.data.image;
                        return list;
                    }));

                tempLists = tempLists.filter((list) => {
                    return list.author.toLowerCase().includes(sl) || list.name.toLowerCase().includes(sl);
                });

                setLists(tempLists);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, []);


    return (
        <div className="container mx-auto items-center justify-center">

            <div className="h-4"/>
            <h1 className="text-4xl font-bold">View and delete all lists</h1>
            <div className="h-4"/>

            <input type="text" ref={refSearch} onChange={onchangeSearch} placeholder="Search"
                   className="border-2 border-gray-300 rounded-md w-64 p-2"/>
            <div className="h-5"/>

            {lists.length === 0 &&
                <p className="text-3xl font-normal">
                    No list found
                    {search !== "" &&
                        <span> for <i>"{search}"</i></span>
                    }
                </p>
            }
            <div className="max-h-[600px] overflow-y-scroll max-w-fit mx-auto no-scrollbar">
                {lists.map((list) => (
                    <AdminRowList list={list} key={list.id}/>
                ))}
            </div>
        </div>
    );
}

export default AdminSearchList;