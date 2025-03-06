import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import AddBook from './pages/BookCreate';
import BookDetails from './pages/BookDetails';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ForgotPassword from './pages/ForgotPassword';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Dashboard/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/add-book' element={<AddBook/>}/>
                <Route path='/details-book/:id' element={<BookDetails/>}/>
                <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes> 
        </Router>
    );
}

export default App;
