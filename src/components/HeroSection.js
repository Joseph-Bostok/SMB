import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import LoadingBar from 'react-top-loading-bar';
import '../App.css';
import './HeroSection.css';

/**
 * Renders a HeroSection component that fetches articles from an API, allows the user to sort them,
 * and displays them in a list. It also allows the user to create a blog post based on a selected article.
 *
 * @return {JSX.Element} The rendered HeroSection component.
 */
function HeroSection() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogPost, setBlogPost] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const [sortCriteria, setSortCriteria] = useState('title');
  const loadingBarRef = useRef(null);

  useEffect(() => {
    /**
     * Fetches articles from multiple sources and sets the combined articles state.
     *
     * @return {Promise<void>} - A promise that resolves when the articles are fetched and set.
     */
    const fetchArticles = async () => {
      loadingBarRef.current.continuousStart(); // Start the loading bar
      try {
        const sources = ['associatedpress', 'additude', 'psychology-today'];
        const articlesFromSources = await Promise.all(
          sources.map(source => axios.get(`http://localhost:5000/api/${source}`))
        );
        const combinedArticles = articlesFromSources.flatMap(response => response.data);
        setArticles(combinedArticles);
      } catch (error) {
        console.error('Error fetching articles', error);
        setError(error);
      } finally {
        loadingBarRef.current.complete(); // Complete the loading bar
      }
    };

    fetchArticles();
  }, []);

    /**
     * Updates the sort criteria based on the selected value from the sort dropdown.
     *
     * @param {Event} e - The event object representing the change in the sort dropdown.
     * @return {void} This function does not return anything.
     */
  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const sortedArticles = articles.sort((a, b) => {
    if (sortCriteria === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortCriteria === 'source') {
      return a.source.localeCompare(b.source);
    } else if (sortCriteria === 'date') {
      return new Date(a.date) - new Date(b.date);
    }
    return 0;
  });

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

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
      const response = await axios.post('http://localhost:5000/api/create-blog-post', {
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

  const handleSaveChanges = () => {
    setBlogPost(editableContent);
    alert('Changes saved!');
  };

  return (
    <div className='hero-container'>
      <LoadingBar color='#f11946' ref={loadingBarRef} />

      <div className='hero-profile'></div>
      <div className='hero-header'>
        <div>
          <h1>Hello.</h1>
          <h2>Let us help you find the right news.</h2>
        </div>
      </div>
      <div className='hero-message'></div>

      <div className='sort-options'>
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortCriteria} onChange={handleSortChange}>
          <option value="title">Title</option>
          <option value="source">Source</option>
          <option value="date">Date</option>
        </select>
      </div>

      {error && <div>Error fetching articles: {error.message}</div>}

      <ul className='articles-list'>
        {sortedArticles.map((article, index) => (
          <li key={index} className='article-box' onClick={() => handleArticleClick(article)}>
            <h2>{article.title}</h2>
            <p className='article-source'>Source: {article.source}</p>
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

export default HeroSection;
