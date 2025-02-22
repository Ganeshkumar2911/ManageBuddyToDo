import "./Todo.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPerson, faPlus} from '@fortawesome/free-solid-svg-icons'
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import log from './assets/log.jpg'
import SendIcon from '@mui/icons-material/Send';
import { db } from "./firebase";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";


export default function Todo({userEmail}) {
    let [listName, setListName] = useState("");
    const[userEmail1, setUserEmail1] = useState(localStorage.getItem("userEmail1"));
    const [projects, setProjects] = useState([]);
    const[newProject, setNewProject] = useState("");
    const [tasks, setTasks] = useState([]);
    const [selectProject, setSelectProject] = useState(null);
    const [newTask, setNewTask] = useState("");


    useEffect(()=> {
        if (userEmail1) {
            fetchProjects();
        }
    },[userEmail1]);

    const fetchProjects = async () => {
        const userDocRef = doc(db, "users", userEmail1);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const data = userDoc.data();
            console.log("Firestore Data:", data);
            setProjects(Array.isArray(data.projects) ? data.projects : []);
        } else {
            setProjects([]);
        }
    };

    const fetchTasks = async (projectName) => {
        const userDocRef = doc(db, "users", userEmail1);
        const userDoc = await getDoc(userDocRef);
    
        if (userDoc.exists()) {
            const data = userDoc.data();
            const project = data.projects.find(p => p.name === projectName);
            setSelectProject(projectName);
            setTasks(Array.isArray(project?.tasks) ? project.tasks : []);
        } else {
            setTasks([]);
        }
    };
   
    

    const[email,setEmail] = useState(userEmail || localStorage.getItem("userEmail") || "Guest");
    useEffect(()=>{
        setEmail(userEmail || localStorage.getItem("userEmail") || "Guest");
    },[userEmail])

    // let handelChange = (event) => {
    //     const { name, value } = event.target;
    //     if (name === "project") {
    //         setListName(value);
    //     } else if (name === "task") {
    //         setTask(value);
    //     } 
    // };

    // let handelClick = () => {   
    //     console.log("project is ",listName );   
    // };

    const addProject = async () => {
        if (!newProject.trim()) return;
        if (!userEmail1) {
            console.error("User email is null");
            return;
        }
    
        const userDocRef = doc(db, "users", userEmail1);
        const userDoc = await getDoc(userDocRef);
    
        if (!userDoc.exists()) {
            await setDoc(userDocRef, { projects: [] });
        }
    
        await updateDoc(userDocRef, {
            projects: arrayUnion({ name: newProject, tasks: [] })
        });
    
        setProjects([...projects, { name: newProject, tasks: [] }]);
        setNewProject("");
    };

    const addTask = async () => {
        if (!newTask.trim() || !selectProject) return;
    
        const userDocRef = doc(db, "users", userEmail1);
        const userDoc = await getDoc(userDocRef);
    
        if (userDoc.exists()) {
            let data = userDoc.data();
            let updatedProjects = data.projects.map(p => 
                p.name === selectProject ? { ...p, tasks: [...p.tasks, newTask] } : p
            );
    
            await updateDoc(userDocRef, { projects: updatedProjects });
            setTasks([...tasks, newTask]);
            setNewTask("");
        }
    };
   

    return(
        <div className="todoPage">
            <div className="navBar">
                <div className="userBox">   
                    <FontAwesomeIcon id="icon" icon={faPerson} />
                    <h2 id="userName">Welcome, {userEmail}</h2>
                </div>
                
                <br></br>
                <div className="addProject">
                <input 
                    name="project"
                    onChange={(e)=> setNewProject(e.target.value)}
                    value={newProject}
                    id="inpName"
                    type="text"
                    placeholder="Add a list" /> 
                    
                    <FontAwesomeIcon 
                    className="addP" 
                    onClick={addProject} 
                    id="addIcon" 
                    icon={faPlus} /> 
                </div>
                <br></br>
                <h2>My projects</h2>
                <div className="projects">
                    {projects.map((project, index)=> (
                        <p 
                        key={index}
                        onClick={()=>fetchTasks(project)}
                        >{project}</p>
                    ))}
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
                        <h2 id="ln">List Name</h2>
                        <div className="addBox">
                            <input
                            onChange={(e)=> setNewTask(e.target.value)}
                            placeholder="add task"
                            value={newTask}
                            name="task" 
                            className="addTask"/>
                            <SendIcon 
                            className="addT"
                            onClick={addTask}
                            /> 
                        </div>
                   </div>
                   <div className="todoList">
                    {tasks.map((task, index)=>(
                        <p key={index}>{task}</p>
                    ))}
                   </div>
                </div>
            </div>
        </div>
    )
};

