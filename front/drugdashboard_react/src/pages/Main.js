import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import config from '../config.json';

function Main() {
    const navigate = useNavigate();
    const [webNum, setWebNum] = useState(0);

    const webChangeButton = (num) => {
        setWebNum(num);
    };
    
    const routeButton = (routeState) => {
        if (routeState === 0) {
            navigate('/search', { state: {routeState:routeState}})
        }
        else if (routeState === 1) {
            navigate('/search', { state: {routeState:routeState}})
        }
        else if (routeState === 2) {
            navigate('/new')
        }
    };

    function clickManual() {

        window.open('/engine/DrugDashbaord_manual.pdf', '_blank');

    }

  return (
    <div id="main-parent">

        <div id="main__container">

            <div id="main__title-container">
                <img src="/logo_white.png" alt="logo" width="100" height="100"></img>
                <span id="main__title__text">SCDM Drug Dashboard</span>
            </div>

            {webNum===0 ? (
            <div id="main__item-container">
                <a href={config.homepage+'/engine/'} className="main__item">
                    <span className="main__item__title">Drug Search Engine</span>
                    <span className="main__item__text">약물 데이터 검색 서비스</span>
                </a>
                <div className="main__item" onClick={() => webChangeButton(1)}>
                    <span className="main__item__title">Additional functions</span>
                    <span className="main__item__text">추가 기능 (동시 처방 현황, ADR 등)</span>
                </div>
            </div>
            ):(
            <div id="main__item-container">
                <div onClick={() => webChangeButton(0)} style={{width:'0', height:'0', borderBottom:'40px solid transparent', borderTop:'40px solid transparent', borderLeft:'40px solid transparent', borderRight:'40px solid #EEEEEE'}}>
                </div>
                <div className="main__item" onClick={() => routeButton(0)}>
                    <span className="main__item__title">Polypharmacy Information</span>
                    <span className="main__item__text">약물 동시 처방 현황</span>
                </div>
                <div className="main__item" onClick={() => routeButton(1)}>
                    <span className="main__item__title">Adverse Drug Reaction</span>
                    <span className="main__item__text">약물별 검사 이상치 확인</span>
                </div>
                <div className="main__item" onClick={() => routeButton(2)}>
                    <span className="main__item__title">Recent prescription count</span>
                    <span className="main__item__text">연도별 처방 현황 확인</span>
                </div>
            </div>)}
        </div>

        <div id="main__top-menu-container">
            <div className="btn" style={{width:"132px", height: "40px", marginLeft:"12px"}} onClick={() => {clickManual()}}>Manual</div>
            <a href={config.homepage+'/engine/check'} className="btn" style={{width:"160px", height: "40px", marginLeft:"12px"}}>Health Check</a>
        </div>

        <div id="main__bottom-container">
            <div>서울대학교병원 융합의학과 의생명정보학연구실</div>
            <a id="main__bottom-container__link" href="https://sites.google.com/view/snuh-bmi-lab" target="_blank">SNUH BMI Lab</a>
        </div>

        <div className="background">
            <ul className="circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>

    </div>
  );
}

const home_container = {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column"
};

const home_content = {
    flex: "1",
    overflow: "auto",
    backgroundColor: "#EEEEEE",
    display: "flex"
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
export default Main;