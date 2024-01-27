import api from "../utils/api";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import AdminRowList from "../components/AdminRowList";
import Cookies from "js-cookie";
import AdminRowMovie from "../components/AdminRowMovie";

const AdminSearchList = () => {

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);
    const [lists, setLists] = useState([]);
    const dispatch = useDispatch();

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
        api.get('/all_lists', config).then((response) => {

            dispatch({
                type: "hiddenState/clear",
                payload:
                    {
                        table: "list",
                    }
            });

            const tempLists = response.data.map((list) => {
                if (!list.private && list.name.toLowerCase().includes(search.toLowerCase())) {
                    return <AdminRowList list={list} key={list.id}/>
                } else {
                    return <div key={list.id}></div>;
                }
            });
            setLists(tempLists);

        }).catch((error) => {
            console.log(error);
        });

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
                </p>
            }
            <div className="max-h-[650px] overflow-y-scroll  max-w-fit mx-auto no-scrollbar">
                {lists}
            </div>
        </div>
    );
}

export default AdminSearchList;