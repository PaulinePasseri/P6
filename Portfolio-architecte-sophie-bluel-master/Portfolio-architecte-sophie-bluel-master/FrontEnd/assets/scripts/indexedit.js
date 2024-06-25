window.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("token")) {
        window.location.href = "../login.html";
    }
})

// Gestion de la modale
let modal = null
const focusableSelector = "button, a, input, textarea"
let focusables = []

// Ouverture de la modale
const openModal = function(e) {
    modal = document.querySelector(e.target.getAttribute("href"))
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    modal.style.display = null
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
    
    fetch("http://localhost:5678/api/works").then(response => {
        response.json().then(data => {
            data.forEach(work => {
                let container = document.createElement("div")
                container.classList.add("image-container")

                let images = document.createElement("img")
                images.src = work.imageUrl
                images.setAttribute("id", work.id)
                container.appendChild(images)

                let icons = document.createElement("span")
                icons.innerHTML = `<i class="fa-solid fa-trash-can"></i>`
                container.appendChild(icons)

                
                icons.addEventListener("click", () => {
                    container.remove()
                    let mainImage = document.querySelector(`.gallery img[id='${work.id}']`).closest("figure")
                    mainImage.remove()
                })

                document.querySelector("#galleryEdit").appendChild(container)
            })
        })
    })

}


const firstModal = document.querySelector(".js-modal")
firstModal.addEventListener("click", openModal)

// Fermeture de la modale
const closeModal = function(e) {
    if (modal === null) return
    window.setTimeout(function() {
        modal.style.display = "none"
        modal = null
    }, 200)
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    setTimeout(() => {
        document.querySelector("#galleryEdit").innerHTML = ""
    }, 200)
}

// Permet de bloquer la propagation de l'événement e 
const stopPropagation = function(e) {
    e.stopPropagation()
}


// Parcours de la modale au clavier
const focusInModal = function(e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"))
    index++
    if (index >= focusables.length) {
        index = 0
    }
    focusables[index].focus()
}

window.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})

// Changement de fenêtre modale 
const secondModal = document.querySelector(".js-modal-add")
secondModal.addEventListener("click", (e) => {
    closeModal(e)
    setTimeout(() => {
        modal = document.querySelector("#modalAdd")
        openModal({target: {getAttribute: () => "#modalAdd"}})
    }, 200)
})

const previousModal = document.querySelector(".js-modal-previous")
previousModal.addEventListener("click", (e) => {
    closeModal(e)
    setTimeout(() => {
        modal = document.querySelector("#modal")
        openModal({target: {getAttribute: () => "#modal"}})
    }, 200)
})