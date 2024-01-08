import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../store/store';
import Cookies from 'js-cookie';
import SearchBar from './SearchBar';
import {RxHamburgerMenu} from 'react-icons/rx';
import Button from './Button';

const MenuItem = ({to, label, onClick}) => (
    <Link
        to={to}
        className="text-gray-700 px-4 py-2 text-sm"
        role="menuitem"
        tabIndex="-1"
        onClick={onClick}
    >
        {label}
    </Link>
);

const Navbar = ({title, links, backgroundColor}) => {
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const handleButtonClick = () => {
        if (authState.isAuth) {
            dispatch(logout());
            Cookies.remove('access-token');
            Cookies.remove('expiration');
            navigate('/');
        } else {
            navigate('/login');
            setShowMobileMenu(false)
        }
    };

    const linkElements = links.map((link, index) => (
        <Link
            key={index}
            to={link.url}
            className="mt-4 text-gray-200 hover:text-white mr-4 block lg:inline-block"
        >
            {link.text}
        </Link>
    ));

    return (
        <div>
            <nav
                className={`sticky flex items-center justify-between ${backgroundColor} p-2 flex-no-wrap relative top-0`}>
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <span className="font-semibold text-xl tracking-tight">{title}</span>
                </div>

                <div className="block lg:hidden">
                    <button
                        className="flex items-center px-3 py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        <RxHamburgerMenu size={24}/>
                    </button>
                </div>

                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto hidden lg:block">
                    <div className="text-sm lg:flex-grow">{linkElements}</div>

                    <div className="flex justify-end items-center">
                        <SearchBar/>

                        {authState.isAuth && (
                            <>
                                <div className="w-2" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} />
                                <div className="relative group pb-1" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                                    <Link to={`/profile`} >
                                        <img
                                            className="inline-block h-10 w-10 rounded-full"
                                            src={process.env.REACT_APP_BASE_URL+"/"+authState.photo}
                                            alt="Profile"
                                        />
                                    </Link>

                                    {isHovered && (
                                        <div
                                            className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none group-hover:block hidden">
                                            <div className="py-1" role="none">
                                                <MenuItem to={`/profile`} label="Account settings"/>
                                                <MenuItem label="Sign out" onClick={handleButtonClick}/>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="w-2"/>
                        {!authState.isAuth && <Button onClick={handleButtonClick} label="Login"/>}
                    </div>
                </div>
            </nav>

            {showMobileMenu && (
                <div className={`absolute w-full z-10 flex flex-col ${backgroundColor} p-8 justify-evenly items-center gap-2 lg:hidden`}>
                    <div className="text-sm ">{linkElements}</div>
                    <SearchBar/>
                    <div className="h-4"/>
                    {authState.isAuth && (
                        <>
                            <div className="relative group">
                                <Link to={`/profile`} onMouseEnter={() => setIsHovered(true)}
                                      onMouseLeave={() => setIsHovered(false)}>
                                    <img
                                        className="block h-20 w-20 rounded-full"
                                        src={process.env.REACT_APP_BASE_URL+"/"+authState.photo}
                                        alt="Profile"
                                    />
                                </Link>
                                <div className="h-4"/>
                                <Button onClick={handleButtonClick} label={"Sign out"} rounded={true}/>
                            </div>
                        </>
                    )}
                    {!authState.isAuth && <Button onClick={handleButtonClick} label="Login" rounded={true}/>}
                </div>
            )}
        </div>
    );
};

export default Navbar;
