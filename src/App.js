import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Testing from "./pages/Testing";
import Result from "./pages/Result";
import Select from "./pages/Select";
import Summary from "./pages/Summary";
import Camera from "./pages/CameraComponent";
import {AnalysisProvider} from "./context/AnalysisContext";
import {CameraProvider} from "./context/CameraContext";

function App() {
    return (
        <CameraProvider>
            <AnalysisProvider>
                <Router>
                    <Navbar/>
                    <Routes>
                        <Route path='/' element={<Home/>}/>
                        <Route path='/testing' element={<Testing/>}/>
                        <Route path='/result' element={<Result/>}/>
                        <Route path='/select' element={<Select/>}/>
                        <Route path='/summary' element={<Summary/>}/>
                        <Route path='/camera' element={<Camera/>}/>
                    </Routes>
                </Router>
            </AnalysisProvider>
        </CameraProvider>
    );
}

export default App;