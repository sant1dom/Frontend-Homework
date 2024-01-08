import { useEffect, useRef, useState } from 'react';

const FadeContainer = ({ show: showProp, children }) => {
  const [show, setShow] = useState(showProp);
  const [visible, setVisible] = useState(showProp);
  const timeoutRef = useRef();

  useEffect(() => {
    if (showProp) {
      setShow(true);
      timeoutRef.current = setTimeout(() => setVisible(true), 500);
    } else {
      timeoutRef.current = setTimeout(() => setShow(false), 1000);
      timeoutRef.current = setTimeout(() => setVisible(false), 500);
    }

    return () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null; // Clear the timeout reference to avoid memory leaks
    };
  }, [showProp]);

  return (
    <div
      className={`transition-opacity duration-500 ${ visible ? 'opacity-100' : 'opacity-0' }`}
        style={{ display: show ? 'block' : 'none' }}
    >
        {children}
    </div>
  );
};

export default FadeContainer;
