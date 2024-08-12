import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import LoadingBar from 'react-top-loading-bar';
import '../App.css';
import './HeroSection.css';

function HeroSection() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [loadingSocial, setLoadingSocial] = useState(false);
  const [blogPost, setBlogPost] = useState('');
  const [socialMediaPost, setSocialMediaPost] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const [sortCriteria, setSortCriteria] = useState('title');
  const loadingBarRef = useRef(null);

  // Fetch articles from various sources when the component mounts
  useEffect(() => {
    const fetchArticles = async () => {
      loadingBarRef.current.continuousStart(); // Start the loading bar
      try {
        const sources = ['associatedpress', 'additude', 'psychology-today'];
        // Fetch articles from all sources
        const articlesFromSources = await Promise.all(
          sources.map(source => axios.get(`http://testserver-env-2.eba-mrgeg24r.us-east-1.elasticbeanstalk.com/api/${source}`))
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

  // Handle sort criteria change
  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  // Sort articles based on the selected criteria
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

  // Handle article click to select it for post generation
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  // Close the modal and reset states
  const closeModal = () => {
    setSelectedArticle(null);
    setBlogPost('');
    setSocialMediaPost('');
    setEditableContent('');
  };

  // Create a blog post by calling the API
  const createBlogPost = async () => {
    setLoadingBlog(true);
    setLoadingSocial(false);
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
      setLoadingBlog(false);
    }
  };

  // Create a social media post by calling the API
  const createSocialMediaPost = async () => {
    setLoadingSocial(true);
    setLoadingBlog(false);
    try {
      const response = await axios.post('http://testserver-env-2.eba-mrgeg24r.us-east-1.elasticbeanstalk.com/api/create-social-media-post', {
        title: selectedArticle.title,
        link: selectedArticle.link,
        excerpt: selectedArticle.excerpt
      });
      setSocialMediaPost(response.data.socialMediaPost);
      setEditableContent(response.data.socialMediaPost);
    } catch (error) {
      console.error('Error creating social media post', error);
      setError(error);
    } finally {
      setLoadingSocial(false);
    }
  };

  // Save changes made to the editable content
  const handleSaveChanges = () => {
    if (blogPost) {
      setBlogPost(editableContent);
    } else if (socialMediaPost) {
      setSocialMediaPost(editableContent);
    }
    alert('Changes saved!');
  };

  // Download the content as a text file
  const downloadContent = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
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
            <h2>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // Prevent the modal from opening when clicking the link
              >
                {article.title}
              </a>
            </h2>
            <p className='article-source'>Source: {article.source}</p>
            <p className='article-date'>{article.date}</p>
            <p>{article.excerpt}</p>
          </li>
        ))}
      </ul>

      {selectedArticle && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Create Post</h2>
            <p>Would you like ChatGPT to create a post about "{selectedArticle.title}"?</p>
            <button onClick={createBlogPost} disabled={loadingBlog || loadingSocial}>
              {loadingBlog ? 'Creating Blog Post...' : 'Blog Post'}
            </button>
            <button onClick={createSocialMediaPost} disabled={loadingBlog || loadingSocial}>
              {loadingSocial ? 'Creating Social Media Post...' : 'Social Media Post'}
            </button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}

      {blogPost && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Generated Blog Post</h2>
            <p style={{ textAlign: 'left' }}>This content can be edited:</p>
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              rows='10'
              style={{ width: '100%', height: '200px' }}
            />
            <button onClick={handleSaveChanges}>Save Changes</button>
            <button onClick={() => downloadContent(blogPost, 'blogPost.txt')}>Download</button>
            <a href="https://www.squarespace.com" target="_blank" rel="noopener noreferrer">
              <button>Link to Squarespace</button>
            </a>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {socialMediaPost && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Generated Social Media Post</h2>
            <p style={{ textAlign: 'left' }}>This content can be edited:</p>
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              rows='10'
              style={{ width: '100%', height: '200px' }}
            />
            <button onClick={handleSaveChanges}>Save Changes</button>
            <button onClick={() => downloadContent(socialMediaPost, 'socialMediaPost.txt')}>Download</button>
            <a href="https://www.squarespace.com" target="_blank" rel="noopener noreferrer">
              <button>Link to Squarespace</button>
            </a>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroSection;
