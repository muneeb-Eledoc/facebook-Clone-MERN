import React, { useState, useContext, useEffect} from 'react'
import Feed from './Feed'
import Navbar from './navbar/Navbar'
import RightBar from './RightBar'
import Sidebar from './Sidebar'

export default function Home() {
    return (
        <div>
            <Navbar/>
            <div className="mainContainer">
                <Sidebar/>
                    <Feed/>
                    <RightBar/>
            </div>
        </div>
    )
}
