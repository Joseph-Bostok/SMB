import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../App.css'; // Correct relative path for App.css
import '../HeroSection.css'; // Correct relative path for HeroSection.css

/**
 * Renders a component that fetches articles from the Psychology Today API and allows the user to create a blog post based on a selected article.
 *
 * @return {JSX.Element} The rendered component.
 */
function PsychologyToday() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogPost, setBlogPost] = useState('');
  const [editableContent, setEditableContent] = useState('');

  useEffect(() => {
/**
 * Fetches articles from the Psychology Today API and sets the state with the response data.
 *
 * @return {Promise<void>} - A promise that resolves when the articles are fetched and set.
 */
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://testserver-env-2.eba-mrgeg24r.us-east-1.elasticbeanstalk.com/api/psychology-today');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles', error);
        setError(error);
      }
    };

    fetchArticles();
  }, []);

/**
 * Sets the selected article to the provided article.
 *
 * @param {Object} article - The article to be set as the selected article.
 * @return {void}
 */
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  /**
   * Resets the state variables related to the modal and clears the selected article, blog post, and editable content.
   *
   * @return {void} This function does not return anything.
   */
  const closeModal = () => {
    setSelectedArticle(null);
    setBlogPost('');
    setEditableContent('');
  };

/**
 * Asynchronously creates a blog post using the selected article's title, link, and excerpt.
 * Sets the blog post and editable content state based on the response data.
 * Logs and sets an error if the request fails.
 * Sets the loading state to false after the request is complete.
 *
 * @return {Promise<void>} Promise that resolves when the blog post is created and state is updated
 */
  const createBlogPost = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://testserver-env-2.eba-mrgeg24r.us-east-1.elasticbeanstalk.com/api/create-blog-post', {
        title: selectedArticle.title,
        link: selectedArticle.link,
        excerpt: selectedArticle.excerpt
      });
      setBlogPost(response.data.blogPost);
      setEditableContent(response.data.blogPost);
    } catch (error) {
      console.error('Error creating blog post', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates the blog post with the current editable content and displays a success message.
   *
   * @return {void} No return value.
   */
  const handleSaveChanges = () => {
    setBlogPost(editableContent);
    alert('Changes saved!');
  };

  return (
    <div className='hero-container'>
      <div className='hero-profile'></div>
      <div className='hero-header'>
        <div>
          <h1>Hello.</h1>
          <h2>Let us help you find the right news.</h2>
        </div>
      </div>
      <div className='hero-message'></div>

      {error && <div>Error fetching articles: {error.message}</div>}

      <ul className='articles-list'>
        {articles.map((article, index) => (
          <li key={index} className='article-box' onClick={() => handleArticleClick(article)}>
            <h2>{article.title}</h2>
            <p className='article-source'>Source: Psychology Today</p>
            <p className='article-date'>{article.date}</p>
            <p>{article.excerpt}</p>
          </li>
        ))}
      </ul>

      {selectedArticle && (
        <div className='modal'>
          <div className='modal-content'>
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
        <div className='modal'>
          <div className='modal-content'>
            <h2>Generated Blog Post</h2>
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              rows='10'
              style={{ width: '100%', height: '200px' }}
            />
            <button onClick={handleSaveChanges}>Save Changes</button>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PsychologyToday;
