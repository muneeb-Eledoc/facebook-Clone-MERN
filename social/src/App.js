import './App.scss';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Signup from './components/Signup';
import Messenger from './components/messenger/Messenger';

function App() {
  return (
    <div>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={ <Signup/> } />
            <Route path="/login" element={ <Login/> } />
            <Route path="/profile/:username" element={ <Profile/> } />
            <Route path="/" element={ <Home/> } />
            <Route path="/messenger" element={ <Messenger/> } />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
