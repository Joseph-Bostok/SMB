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
      if (index >= 5) return false; // Limit to top 5 articles
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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));