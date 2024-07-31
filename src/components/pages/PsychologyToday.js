import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PsychologyToday.css';

const PsychologyToday = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogPost, setBlogPost] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log('Fetching articles...');
        const response = await axios.get('http://localhost:5000/api/psychology-today');
        console.log('Articles fetched:', response.data);
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles', error);
        setError(error);
      }
    };

    fetchArticles();
  }, []);

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleArticleClick = (article) => {
    console.log('Article clicked:', article);
    setSelectedArticle(article);
  };

  const closeModal = () => {
    setSelectedArticle(null);
    setBlogPost('');
    setEditableContent('');
  };

  const createBlogPost = async () => {
    setLoading(true);
    try {
      console.log('Creating blog post...');
      const response = await axios.post('http://localhost:5000/api/create-blog-post', {
        title: selectedArticle.title,
        link: selectedArticle.link,
        excerpt: selectedArticle.excerpt
      });
      console.log('Blog post created:', response.data);
      setBlogPost(response.data.blogPost);
      setEditableContent(response.data.blogPost);
    } catch (error) {
      console.error('Error creating blog post', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = () => {
    setBlogPost(editableContent);
    alert('Changes saved!');
  };

  if (error) {
    return <div>Error fetching articles: {error.message}</div>;
  }

  return (
    <div className="container">
      <button className="home-button fade-in" onClick={handleHomeClick}>Home</button>
      <h1>Psychology Today Articles</h1>
      <ul className="articles-list fade-in">
        {articles.map((article, index) => (
          <li key={index} className="article-box fade-in" onClick={() => handleArticleClick(article)}>
            <h2>
              <a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a>
            </h2>
            <p className="article-date">{article.date}</p>
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
        <div className="modal">
          <div className="modal-content fade-in">
            <h2>Generated Blog Post</h2>
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              rows="10"
              cols="50"
              style={{ width: '100%', height: '200px' }}
            />
            <button onClick={handleSaveChanges}>Save Changes</button>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PsychologyToday;
