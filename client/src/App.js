import React from 'react';
import RegisterForm from './components/RegisterForm';
import DeleteUser from './components/DeleteUser';

function App() {
  return (
    <div className="App">
      <h1>User Registration</h1>
      <RegisterForm />
      <h1>Delete uset</h1>
      <DeleteUser />

    </div>
  );
}

export default App;