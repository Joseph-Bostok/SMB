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
      if (index >= 10) return false;
      const titleTag = $(element).find('h2.entry-title');
      if (!titleTag.length) return;

      const title = titleTag.text().trim();
      const link = titleTag.find('a').attr('href');

      articles.push({ title, link, source: 'ADDitude' });
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
      if (index >= 10) return false;
      const titleTag = $(element).find('h2.teaser-lg__title');
      const authorTag = $(element).find('p.teaser-lg__byline');
      const excerptTag = $(element).find('p.teaser-lg__summary');

      if (!titleTag.length) {
        console.log('No title tag found');
        return;
      }

      const title = titleTag.text().trim();
      const link = `https://www.psychologytoday.com${titleTag.find('a').attr('href')}`;
      const author = authorTag.length ? authorTag.text().trim() : 'No author available.';
      const excerpt = excerptTag.length ? excerptTag.text().trim() : 'No excerpt available.';

      articles.push({ title, link, author, excerpt, source: 'Psychology Today' });
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
      if (i < 10) {
        const title = $(element).find('.PagePromoContentIcons-text').text().trim();
        const link = $(element).find('a').attr('href');
        const excerpt = $(element).find('.PagePromoContentIcons-text').text().trim();
        const fullLink = link.startsWith('http') ? link : `https://apnews.com${link}`;

        articles.push({
          title,
          link: fullLink,
          excerpt,
          source: 'Associated Press'
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
app.post('/api/create-blog-post', async (req, res) => {
  const { title, link, excerpt } = req.body;

  const prompt = `
    Title: ${title}
    Link: ${link}
    Excerpt: ${excerpt}

    Create a blog style social media post based on the information provided.
    be friendly and approachable. the post should be between 200-300 words.
    do not use emojis or other special characters. even though you are friendly and approachable, make it professional.
    try to include some evidence based results from the link.
    include numbers and statistics in the post. (if possible)
    try to add some simple community support at the end and ask for thoughtful interactions.
  `;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4-0613',
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
      res.status(error.response.status).json({ message: error.response.data });
    } else if (error.request) {
      res.status(500).json({ message: 'No response received from OpenAI' });
    } else {
      res.status(500).json({ message: 'Error creating blog post' });
    }
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
