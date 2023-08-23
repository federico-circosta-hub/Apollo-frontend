export default async function GenerateImages() {
    const images = [];

    let imagesCount = Math.floor(Math.random() * 50);
    while (imagesCount == 0) {
        imagesCount = Math.floor(Math.random() * 50);
    }


    for (let i = 0; i < imagesCount; i++) {
        let link = 'https://dummyimage.com/1280x720/000/fff.jpg&text=image' + i
        images.push({ 'link': link });
    }
    return images

}
