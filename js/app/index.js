import firebase from "./app.js"
import { getCookies, setCookies } from "./cookies.js"

const id_user = getCookies("SESSION_USER")

if(!!id_user) window.location.href = "./home.html"

const database   = firebase.database()
const formSignIn = document.querySelector("#formSignIn")

const signIn = async (event) => {
    event.preventDefault()
    const data     = new FormData(formSignIn)
    const senha    = data.get("password")
    const username = data.get("username")

    database.ref(`usuarios`).orderByChild('username').equalTo(username).once("value").then(function(data) {
            const fb_id_user = Object.keys(data.val())[0]
            const child = Object.values(data.val())[0]

            if(child.senha != senha) return alert("user in not found")
            setCookies("SESSION_USER",fb_id_user, 1)
            window.location.href = "./home.html"
    });
}

formSignIn.addEventListener("submit", signIn)