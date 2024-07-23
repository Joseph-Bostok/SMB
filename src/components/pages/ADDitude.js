import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ADDitude = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

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

  if (error) {
    return <div>Error fetching articles: {error.message}</div>;
  }

  return (
    <div>
      <h1>ADDitude Articles</h1>
      <ul>
        {articles.map((article, index) => (
          <li key={index}>
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
