import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Testing from "./pages/Testing";
import Result from "./pages/Result";
import Select from "./pages/Select";

function App() {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/testing' element={<Testing/>}/>
                <Route path='/result' element={<Result/>}/>
                <Route path='/select' element={<Select/>}/>
            </Routes>
        </Router>
    );
}

export default App;