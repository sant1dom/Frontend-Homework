import React, {useCallback, useMemo, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../store/store';
import Cookies from 'js-cookie';
import SearchBar from './SearchBar';
import {RxHamburgerMenu} from 'react-icons/rx';
import Button from './Button';
import Spinner from "./Spinner";


const Navbar = ({title, links, links_admin, backgroundColor, loading}) => {
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isHoveredProfile, setIsHoveredProfile] = useState(false);
    const [isHoveredAdmin, setIsHoveredAdmin] = useState(false);
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
        const profileImageUrl = `${process.env.REACT_APP_BASE_URL + authState.photo}`;
        return (
            <Link to={`/profile`}
                  onClick={() => {
                      setShowMobileMenu(false);
                  }}
            >
                <img
                    className="block h-20 w-20 rounded-full text-white"
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

    const linkElementsAdmin = useMemo(() => links_admin.map((link) => (
        <>
            <MenuItem
                key={link.url}
                to={link.url}
                className="mt-4 text-gray-200 hover:text-white mr-4 block lg:inline-block text-left "
                label={link.text}
            >
            </MenuItem>
            <br/>
        </>
    )), [links_admin]);

    const linkElementsMobile = useMemo(() => links.concat(links_admin).map((link) => (
        <Link
            key={link.url}
            to={link.url}
            className="mt-4 text-gray-200 hover:text-white mr-4 block lg:inline-block"
        >
            {link.text}
        </Link>
    )), [links]);

    const DropdownProfile = (
        isHoveredProfile &&
        <div
            className="absolute right-0 z-10 mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none group-hover:block"
        >
            <div className="py-1" role="none">
                <MenuItem to={`/profile`} label="Account settings"/>
                <MenuItem label="Sign out" onClick={handleButtonClick}/>
            </div>
        </div>
    );

    const DropdownAdmin = (
        isHoveredAdmin &&
        <div
            className="absolute py-1 z-10 mt-1 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none group-hover:block"
            style={{"margin-left": "45%"}}
            onMouseEnter={() => setIsHoveredAdmin(true)}
            onMouseLeave={() => setIsHoveredAdmin(false)}
        >
            {linkElementsAdmin}
        </div>
    );

    return (
        <div className={`sticky ${backgroundColor} top-0 z-50`}>
            <nav
                className={`sticky flex items-center justify-between ${backgroundColor} p-2 flex-no-wrap relative top-0`}>
                <Link to={`/`}>
                    <div className="flex items-center flex-shrink-0 text-white mr-6">
                        <img src={process.env.PUBLIC_URL + '/Screenshot_2024-01-10_195526.png'} alt="Logo"
                             className="h-10"/>
                    </div>
                </Link>

                <div className="block lg:hidden">
                    <button
                        className="flex items-center px-3 py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        <RxHamburgerMenu size={24}/>
                    </button>
                </div>

                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto hidden lg:block">
                    <div className="text-sm lg:flex-grow">
                        {linkElements}

                        {links_admin.length > 0 &&
                            <div
                                className="mt-4 text-gray-200 hover:text-white mr-4 block lg:inline-block cursor-pointer"
                                onMouseEnter={() => setIsHoveredAdmin(true)}
                                onMouseLeave={() => setIsHoveredAdmin(false)}>
                                Admin
                            </div>
                        }

                        {DropdownAdmin}
                    </div>

                    <div className="flex justify-end items-center">
                        <SearchBar setShowMobileMenu={setShowMobileMenu}/>

                        {loading ? <><div className={"w-2"}/><Spinner/></> : <>{authState.isAuth ? (
                            <>
                                <div className="w-2" onMouseEnter={() => setIsHoveredProfile(true)}
                                     onMouseLeave={() => setIsHoveredProfile(false)}/>
                                <div className="relative group pb-1" onMouseEnter={() => setIsHoveredProfile(true)}
                                     onMouseLeave={() => setIsHoveredProfile(false)}>
                                    <Link to={`/profile`}>
                                        <img
                                            className="inline-block h-10 w-10 rounded-full text-white"
                                            src={process.env.REACT_APP_BASE_URL + authState.photo}
                                            alt="Profile"
                                        />
                                    </Link>
                                    {DropdownProfile}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={"w-2"}/>
                                <Button onClick={handleButtonClick} label="Login" rounded={true}/>
                            </>
                        )}</>
                        }
                    </div>
                </div>
            </nav>

            {showMobileMenu && (
                <MobileMenu
                    backgroundColor={backgroundColor}
                    linkElements={linkElementsMobile}
                    authState={authState}
                    handleButtonClick={handleButtonClick}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default Navbar;