import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory for navigation
import './ADDitude.css'; // Import the CSS file

const ADDitude = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const history = useHistory(); // Initialize useHistory

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/additude');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles', error);
        setError(error);
      }
    };

    fetchArticles();
  }, []);

  const handleHomeClick = () => {
    history.push('/'); // Navigate to the home page
  };

  if (error) {
    return <div>Error fetching articles: {error.message}</div>;
  }

  return (
    <div className="container">
      <button className="home-button" onClick={handleHomeClick}>Home</button>
      <h1>ADDitude Articles</h1>
      <ul className="articles-list">
        {articles.map((article, index) => (
          <li key={index} className="article-box">
            <h2>
              <a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a>
            </h2>
            <p>{article.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ADDitude;
