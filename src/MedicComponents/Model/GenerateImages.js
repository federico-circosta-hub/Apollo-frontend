export default async function GenerateImages(s) {
    const images = [];

    let imagesCount = Math.floor(Math.random() * 10);
    while (imagesCount == 0) {
        imagesCount = Math.floor(Math.random() * 10);
    }


    for (let i = 0; i < imagesCount; i++) {
        let link = 'https://dummyimage.com/1024x768/000/fff.jpg&text=' + s + i
        images.push({ 'link': link });
    }
    return images

}
