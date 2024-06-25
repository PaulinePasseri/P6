let gallery = document.querySelector(".gallery")
let works = []

// Récupération de l'API
fetch("http://localhost:5678/api/works").then(response => {
    response.json().then(data => {
        works = data
        generateGallery(works)
    })
})

// Galerie générée 
function generateGallery(images) {
    gallery.innerHTML = ""
    images.forEach(image => {
        gallery.innerHTML += 
        `<figure>
            <img src="${image.imageUrl}" alt="galerie" id="${image.id}"><br>
            <figcaption>${image.title}</figcaption>
        </figure>`
    })
}


// Gestion des filtres 
const btnTous = document.getElementById("btn-tous")
btnTous.addEventListener("click", function() {
    const galerieTous = works
    generateGallery(galerieTous)
    btnActive(btnTous)
})

const btnObjets = document.getElementById("btn-objets")

btnObjets.addEventListener("click", function () {
    const galerieObjets = works.filter(function(item) {
        return item.category.name === "Objets"
        })
        generateGallery(galerieObjets)
        btnActive(btnObjets)
})

const btnAppartements = document.getElementById("btn-appartements")

btnAppartements.addEventListener("click", function () {
    const galerieAppartements = works.filter(function(item) {
        return item.category.name === "Appartements"
        })
        generateGallery(galerieAppartements)
        btnActive(btnAppartements)
})

const btnHotels = document.getElementById("btn-hotels")

btnHotels.addEventListener("click", function () {
    const galerieHotels = works.filter(function(item) {
        return item.category.name === "Hotels & restaurants"
        })
        generateGallery(galerieHotels)
        btnActive(btnHotels)
})

function btnActive(e) {
    document.querySelector(".filters__btn--clicked").classList.remove("filters__btn--clicked")    
    e.classList.add("filters__btn--clicked")
}

