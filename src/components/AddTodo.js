import { useState } from "react";
import FaunaClient from "../Faunadoo";
import "../styling/AddTodo.css";

export default function AddTodo(props) {
    const db = new FaunaClient(props.userInfo.key);
    const [todoDescription, setTodoDescription] = useState("");
    const [todoPriority, setTodoPriority] = useState(0);

    const todoDescriptionHandler = (e) => {
        setTodoDescription(e.target.value);
      }
    
      const priorityHandler = (e) => {
        setTodoPriority(e.target.value);
      }
    
      const createTodo = (e) => {
        e.preventDefault();
        db.query(`Todo.create({
            "name" : "${props.userInfo.username}",
            "body" : "${todoDescription}",
            "priority" : ${todoPriority},
            "checked" : false
        })`).then(result => {
            setTodoDescription("");
            props.setUpdatedTodo(result);
        });
      }
    
    return (
        <div className='addTodoBar'>
          <form onSubmit={createTodo}>
            <input className='input' placeholder='What do you need to take care of?' type="text" required onChange={todoDescriptionHandler} value={todoDescription}/>
            <label className='priority'>Priority:</label>
            <label>
              1
              <input type="radio" onChange={priorityHandler} value="1" name="priorityGroup" />
              <span className='checkmark'></span>
            </label>

            <label>
              2
              <input type="radio" onChange={priorityHandler} value="2" name="priorityGroup" />
              <span className='checkmark'></span>
            </label>

            <label>
              3
              <input type="radio" onChange={priorityHandler} value="3" name="priorityGroup" />
              <span className='checkmark'></span>              
            </label>

            <button className="btn" type="submit">Add Task</button>
          </form>
        </div>
    )
}