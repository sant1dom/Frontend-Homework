import api from "../utils/api";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import ListRow from "../components/ListRow";
import Cookies from "js-cookie";

const AdminListSearch = () => {

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);
    const [lists, setLists] = useState([]);
    const dispatch = useDispatch();

    const token = Cookies.get("access-token");
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    };

    useEffect(() => {
        console.log("Faccio partire la ricerca");

        api.get('/all_lists', config).then((response) => {

            dispatch({
                type: "hiddenState/clear",
                payload:
                    {
                        table: "list",
                    }
            });

            const tempLists = response.data.map((list) => {
                return <ListRow list={list} key={list.id}/>
            });
            setLists(tempLists);

        }).catch((error) => {
            console.log(error);
        });

    }, []);

    return (
        <div className="container mx-auto items-center justify-center">

            <div className="h-4"/>
            <h1 className="text-4xl font-bold">Lists found: {lists.length}</h1>
            <div className="h-4"/>

            <div>
                {lists}
            </div>

        </div>
    );
}

export default AdminListSearch;