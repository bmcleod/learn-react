import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import got from 'got';

export default async function handler(request, response) {
  const requestUrl = request.query?.url;
  if (!requestUrl) {
    return response.status(400).send('URL parameter missing in request query.');
  }

  const metascraperInstance = metascraper([
    metascraperDescription(),
    metascraperImage(),
    metascraperTitle(),
  ]);

  console.log(`Scraping ${requestUrl}...`);
  const { body: html, url } = await got(requestUrl);
  const metadata = await metascraperInstance({ html, url });
  return response.status(200).json(metadata);
}
