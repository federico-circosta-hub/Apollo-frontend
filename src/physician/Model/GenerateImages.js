export default async function GenerateImages(s) {
  const images = [];

  let imagesCount = Math.floor(Math.random() * 10);
  while (imagesCount == 0) {
    imagesCount = Math.floor(Math.random() * 10);
  }

  for (let i = 0; i < 1; i++) {
    let s = Math.random().toString(36).substring(2, 6);
    let link = "https://dummyimage.com/1024x768/000/fff.jpg&text=" + s;
    images.push({ link: link, jointRef: undefined });
  }

  return images;
}
