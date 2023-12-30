import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Button from './Button';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../store/store';
import Cookies from 'js-cookie';
import SearchBar from "./SearchBar";

const Navbar = ({title, links, backgroundColor}) => {
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const linkElements = links.map((link, index) => (
        <Link
            key={index}
            to={link.url}
            className="block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white mr-4"
        >
            {link.text}
        </Link>
    ));

    const handleButtonClick = () => {
        if (authState.isAuth) {
            dispatch(logout());
            Cookies.remove('access-token');
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    return (
        <nav
            className={`sticky flex items-center justify-between ${backgroundColor} p-2 flex-no-wrap relative top-0`}
        >
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight">{title}</span>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">{linkElements}</div>
                <div className="flex justify-end">
                    <SearchBar/>
                    {authState.isAuth && (
                        <>
                            <div className="w-2"/>
                            <div
                                className="relative group"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                style={{paddingBottom: '0.5rem'}}
                            >
                                <div className="flex items-center justify-center">
                                    <Link to={`/profile`}>
                                        <img
                                            className="inline-block h-10 w-10 rounded-full"
                                            src={authState.photo}
                                            alt="Profile"
                                        />
                                    </Link>
                                </div>
                                {isHovered && (
                                    <div
                                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none group-hover:block hidden"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="menu-button"
                                        tabIndex="-1"
                                    >
                                        <div className="py-1" role="none">
                                            <Link
                                                className="text-gray-700 block px-4 py-2 text-sm"
                                                role="menuitem"
                                                tabIndex="-1"
                                                id="menu-item-0"
                                                to={`/profile`}
                                            >
                                                Account settings
                                            </Link>
                                            <Button
                                                role="menuitem"
                                                tabIndex="-1"
                                                id="menu-item-3"
                                                label={"Sign out"}
                                                onClick={handleButtonClick}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )
                    }
                    <div className="w-2"/>
                    {!authState.isAuth && <Button onClick={handleButtonClick} label={"Login"}/>}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
