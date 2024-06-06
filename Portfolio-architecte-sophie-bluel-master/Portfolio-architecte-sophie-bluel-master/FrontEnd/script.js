async function generateGallery () {
    const response = await fetch("http://localhost:5678/api/works")
    const data = await response.json()
    let gallery = document.querySelector(".gallery")
    for (let i=0 ; i < data.length ; i++) {
        gallery.innerHTML += 
        `<figure>
            <img src="${data[i].imageUrl}" alt="galerie"><br>
            <figcaption>${data[i].title}</figcaption>
        </figure>`
    }
}

generateGallery()