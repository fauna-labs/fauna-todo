import {useState, useEffect} from "react";
import FaunaClient from "../Faunadoo";
import "../styling/TodoList.css";

export default function TodoList(props) {
    const db = new FaunaClient(props.userInfo.key);
    const [todos, setTodos] = useState([]);

    const getTodos = () => {
        db.query(`Todo.byUsername("${props.userInfo.username}").order(asc(.priority))`).then(result => {
            setTodos(result.data);
        })
    }

    useEffect(() => {
        getTodos();
    }, [props.newTodoCreated])

    const handleCheckboxChange = (e, todoId) => {
        const isChecked = e.target.checked;
        const updatedTodo = todos.find(todo => todo.id === todoId);
        updatedTodo.checked = isChecked;
        
        db.query(`
            let todo = Todo.byId("${todoId}")
            todo.update({checked: ${isChecked}})
        `).then(response => {
            getTodos();
        })
    }
    
    const handleDeleteTodo = (e, todoId) => {
        e.preventDefault();
        db.query(`
            let toBeDeleted = Todo.byId("${todoId}")
            toBeDeleted.delete();
        `).then(response => {
            getTodos();

        })
    }

    return (
        <div className="todoWrapper">
            {todos.map(todo => {
                return (
                    <div key={todo.id} className={`individualTodoWrapper priority-${todo.priority}`}>
                        <label className="checkboxLabel">
                            <input
                                type="checkbox"
                                checked={todo.checked}
                                onChange={e => handleCheckboxChange(e, todo.id)}
                            />
                            <span className={todo.checked ? 'checkboxText checkboxTextChecked' : 'checkboxText'}>
                                {todo.body}
                            </span>
                            <button className="deleteBtn" onClick={e => handleDeleteTodo(e, todo.id)}>X</button>
                        </label>
                    </div>           
                )
            })}
        </div>
    )
}