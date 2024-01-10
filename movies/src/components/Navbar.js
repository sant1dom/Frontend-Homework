import React, {useCallback, useMemo, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../store/store';
import Cookies from 'js-cookie';
import SearchBar from './SearchBar';
import {RxHamburgerMenu} from 'react-icons/rx';
import Button from './Button';
import Spinner from "./Spinner";


const Navbar = ({title, links, backgroundColor, loading}) => {
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const MenuItem = React.memo(({to, label, onClick}) => (
        <Link
            to={to}
            className="text-gray-700 px-4 py-2 text-sm"
            role="menuitem"
            tabIndex="-1"
            onClick={onClick}
        >
            {label}
        </Link>
    ));

    const ProfileDropdown = ({isHovered, handleButtonClick}) => (
        isHovered && (
            <div
                className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none group-hover:block hidden"
            >
                <div className="py-1" role="none">
                    <MenuItem to={`/profile`} label="Account settings"/>
                    <MenuItem label="Sign out" onClick={handleButtonClick}/>
                </div>
            </div>
        )
    );

    const MobileMenu = ({backgroundColor, linkElements, authState, handleButtonClick, loading}) => (
        <div
            className={`absolute w-full z-10 flex flex-col ${backgroundColor} p-8 justify-evenly items-center gap-2 lg:hidden`}
        >
            <div className="text-sm" onClick={() => setShowMobileMenu(false)}>{linkElements}</div>
            <SearchBar setShowMobileMenu={setShowMobileMenu}/>
            <div className="h-4"/>
            {authState.isAuth ? (
                <>
                    <ProfileImageLink authState={authState}/>
                    <div className="h-4"/>
                    <Button onClick={handleButtonClick} label={"Sign out"} rounded={true}/>
                </>
            ) : (
                <>
                    {loading ? <Spinner/> : <Button onClick={handleButtonClick} label="Login" rounded={true}/>}
                </>
            )}
        </div>
    );

    const ProfileImageLink = React.memo(({authState}) => {
        const profileImageUrl = `${process.env.REACT_APP_BASE_URL + "/" + authState.photo}`;
        return (
            <Link to={`/profile`}
                  onClick={() => {
                      setShowMobileMenu(false);
                  }}
            >
                <img
                    className="block h-20 w-20 rounded-full"
                    src={profileImageUrl}
                    alt="Profile"
                />
            </Link>
        );
    });


    const handleButtonClick = useCallback(() => {
        if (authState.isAuth) {
            dispatch(logout());
            Cookies.remove('access-token');
            Cookies.remove('expiration');
            navigate('/');
        } else {
            navigate('/login');
            setShowMobileMenu(false);
        }
        setShowMobileMenu(false);
    }, [authState.isAuth, dispatch, navigate]);

    const linkElements = useMemo(() => links.map((link) => (
        <Link
            key={link.url}
            to={link.url}
            className="mt-4 text-gray-200 hover:text-white mr-4 block lg:inline-block"
        >
            {link.text}
        </Link>
    )), [links]);

    return (
        <div className={`sticky ${backgroundColor} top-0`}>
            <nav
                className={`sticky flex items-center justify-between ${backgroundColor} p-2 flex-no-wrap relative top-0`}>
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <img src={process.env.PUBLIC_URL + '/Screenshot_2024-01-10_195526.png'} alt="Logo" className="h-10"/>
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
                        <SearchBar setShowMobileMenu={setShowMobileMenu}/>

                        {authState.isAuth && (
                            <>
                                <div className="w-2" onMouseEnter={() => setIsHovered(true)}
                                     onMouseLeave={() => setIsHovered(false)}/>
                                <div className="relative group pb-1" onMouseEnter={() => setIsHovered(true)}
                                     onMouseLeave={() => setIsHovered(false)}>
                                    <Link to={`/profile`}>
                                        <img
                                            className="inline-block h-10 w-10 rounded-full"
                                            src={process.env.REACT_APP_BASE_URL + "/" + authState.photo}
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
                        {loading && <Spinner/>}
                        {!loading && !authState.isAuth && <Button onClick={handleButtonClick} label="Login"/>}
                    </div>
                </div>
            </nav>

            {showMobileMenu && (
                <MobileMenu
                    backgroundColor={backgroundColor}
                    linkElements={linkElements}
                    authState={authState}
                    handleButtonClick={handleButtonClick}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default Navbar;