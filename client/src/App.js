import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthContext';
import store from './redux/store';

// Import layout and routes - using the correct case as it exists on your disk
import Layout from './components/layout/layout'; // Use all lowercase to match the file on disk
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;