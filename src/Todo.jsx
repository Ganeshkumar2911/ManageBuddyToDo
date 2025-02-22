import "./Todo.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPerson, faPlus, faTrash , faFilePen} from '@fortawesome/free-solid-svg-icons'
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import log from './assets/log.jpg'
import SendIcon from '@mui/icons-material/Send';
import { getUserData, createUser, addList, addTask, deleteList, deleteTask, updateListName } from "./indexeddb";

export default function Todo({userEmail}) {
    let [listName, setListName] = useState("");
    let [task, setTask] = useState("");
    const[todoData, setTodoData] =useState(null);
    const [selectedList, setSelectedList] = useState("");
    const [completedTasks, setCompletedTasks] = useState({}); 

    const[email,setEmail] = useState(userEmail || localStorage.getItem("userEmail") || "Guest");

    useEffect(() => {
        setEmail(userEmail || localStorage.getItem("userEmail") || "Guest");
        getUserData(email)
            .then((data) => {
                if (data) {
                    setTodoData(data);
                } else {
                    createUser(email).then(setTodoData);
                }
            })
            .catch((error) => console.error("IndexedDB error:", error));
    }, [userEmail]);

    const handelClick = () => {
        if(!listName) return alert("Enter a list name!");

        addList(email, listName).then((updateData)=> {
                setTodoData(updateData);
                setListName("");
        }).catch((error) => console.error(error));

    };

    const handelClick1 = () => {
        if (!selectedList) return alert("Select a list first!");
        if (!task) return alert("Enter a task!");

        addTask(email, selectedList, task).then((updatedData) => {
            setTodoData(updatedData);
            setTask(()=>"")
        }).catch((error) => console.error(error));
    };

    let handelChange = (event) => {
        const { name, value } = event.target;
        if (name === "project") {
            setListName(value);
        } else if (name === "task") {
            setTask(value);
        } 
    };
    
    const handelDeleteList = (email, listName) => {
        if (!window.confirm(`Are you sure you want to delete the list "${listName}"?`)) return;
    
        deleteList(email, listName).then((updatedData) => {
            setTodoData(updatedData);
            if (selectedList === listName) setSelectedList("");
        }).catch((error) => console.error(error));
    };

    const handleTaskDelete = (task) => {
        deleteTask(email, selectedList, task).then((updatedData) => {
            setTodoData(updatedData);
        }).catch((error) => console.error(error));
    };

    const handelUpdateListName = async (email, oldName, newName) => {
        if (!newName.trim()) return alert("List name cannot be empty!");
    
        try {
            console.log("Updating List Name:", oldName, "→", newName);
            const updatedData = await updateListName(email, oldName, newName);
            console.log("Updated Data:", updatedData);
            setTodoData(updatedData);
            if (selectedList === oldName) {
                setSelectedList(newName);
            }
        } catch (error) {
            console.error("Error updating list name:", error);
        }
    };

    const toggleTaskCompletion = (taskText) => {
        setCompletedTasks((prevState) => ({
            ...prevState,
            [taskText]: !prevState[taskText] // Toggle
        }));
    };
    
    return(
        <div className="todoPage">
            <div className="navBar">
                <div className="userBox">   
                    <FontAwesomeIcon id="icon" icon={faPerson} />
                    <h2 id="userName">Welcome, {userEmail}</h2>
                    {/* {todoData ? <pre>{JSON.stringify(todoData, null, 2)}</pre> : <p>Loading...</p>} */}
                </div>
                
                <br></br>
                <div className="addProject">
                <input 
                    name="project"
                    onChange={(e)=> setListName(e.target.value)}
                    value={listName}
                    id="inpName"
                    type="text"
                    placeholder="Add a list" /> 
                    
                    <FontAwesomeIcon className="addP" onClick={handelClick} id="addIcon" icon={faPlus} /> 
                </div>
                <br></br>
                <div className="pro">
                    <h2 id="hedd" >My projects</h2>
                    <div className="displayProjects">
                        {/* Display all lists AND SELECT */}
                        {todoData && (
                            <ul className="lists">
                                {Object.keys(todoData.lists).map((list) => (
                                    <li className="listItem" key={list} 
                                    onClick={() => setSelectedList(list)}
                                    style={{ cursor: "pointer", fontWeight: selectedList === list ? "bold" : "normal" }}
                                    >#&nbsp;
                                    {list}
                                    <div className="listIcons"><FontAwesomeIcon 
                                    className="editIcon"
                                    icon={faFilePen}
                                    onClick={(e)=>{
                                        e.preventDefault();
                                        e.stopPropagation()
                                        const newListName = prompt("Enter new Name:", list);
                                        if(newListName && newListName !==list) {
                                            handelUpdateListName(email, list, newListName);
                                        }
                                    }}
                                    />
                                    <FontAwesomeIcon 
                                    className="deleteIcon"
                                    icon={faTrash}
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        handelDeleteList(email, list);
                                    }}
                                    /></div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            <div className="todo">
                <div className="appLogo">
                    <img src={log} alt="Logo" />
                    <div className="todoNameBox">
                        <h1>MANAGE BUDDY</h1>
                        <p style={{marginTop:"-5px"}}>MANAGE LIFE,SMATER </p>
                    </div>
                </div>
                <div className="list">
                    <div className="addTaskBox">
                        <h2 id="ln">{selectedList}</h2>
                        <div className="addBox">
                            <input
                            placeholder="Add your task"
                            onChange={(e) => setTask(e.target.value)}
                            name="task"
                            value={task} 
                            className="addTask"/>
                            <SendIcon 
                            className="addT"
                            onClick={handelClick1}
                            /> 
                        </div>
                        <div className="tasks">
                            {/* Display tasks for selected list */}
                            {selectedList && todoData && (
                                <ul>
                                    {todoData.lists[selectedList]?.map((task, index) => (
                                        <li key={index}
                                            style={{display: "flex"}}
                                        >
                                        <input 
                                        className="CB"
                                            type="checkbox" 
                                            checked={completedTasks[task.text] || false}
                                            onChange={() => toggleTaskCompletion(task.text)}
                                        />
                                        <span className={completedTasks[task.text] ? "completedTask" : "incomp"}>
                                            {task.text} </span>    
                                        <FontAwesomeIcon 
                                            className="deleteTaskIcon"
                                            icon={faTrash}
                                            onClick={()=>handleTaskDelete(task)}
                                        />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                   </div>
                </div>
            </div>
        </div>
    )
}




    

   




