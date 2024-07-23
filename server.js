const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

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
      if (index >= 5) return false; // Limit to top 5 articles
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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));