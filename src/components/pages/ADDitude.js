import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './ADDitude.css'; // Import the CSS file

const ADDitude = () => {
  const [articles, setArticles] = useState([]); // State to hold fetched articles
  const [error, setError] = useState(null); // State to hold any errors
  const [selectedArticle, setSelectedArticle] = useState(null); // State to hold the selected article
  const [loading, setLoading] = useState(false); // State to indicate loading status
  const [blogPost, setBlogPost] = useState(''); // State to hold the generated blog post
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://testserver-env-2.eba-mrgeg24r.us-east-1.elasticbeanstalk.com/api/additude');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles', error);
        setError(error);
      }
    };

    fetchArticles();
  }, []);

  // Navigate to the home page
  const handleHomeClick = () => {
    navigate('/');
  };

  // Handle article click to open the modal
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedArticle(null);
    setBlogPost('');
  };

  // Create a blog post using ChatGPT
  const createBlogPost = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://testserver-env-2.eba-mrgeg24r.us-east-1.elasticbeanstalk.com/api/create-blog-post', {
        title: selectedArticle.title,
        link: selectedArticle.link,
        excerpt: selectedArticle.excerpt
      });
      setBlogPost(response.data.blogPost);
    } catch (error) {
      console.error('Error creating blog post', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Render error message if there's an error
  if (error) {
    return <div>Error fetching articles: {error.message}</div>;
  }

  return (
    <div className="container">
      <button className="home-button fade-in" onClick={handleHomeClick}>Home</button>
      <h1>ADDitude Articles</h1>
      <ul className="articles-list fade-in">
        {articles.map((article, index) => (
          <li key={index} className="article-box fade-in" onClick={() => handleArticleClick(article)}>
            <h2>
              <a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a>
            </h2>
            <p>{article.excerpt}</p>
          </li>
        ))}
      </ul>

      {selectedArticle && (
        <div className="modal">
          <div className="modal-content fade-in">
            <h2>Create Blog Post</h2>
            <p>Would you like ChatGPT to create a blog post about "{selectedArticle.title}"?</p>
            <button onClick={createBlogPost} disabled={loading}>
              {loading ? 'Creating...' : 'Yes'}
            </button>
            <button onClick={closeModal}>No</button>
          </div>
        </div>
      )}

      {blogPost && (
        <div className="blog-post fade-in">
          <h2>Generated Blog Post</h2>
          <p>{blogPost}</p>
          <button onClick={closeModal}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ADDitude;
