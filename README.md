# Shopping-Website
Shopping Website made using html, css, bootstrap and js and api

website link :https://sadiq98.github.io/Shopping-Website/


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import AddList from './Components/AddList';
import Content from './Components/Content';
import Alert from './Components/Alert';

function App() {
  const inputRef = useRef({});
  const API_URL = 'http://localhost:3500/items'

  const [list, setList] = useState([]);    ///state
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);  //  loading state
  const [successMessage, setSuccessMessage] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // State for the confirmation dialog
  const [itemToDelete, setItemToDelete] = useState(null); // Track the item to delete



  useEffect(() => {   //useEffect hook
    const fetchData = async () => { ///asynchronous data fetching
      setIsLoading(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw Error('Data Not Found');
        }
        const listItem = await response.json();
        setList(listItem);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false)
      }
    }
    fetchData();
  }, []);

  // Add data
  const addItems = async (item) => {
    if (!item.trim()) {
      setError('Item name cannot be empty!');
      setAlertMessage('Item name cannot be empty!');
      setShowAlert(true);
      return;
    }
    if (list.some(existingItem => existingItem.item.toLowerCase() === item.toLowerCase())) {
      setError('Item already exists in the list!');
      setAlertMessage('Item already exists in the list!');
      setShowAlert(true);
      return;
    }

    const id = String(list.length + 1);
    const theNewItem = { id, item };
    const updatedList = [...list, theNewItem];
    setList(updatedList);

    const postOption = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(theNewItem),
    };

    try {
      const result = await fetch(API_URL, postOption);
      if (!result.ok) throw new Error('Failed to add item');
      // setSuccessMessage('Item added successfully!');
      setAlertMessage('Item added successfully!');
      setShowAlert(true);
      return;
    } catch (error) {
      setError(error.message);
      setAlertMessage(error.message);
      setShowAlert(true);
    }
  }

  // Handle Edit - Focus the input
  const handleEdit = useCallback((id) => { //useCallback hook for optimizing performance by memoizing functions, to prevent unnecessary re-creations on each render.
    if (inputRef.current[id]) {
      inputRef.current[id].focus();
    }
  }, []);

  // Handle Update item
  const handleUpdate = useCallback(async (id, newItemValue) => {
    const updatedList = list.map(item => item.id === id ? { ...item, item: newItemValue } : item);
    setList(updatedList);

    const updateOption = {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item: newItemValue }),
    };

    const requrl = `${API_URL}/${id}`;
    try {
      const result = await fetch(requrl, updateOption);
      if (!result.ok) throw new Error('Failed to update item');
    } catch (error) {
      setError(error.message);
      setAlertMessage(error.message);
      setShowAlert(true);
    }
  }, [list]);

  // Handle Delete item
  // const handleDelete = useCallback(async (id) => {

  //   const updatedList = list.filter(item => item.id !== id);
  //   setList(updatedList);

  //   const deleteOption = {
  //     method: 'DELETE',
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   const requrl = `${API_URL}/${id}`;
  //   try {
  //     const result = await fetch(requrl, deleteOption);
  //     if (!result.ok) throw new Error('Failed to delete item');
  //   } catch (error) {
  //     setError('An error occurred while deleting the item.');
  //     setAlertMessage('An error occurred while deleting the item.');
  //     setShowAlert(true);
  //   }
  // }, [list]);

  // Handle Delete item
  const handleDelete = useCallback((id) => {
    setItemToDelete(id);
    setShowConfirmDialog(true);
  }, []);

  // Confirm Delete
  const confirmDelete = useCallback(async () => {
    const updatedList = list.filter(item => item.id !== itemToDelete);
    setList(updatedList);

    const deleteOption = {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
    };

    setAlertMessage('Item deleted successfully!');
    setShowAlert(true);
    setShowConfirmDialog(true);

    const requrl = `${API_URL}/${itemToDelete}`;
    try {
      const result = await fetch(requrl, deleteOption);
      if (!result.ok) throw new Error('Failed to delete item');
      setShowConfirmDialog(false);
    } catch (error) {
      setError('An error occurred while deleting the item.');
      setAlertMessage('An error occurred while deleting the item.');
      setShowAlert(true);
      setShowConfirmDialog(false);
    }
  }, [list, itemToDelete]);

  // Cancel Delete
  const cancelDelete = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);


  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      addItems(newItem);
      setNewItem("");
      setError(null);
    } else {
      setError('Item name cannot be empty!');
      setAlertMessage('Item name cannot be empty!');
      setShowAlert(true);
    }
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  return (
    <div className="App">
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {isLoading ? <div>Loading...</div> : (
        <>
          <AddList newItem={newItem} setNewItem={setNewItem} handleSubmit={handleSubmit} />
          <Content
            list={list}
            handleUpdate={handleUpdate}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            inputRef={inputRef}
          />
        </>
      )}

      {showAlert &&
        <Alert message={alertMessage} onClose={handleCloseAlert} />}

      <div className={`modal ${showConfirmDialog ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog" aria-hidden={!showConfirmDialog}>
        <div className="modal-dialog shadow" role="document">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between">
              <h5 className="modal-title">Confirm Deletion</h5>
              <button type="button" className="close btn" data-dismiss="modal" aria-label="Close" onClick={cancelDelete}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this item?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cancelDelete}>No</button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;




import React from 'react'
import { useRef } from 'react'

const AddList = ({ newItem, setNewItem, handleSubmit }) => {
    const inputRef = useRef(); //useRef Hook
    return (
        ///Event Handling onSubmit
                            // onClick={() => inputRef.current.focus}
        <form  onSubmit={handleSubmit}>  
            <div className="row justify-content-center align-items-center g-2 mx-3 my-3">
                <div className="col-10 input-group ">
                    <input
                        className='form-control'
                        type='text'
                        // id=''
                        // ref={inputRef}
                        placeholder='Enter Item Name'
                        required
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                    ></input>
                    <button className='btn btn-sm btn-primary'
                        type='submit' >
                        <i className="bi bi-plus-lg"></i>
                    </button> 

                </div>
            </div>
        </form>
    )
}

export default AddList


import React from 'react';
import ListItem from './ListItem';  // Added ListItem component

const Content = ({ list, handleUpdate, handleEdit, handleDelete, inputRef }) => {
  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Shopping List</h2>
        </div>
        <div className="card-body">
          <main className="content">
            {list.length ? (
              <ul className="list-group">
                {list.map((item) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handleUpdate={handleUpdate}
                    inputRef={inputRef}
                  />
                ))}
              </ul>
            ) : (
              <h3 className='mt-3'>Empty List</h3>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Content;


import React from 'react';

const ListItem = React.memo(({ item, handleEdit, handleDelete, handleUpdate, inputRef }) => ( ///React.memo prevents unnecessary re-renders by only allowing the component to re-render when its props change.
  <li className="list-group-item d-flex flex-row">
    <input
      ref={(el) => (inputRef.current[item.id] = el)}
      className="form-control border-0"
      value={item.item}
      onChange={(e) => handleUpdate(item.id, e.target.value)}
    />
    <button
      className="btn btn-sm ms-auto"
      onClick={() => handleEdit(item.id)}
    >
      <i className="bi bi-pencil-square" style={{ color: 'darkgoldenrod' }}></i>
    </button>
    <button
      className="btn btn-sm ms-auto"
      onClick={() => handleDelete(item.id)}
    >
      <i className="bi bi-trash" style={{ color: 'red' }}></i>
    </button>
  </li>
));

export default ListItem;


import React from 'react';

export const Alert = ({ message, onClose }) => {
    return (
        <>
            {message === 'Item added successfully!' ? (
                <div className="alert alert-success alert-dismissible fade show d-flex align-items-center justify-content-between m-4" role="alert">
                    {message}
                    <button
                        type="button"
                        className="close btn"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            ) : (
                <div className="alert alert-warning alert-dismissible fade show d-flex align-items-center justify-content-between m-4" role="alert">
                    {message}
                    <button
                        type="button"
                        className="close btn"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
        </>
    );
};

export default Alert;



{
  "items": [
    {
      "id": "1",
      "item": "Milk"
    },
    {
      "id": "2",
      "item": "item 1"
    },
    {
      "id": "3",
      "item": "item 2"
    },
    {
      "id": "4",
      "item": "item 3"
    }
  ]
}
