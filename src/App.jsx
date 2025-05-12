import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import About from './components/about';
import { Routes, Route } from 'react-router-dom';

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
    const storedTasks = JSON.parse(localStorage.getItem('allTODO'));
    console.log('Retrieved from localStorage:', storedTasks);
    if (storedTasks && Array.isArray(storedTasks)) {
      setallTODO(storedTasks);
    }
  }, []);

  useEffect(() => {
    console.log('Saving to localStorage:', allTODO);
    localStorage.setItem('allTODO', JSON.stringify(allTODO));
  }, [allTODO]);

  useEffect(() => {
    console.log('Saving finished tasks to localStorage:', finishedTODO);
    localStorage.setItem('finishedTODO', JSON.stringify(finishedTODO));
  }, [finishedTODO]);

  const handleAddTask = () => {
    if (todo.trim() !== '') {
      const updatedTasks = [...allTODO, { text: todo, isCompleted: false }];
      setallTODO(updatedTasks);
      localStorage.setItem('allTODO', JSON.stringify(updatedTasks));
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
    const updatedTasks = allTODO.map((task, index) => {
      if (index === idx) {
        return { ...task, text: newText, isEditing: false };
      }
      return task;
    });
    setallTODO(updatedTasks);
    localStorage.setItem('allTODO', JSON.stringify(updatedTasks));
  };

  const handleDelete = (idx) => {
    const updatedTasks = allTODO.filter((_, index) => index !== idx);
    setallTODO(updatedTasks);
    localStorage.setItem('allTODO', JSON.stringify(updatedTasks));
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
