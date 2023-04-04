import './App.css';
import { useState, useEffect} from "react";
import Login from './components/Login';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';

export default function App() {
  const [displayLogin, setDisplayLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [loggedin, setLoggedin] = useState(false);
  const localStorageExists = JSON.parse(localStorage.getItem("todo-loggedInUser"));
  const [updatedTodo, setUpdatedTodo] = useState();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const localStorageExists = JSON.parse(localStorage.getItem("todo-loggedInUser"));
    
    if (localStorageExists == null) {
          setLoggedin(false);
       } else {
           setLoggedin(true);
           setUsername(localStorageExists.username);
       }
  }

  const displayLoginHandler = (e) => {
    e.preventDefault();
    setDisplayLogin(!displayLogin);
  }

  const stopDisplayingLoginForm = (response) => {
    setDisplayLogin(response);
    checkLoginStatus();
  }

  const getNewTodo = (response) => {
    setUpdatedTodo(response);
  }

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("todo-loggedInUser");
    window.location.href = "/"
  }

  return (
    <div className="App">

      <div className='topBar'>
        {username != "" ? (
          <>
            <h1>Welcome {username}</h1>  
            <button className='logoutBtn' onClick={handleLogout}>log out?</button>        
          </>
        ) : (<button className='welcomeBtn' onClick={displayLoginHandler}><h1>Hello, please login to use this Todo app</h1></button>) }
      </div>

      {displayLogin ? (<Login confirmLogin = {stopDisplayingLoginForm} />) : null}

      {loggedin ? (
        <>
          <AddTodo userInfo = {localStorageExists} setUpdatedTodo={getNewTodo}/>
          <TodoList userInfo= {localStorageExists} newTodoCreated={updatedTodo}/>     
        </>

      ) : null}

    </div>
  );
}
