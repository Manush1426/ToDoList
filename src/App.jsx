import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import About from './components/about';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

function App() {

  const [todo, settodo] = useState('')
  const [allTODO, setallTODO] = useState([])
  const [finishedTODO, setfinishedTODO] = useState([])
  const [showFinished, setshowFinished] = useState(true)

  const router = [
    {
      path: "/about",
      element: <About />
    }
  ];

  useEffect(() => {
    axios.get("http://localhost:3000/api/tasks")
      .then(result => {
        setallTODO(result.data);
        console.log("Saved successfully: ", result.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleAddTask = () => {
    if (todo.trim() !== '') {
      const updatedTasks = [...allTODO, { text: todo, isCompleted: false }];
      setallTODO(updatedTasks);

      const data = { text: todo, isCompleted: false };

      axios.post("http://localhost:3000/api/tasks", data)
        .then(response => {
          console.log('User created:', response.data);
        })
        .catch(error => {
          console.error('Error creating user:', error);
        });

      settodo('');
    }
  };

  const handleEdit = (idx) => {
    const updatedTasks = allTODO.map((task, index) => {
      if (index === idx) {
        return { ...task, isEditing: true };
      }
      return task;
    });
    setallTODO(updatedTasks);
  };

  const saveEdit = (idx, newText) => {
    const task = allTODO[idx];
    axios.put(`http://localhost:3000/api/tasks/${task._id}`, {
      text: newText,
      isCompleted: task.isCompleted
    })
      .then(response => {
        const updatedTasks = allTODO.map((t, i) =>
          i === idx ? { ...response.data, isEditing: false } : t
        );
        setallTODO(updatedTasks);
      })
      .catch(error => {
        console.error('Error updating task:', error);
      });
  };

  const handleDelete = (idx) => {
    const task = allTODO[idx];
    const updatedTasks = allTODO.filter((_, index) => index !== idx);
    setallTODO(updatedTasks);

    axios.delete(`http://localhost:3000/api/tasks/${task._id}`)
      .then(response => {
        console.log("Task deleted: ", response.data);
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  };

  const handleChange = (idx) => {
    const updatedTasks = allTODO.map((task, index) => {
      if (index === idx) {
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });
    const finT = updatedTasks.filter(item => item.isCompleted === true);
    setfinishedTODO(finT);
    setallTODO(updatedTasks);
    localStorage.setItem('allTODO', JSON.stringify(updatedTasks));
  };

  const toggleFinished = () => {
    setshowFinished(!showFinished);
  }

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/about" element={<About />} />
        <Route
          path="/"
          element={
            <div className='app-grid'>
              <div>
                <h1 className='Logo'>iTask - All Your Tasks in One Place</h1>
              </div>

              <div className='addTODO'>
                <h2 className='addAtask'>Add a Task</h2>
              </div>

              <div className='addTask'>
                <input
                  type='text'
                  placeholder='Add your Task...'
                  value={todo}
                  onChange={(e) => settodo(e.target.value)}
                />
                <button className='add-btn' onClick={handleAddTask}>Add</button>
              </div>

              <div className='yourTODO'>
                Your ToDo's
              </div>

              <div className='showFin'>
                <input type='checkbox' onChange={toggleFinished} checked={showFinished} className='todo-check'></input>
                <div className='sf'>Show Finished Tasks...</div>
              </div>
              <div className='todo-list'>
                {allTODO.length === 0 && <div className='no-disp'>No Todos to display</div>}

                {allTODO.map((item, index) => {
                  return (
                    (showFinished || !item.isCompleted) && (
                      <div className='task-box' key={index}>
                        <input
                          type='checkbox'
                          onChange={() => handleChange(index)}
                          checked={item.isCompleted}
                          className='todo-check'
                        ></input>
                        {item.isEditing ? (
                          <input
                            type='text'
                            defaultValue={item.text}
                            onBlur={(e) => saveEdit(index, e.target.value)}
                            autoFocus
                          />
                        ) : (
                          <div className={`task-name ${item.isCompleted ? 'completed' : ''}`}>{item.text}</div>
                        )}
                        <div>
                          <button className='todo-list-btns' onClick={() => handleEdit(index)}><FaEdit /></button>
                          <button className='todo-list-btns' onClick={() => handleDelete(index)}><MdDelete /></button>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App
