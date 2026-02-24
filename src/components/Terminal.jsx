import React, {useState, useEffect, JSX } from "react";

function Terminal () {

    const bannerCondensed = "EYELINK"                                
                                                                                                                                                                                           

    return (
        <div>
            <div id="header" className="header">
                <div className="logodiv">
                    <a href="index.html"><img class="logo" src="https://n-o-d-e.live/images/logo.svg" /></a>

                    <div className="filter">
                    <a href="index.html">HOME</a>

                    <span className="footdogs">  / </span>
                    <a href="zine/index.html">ZINE</a>

                    <span className="footdogs">  / </span>
                    <a href="https://n-o-d-e.live">LIVE</a>

                    <span className="footdogs">  / </span>
                    <a href="https://n-o-d-e.net/rss/rss.xml">RSS</a>



                    <span className="footdogs">  / </span>
                    <a href="http://n-o-d-e.shop">SHOP</a>



                    </div>
                </div>
            </div>

        <div className="parent">
            <div className="div1">
                <div id="page" className="crt">
                    <div id="content">
                        <div className="title">
                        CYBER DUMP 72 / NEW VR HAND TRACKING, DEXTEROUS ROBOTS, SILENT BIONIC LEGS, OPEN SOURCE FACTORY
                        </div>

                
                        <div id="list">
                        <ul>
                            <li>
                                <a href="watch_mods3.html">
                                    <span className="tag">[HW]</span><span>EASY REMOVABLE MODS FOR THE CASIO F-91W</span>
                                </a>
                            </li>
                        </ul>

                            <div className="cardGrid">
                                <a href="/a" className="imgCard">
                                    <img src="/a.jpg" alt="A" className="imgCard__img" />
                                    <span className="imgCard__label">Card A</span>
                                </a>

                                <a href="/b" className="imgCard">
                                    <img src="/b.jpg" alt="B" className="imgCard__img" />
                                    <span className="imgCard__label">Card B</span>
                                </a>

                                <a href="/c" className="imgCard">
                                    <img src="/c.jpg" alt="C" className="imgCard__img" />
                                    <span className="imgCard__label">Card C</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
            <div className="div2"> 
                <div className="terminal-container">
                    <h1 className="terminal-banner">{bannerCondensed}</h1>
                </div>
            </div>
            <div className="div3"> 
                <div className="terminal-banner-container">
                    <h1 className="terminal-banner">{bannerCondensed}</h1>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Terminal