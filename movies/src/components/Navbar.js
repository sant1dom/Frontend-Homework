import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/store';
import Cookies from 'js-cookie';

const Navbar = ({ title, links, backgroundColor }) => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      className={`sticky flex items-center justify-between ${backgroundColor} p-6 flex-no-wrap relative top-0`}
    >
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">{title}</span>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">{linkElements}</div>
        <div className="flex justify-end">
          <Button onClick={handleButtonClick} label={authState.isAuth ? 'Logout' : 'Login/Register'} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
