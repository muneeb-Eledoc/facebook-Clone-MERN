import React, { lazy, Suspense, useContext, useEffect} from 'react'
// import Post from './Post/Post'
import Share from './share/Share'
import { AuthContext } from '../context/authContext/AuthContext';
import { PostContext } from '../context/postContext/PostContext';
import { getPosts } from '../context/postContext/apiCalls';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
const Post = lazy(() => import('./Post/Post'));

export default function Feed({username}) {
    const {user} = useContext(AuthContext)
    const {isFetching, posts, dispatch} = useContext(PostContext)
    const navigate = useNavigate()
    useEffect(() => {
        !localStorage.getItem("token") && navigate("/login")
        Object.keys(user).length !== 0 && getPosts(username, user._id, dispatch)
    }, [username, user && user._id, dispatch])
    console.log(posts)
    return (
        <div className='feed'>
            <div className="feedWrapper">
                <Suspense fallback={<CircularProgress sx={{display: "block", margin: "auto"}}/>}>
                    {username ? username == user.username && <Share/> : <Share/>}
                    { posts?.sort((p1, p2) => {
                        return new Date(p2.createdAt) - new Date(p1.createdAt);
                    })?.map((post, i)=> <Post key={i} post={post}/>) }
                </Suspense>
                    {isFetching && <CircularProgress sx={{display: "block", margin: "auto"}}/>}
            </div>
        </div>
    )
}
