import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();

  return (
    <div style={header_container}>
        <a style={header_title} onClick={() => navigate('/', {replace: true})}>SCDM Drug Search Engine</a>
    </div>
  );
}

const header_container = {
    width: "100%",
    height: "70px",
    backgroundColor: "#009691",
    zIndex: "1",

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
}

const header_title = {
    fontSize: "20px",
    fontWeight: "700",
    textDecoration: "none",
    color: "#FAFAFA",
    cursor: "pointer",
    marginLeft: "30px",
    marginRight: "100px"
}
export default Header;