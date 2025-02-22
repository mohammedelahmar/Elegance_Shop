import React, { useState } from 'react';

const DeleteUser = ()=>{
     const [formData, setFormData] = useState({
          id : '',
     })
     const [message, setMessage] = useState('');
     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData({
               ...formData,
               [name]: value
          });
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          try {
               const response = await fetch('http://localhost:5000/api/users/delete', {
                    method: 'DELETE',
                    headers: {
                         'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
               });

               const data = await response.json();

               console.log('Server Response:', data); // Debugging: Log the server response

               if (response.ok) {
                    setMessage('User Deleted!');
                    console.log('User Deleted:', data);
               } else {
                    setMessage(data.message || 'Deletion failed');
               }
          } catch (error) {
               setMessage('An error occurred. Please try again.');
               console.error('Error:', error);
          }
     };

     return (
          <form onSubmit={handleSubmit}>
               <div>
                    <label>ID:</label>
                    <input
                         type="text"
                         name="id"
                         value={formData.id}
                         onChange={handleChange}
                         required
                    />
               </div>
               <button type="submit">Delete User</button>
               <p>{message}</p>
          </form>
     );




}
export default DeleteUser;