const fs = require('fs');
const path = require('path');
const axios = require('axios');


const IMAGE_DIR = path.join(__dirname, '../../public/images');

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR);
}

const fetchPokemonCardData = async () => {
  try {
    const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
      headers: {
        'X-Api-Key': '1d84c1e5-29e3-4712-8ffd-891feb21094e',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching card data:', error);
    return [];
  }
};

const downloadImage = async (url : string, filename : string): Promise<void> => {
  const imagePath = path.join(IMAGE_DIR, filename);

  console.log(`Downloading image from ${url} to ${imagePath}`);
  
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(fs.createWriteStream(imagePath));

    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        console.log(`Image saved: ${imagePath}`); // Log success message
        resolve();
      });

      response.data.on('error', (err : any) => {
        console.error(`Error saving image: ${err.message}`);
        reject(err);
      });
    });
  } catch (error) {
    console.error('Error downloading image:', error);
  }
};


export const fetchAndStorePokemonCards = async (): Promise<void> => {
  const cards = await fetchPokemonCardData();
  
  for (const card of cards) {
    const imageUrl = card.images.large;
    const imageName = `${card.id}.png`; 

    await downloadImage(imageUrl, imageName);
    console.log(`Downloaded and saved image for ${card.name}`);
  }
};