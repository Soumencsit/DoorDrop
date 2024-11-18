import React, { createContext, useEffect, useState } from "react";

export const Storecontext = createContext(null);

const StorecontextProvider = (props) => {


  const [userEmail,setUserEmail]=useState(
    localStorage.getItem("userEmail")||""
  )
  
  const [boxId,setBoxId]=useState(
    localStorage.getItem("boxId")
  )
  const [isLogin,setLogin]=useState(false)



  useEffect(() => {
    setBoxId('c04832f8-e3d5-4a43-8932-3131a4844ea2')

    localStorage.setItem("userEmail",userEmail)
    localStorage.setItem("boxId",boxId)
  }, [userEmail]);

  const contextValue = {
    userEmail,
    setUserEmail,
    boxId,
    setBoxId,
    isLogin,
    setLogin
  };

  return (
    <Storecontext.Provider value={contextValue}>
      {props.children}
    </Storecontext.Provider>
  );
};

export default StorecontextProvider;
