import api from "../utils/api";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import AdminRowList from "../components/AdminRowList";
import Cookies from "js-cookie";

const AdminSearchList = () => {

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
                if (list.private) return <div key={list.id}></div>;
                return <AdminRowList list={list} key={list.id}/>
            });
            setLists(tempLists);

        }).catch((error) => {
            console.log(error);
        });

    }, []);

    return (
        <div className="container mx-auto items-center justify-center">

            <div className="h-4"/>
            <h1 className="text-4xl font-bold">View and delete all lists</h1>
            <div className="h-4"/>

            {lists.length == 0 &&
                <p className="text-3xl font-normal">
                    No list found
                </p>
            }
            <div className="max-h-[650px] overflow-y-scroll  max-w-fit mx-auto">
                {lists}
            </div>
        </div>
    );
}

export default AdminSearchList;