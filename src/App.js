import './App.css';

import Home from '../src/pages/Home'
import Chats from '../src/pages/Chats'

import { Route, Routes} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Routes>
         <Route exact path='/' element={<Home />}></Route>
         <Route exact path='/chats' element={<Chats/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
