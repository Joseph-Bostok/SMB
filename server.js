const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = 'sk-proj-UL9FoEkpJwMs3GewfACkT3BlbkFJVJjiXngKOYBPXOxLPgid';

// Existing routes...

app.get('/api/additude', async (req, res) => {
  try {
    const url = 'https://www.additudemag.com';
    const response = await axios.get(url);
    if (response.status !== 200) {
      return res.status(500).send('Failed to retrieve articles.');
    }

    const html = response.data;
    const $ = cheerio.load(html);
    let articles = [];

    $('article.post-list-item').each((index, element) => {
      if (index >= 10) return false; // Limit to top 5 articles
      const titleTag = $(element).find('h2.entry-title');
      if (!titleTag.length) return;

      const title = titleTag.text().trim();
      const link = titleTag.find('a').attr('href');

      articles.push({ title, link });
    });

    for (let article of articles) {
      try {
        const articleResponse = await axios.get(article.link);
        if (articleResponse.status !== 200) continue;

        const articleHtml = articleResponse.data;
        const article$ = cheerio.load(articleHtml);
        const excerptTag = article$('h2.article-excerpt');
        const excerpt = excerptTag.length ? excerptTag.text().trim() : 'No excerpt available.';

        article.excerpt = excerpt;
      } catch (error) {
        console.error(`Error fetching article ${article.link}:`, error);
        article.excerpt = 'No excerpt available.';
      }
    }

    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).send('Server error');
  }
});

app.get('/api/psychology-today', async (req, res) => {
  try {
    const url = 'https://www.psychologytoday.com/us';
    const response = await axios.get(url);
    if (response.status !== 200) {
      return res.status(500).send('Failed to retrieve articles.');
    }

    const html = response.data;
    const $ = cheerio.load(html);
    let articles = [];

    console.log('Scraping articles from Psychology Today...');

    $('.teaser-lg--main').each((index, element) => {
      if (index >= 10) return false; // Limit to top 5 articles
      const titleTag = $(element).find('h2.teaser-lg__title');
      const authorTag = $(element).find('p.teaser-lg__byline');
      const excerptTag = $(element).find('p.teaser-lg__summary');

      console.log('Title Tag:', titleTag.text());
      console.log('Author Tag:', authorTag.text());
      console.log('Excerpt Tag:', excerptTag.text());

      if (!titleTag.length) {
        console.log('No title tag found');
        return;
      }

      const title = titleTag.text().trim();
      const link = `https://www.psychologytoday.com${titleTag.find('a').attr('href')}`;
      const author = authorTag.length ? authorTag.text().trim() : 'No author available.';
      const excerpt = excerptTag.length ? excerptTag.text().trim() : 'No excerpt available.';

      console.log(`Article found: ${title}`);
      articles.push({ title, link, author, excerpt });
    });

    if (articles.length === 0) {
      console.error('No articles found. The structure of the page might have changed.');
    }

    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).send('Server error');
  }
});

app.get('/api/associatedpress', async (req, res) => {
  try {
    const response = await axios.get('https://apnews.com/hub/be-well');
    const html = response.data;
    const $ = cheerio.load(html);
    const articles = [];

    $('.TwoColumnContainer7030 .PageList-items .PageList-items-item').each((i, element) => {
      if (i < 5) {
        const title = $(element).find('.PagePromoContentIcons-text').text().trim();
        const link = $(element).find('a').attr('href');
        const excerpt = $(element).find('.PagePromoContentIcons-text').text().trim(); // Adjust this line as per actual HTML structure
        const fullLink = link.startsWith('http') ? link : `https://apnews.com${link}`;

        articles.push({
          title,
          link: fullLink,
          excerpt
        });
      }
    });

    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Error fetching articles' });
  }
});


app.get('/api/associatedpress', async (req, res) => {
  try {
    const response = await axios.get('https://apnews.com/hub/be-well');
    const html = response.data;
    const $ = cheerio.load(html);
    const articles = [];

    $('.TwoColumnContainer7030 .PageList-items .PageList-items-item').each((i, element) => {
      if (i >= 10) {
        const title = $(element).find('.PagePromoContentIcons-text').text().trim();
        const link = $(element).find('a').attr('href');
        const excerpt = $(element).find('.PagePromoContentIcons-text').text().trim(); // Adjust this line as per actual HTML structure
        const fullLink = link.startsWith('http') ? link : `https://apnews.com${link}`;

        articles.push({
          title,
          link: fullLink,
          excerpt
        });
      }
    });

    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Error fetching articles' });
  }
});
// Create a blog post using ChatGPT
//currently doesnt work as we need more credits.
app.post('/api/create-blog-post', async (req, res) => {
  const { title, link, excerpt } = req.body;

  const prompt = `
    Title: ${title}
    Link: ${link}
    Excerpt: ${excerpt}

    Please create a detailed blog post based on the above information. This from the perspective of a PHD level therapist / psychologist.
  `;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: prompt }],
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const blogPost = response.data.choices[0].message.content.trim();
      res.json({ blogPost });
    } else {
      console.error('Invalid response structure:', response.data);
      res.status(500).json({ message: 'Invalid response from OpenAI' });
    }
  } catch (error) {
    console.error('Error creating blog post:', error.message);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      res.status(error.response.status).json({ message: error.response.data });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request data:', error.request);
      res.status(500).json({ message: 'No response received from OpenAI' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      res.status(500).json({ message: 'Error creating blog post' });
    }
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));