import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';


const PrivateRoute = () => {
const  {currentUser} = useSelector((state) => state.user);
  return (
    <div>
      {
        currentUser ? (
            <Outlet/>
        ) : (
            <h1 className='text-lg font-semibold p-3 text-center'>Login before accessing this page!!</h1>
        )
      }
    </div>
  )
}

export default PrivateRoute
