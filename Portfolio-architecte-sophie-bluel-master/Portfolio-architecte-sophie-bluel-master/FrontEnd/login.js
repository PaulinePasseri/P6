let submit = document.querySelector("#btn-submit")

submit.addEventListener("click", () => {
    login()
})

async function login() {
    let bodystr = {
    "email": document.querySelector("#email").value,
    "password": document.querySelector("#password").value,
    }
    await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        body: JSON.stringify(bodystr) 
    }).then(response => {
        response.json().then(data => {
            console.log(data)
        })
    })
}
