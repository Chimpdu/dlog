import './App.css';
import './components/Nav'
import Nav from './components/Nav';
import Home from './components/Home';
import About from './components/About';
import AddBlog from './components/AddBlog';
import Error from './components/Error';
import Register from './components/Register';
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LanguageProvider } from './LanguageContext';
import { Suspense } from 'react';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './components/PrivateRoute'; 
import GuestRoute from './components/GuestRoute';



function App() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const fetchBlogs = () => {
    fetch("http://localhost:5000/api/blogs", {mode: "cors"})
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(content => {
        if (!content.failed) {
          setBlogs(content);
          if(error=== "No blog found") setError("")
        } else {
          setBlogs([]);
          setError("No blog found");
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setError(error.message);
      });
  };
  useEffect(fetchBlogs, []);
  
  function deleteBlog (id) {
    fetch(`http://localhost:5000/api/deleteblog/${id}`, {
      method: 'DELETE', // Specify the HTTP method
      mode: "cors"
    })
    .then(response => {
      if (response.ok) {
        fetchBlogs();
        return response.json();
      } else {
        throw new Error('Failed to delete the blog');
      }
    })
    .catch(error => {
      console.error("Error deleting blog: ", error);
    });
  }
  
function addBlog(blog) {
  fetch("http://localhost:5000/api/addblog", {
    method: "POST", // Make sure to use uppercase for HTTP methods
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(blog),
    mode: "cors"
  })
  .then(response => {
    if (response.ok) {
      fetchBlogs();
      return response.json();
    } else {
      throw new Error('Failed to add the blog');
    }
  })
  .catch(error => {
    console.error("Error adding blog: ", error);
  });
  
}

function updateLikes(id) {
   fetch(`http://localhost:5000/api/updatelike/${id}`, {
    method: 'PATCH', 
    headers: {
      'Content-Type': 'application/json',
    },
    mode: "cors"
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to update likes');
    }
    return response.json();
  })
  .then(() => {
    fetchBlogs(); 
  })
  .catch(error => {
    console.error("Error updating likes: ", error);
  });
}
  

  return (
    <LanguageProvider>
      <AuthProvider>
        <Suspense fallback="loading">
          <Router>
            <div className="App">
              <Nav/> 
              <Routes>
                <Route path='/' element={<><Error error={error}/><Home blogs={blogs} deleteBlog={deleteBlog} updateLikes={updateLikes}/></>} />
                <Route path='/about' element={<About/>} />
                <Route path='/add' element={<PrivateRoute><AddBlog addBlog={addBlog}/></PrivateRoute>} />
                <Route path='/register' element={<GuestRoute><Register/></GuestRoute>} />
                <Route path='/login' element={<GuestRoute><Login/></GuestRoute>} />
              </Routes> 
            </div>
          </Router>
        </Suspense>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
