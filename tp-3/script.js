const nom = document.getElementById('nom')
nom.addEventListener('blur', validerNom)
const quantity = document.getElementById('quantity')
quantity.addEventListener('change', validerQuantity)
const formulaireJeu = document.getElementById('creationJeu')
formulaireJeu.addEventListener('submit', gererSoumission)
const jeu = document.getElementById('jeu')
let arrPaires = null
let carte1 = null
let carte2 = null
/* Creating a variable called minuteries and setting it to an object with a property called
tempsPartie and setting it to 300. */
const minuteries = {
  tempsPartie: 300
}
/* Creating a variable called donnees and setting it to an object with two properties, nbPaires and
nom. */
const donnees = {
  nbPaires: 0,
  nom: ''
}
// Initialise le jeu
function gererSoumission (e) {
  e.preventDefault()
  const nbCartes = document.getElementById('quantity').value
  if (nbCartes < 2 || nbCartes > 10) {
    alert('vous devez entrer entre 2 et 10...')
  } else {
    if (nom.value === '') {
      alert('Vous devez choisir un Nom')
    } else {
      lancerJeu(nbCartes)
    }
  }
}
// charge les info du jeu
function lancerJeu (numCartes) {
  formulaireJeu.remove()
  document.getElementsByClassName('msg')[0].classList.remove('msg')
  donnees.nbPaires = numCartes
  donnees.nom = ''
  creerCartes(numCartes)
  changerTemps()
  minuteries.tempsAffichage = setInterval(changerTemps, 1000)
}
// minuterie
function changerTemps () {
  const minutes = Math.floor(minuteries.tempsPartie / 60)
  const secondes = minuteries.tempsPartie % 60
  document.getElementById('timer').textContent = minutes + ':' + (secondes < 10 ? '0' + secondes : secondes)
  minuteries.tempsPartie--
  if (minuteries.tempsPartie < 0) {
    clearInterval(minuteries.tempsAffichage)
    perdu()
  }
}

/**
 * It displays an alert message and then redirects the user to the index.html page
 */
function perdu () {
  alert('Vous avez perdu !')
  window.location.href = 'http://127.0.0.1:5500/tp-3/index.html'
}
/**
 * It displays an alert message and then reloads the page
 */
function gagne () {
  alert('Vous avez gagné !')
  window.location.href = 'http://127.0.0.1:5500/tp-3/index.html'
}
// Function pour créer les pairs de cartes du jeu
function creerCartes () {
  const nbCartes = quantity.value
  arrPaires = new Array(nbCartes)
  for (let i = 0; i < nbCartes; i++) {
    arrPaires[i] = i
  }
  const cartes = hasard(nbCartes)
  for (let i = 0; i < cartes.length; i++) {
    creerCarte(cartes[i])
  }
}
/**
 * It creates an array of length nbCartes * 2, then fills it with random numbers from 0 to nbCartes -
 * 1, and then returns the array.
 * @returns An array of numbers.
 */
function hasard (nbCartes) {
  const arrCartes = new Array(nbCartes * 2)
  for (let i = 0; i < arrCartes.length; i++) {
    let position = Math.floor(Math.random() * (nbCartes * 2))
    while (arrCartes[position] !== undefined) {
      position = Math.floor(Math.random() * (nbCartes * 2))
    }
    arrCartes[position] = i >= nbCartes ? i - nbCartes : i
  }
  return arrCartes
}

// Crée la carte du Jeu
function creerCarte (numero) {
  const carte = document.createElement('button')
  carte.appendChild(createImg())
  carte.classList.add('btn')
  carte.setAttribute('data-num', numero)
  carte.addEventListener('click', gereClicCarte)
  jeu.appendChild(carte)
}
/**
 * It creates an image element, sets the source to a specific image, and returns the image element.
 * @returns The imageCarte variable is being returned.
 */
function createImg () {
  const imageCarte = document.createElement('img')
  imageCarte.src = 'assets/images/interrogacao.png'

  return imageCarte
}
// Gere le click sur la carte du Jeu
function gereClicCarte (e) {
  // Identifier le numero de la carte
  const numeroCarte = e.target.parentElement.getAttribute('data-num')
  // Si le première carte sur deux
  if (!carte1) {
    // Cache l'image
    carte1 = e.target.parentElement
    e.target.parentElement.textContent = numeroCarte
    e.target.setAttribute('style', 'display:none')
  } else {
    carte2 = e.target.parentElement
    e.target.parentElement.textContent = numeroCarte
    e.target.setAttribute('style', 'display:none')
    if (carte1.textContent !== numeroCarte) {
      setTimeout(flipCarte, 1000)
    } else {
      arrPaires.splice(arrPaires.indexOf(parseInt(numeroCarte)), 1)
      carte1 = null
      carte2 = null
      if (arrPaires.length === 0) {
        setTimeout(gagne, 500)
      }
    }
  }
}
/**
 * If the two cards are the same, then remove the event listeners from the cards and set the cards to
 * null.
 */
function flipCarte () {
  carte1.textContent = ''
  carte1.appendChild(createImg())
  carte2.textContent = ''
  carte2.appendChild(createImg())
  carte1 = null
  carte2 = null
}
// Valide si le nom informé dans le formulaire est alphanumérique
function validerNom () {
  const nomSaisi = nom.value
  const expressionRegNom = /[0-9a-z]+$/i
  const EstAlphanumerique = expressionRegNom.test(nomSaisi)
  if (nomSaisi === '' || !EstAlphanumerique) {
    document.getElementById('nom-erreur').textContent = 'Vous devez choisir un Nom'
    nom.classList.add('invalid')
  } else {
    document.getElementById('nom-erreur').textContent = ''
    nom.classList.remove('invalid')
  }
}
// Valide la quantité de pairs de cartes informée dans le formulaire
function validerQuantity () {
  const quantitySaisi = quantity.value
  if (quantitySaisi >= 2 && quantitySaisi <= 10) {
    document.getElementById('quantity-erreur').textContent = ''
    quantity.classList.remove('invalid')
  } else {
    document.getElementById('quantity-erreur').textContent = 'Vous devez choisir entre 2 et 10 pour le nombre de paires.'
    quantity.classList.add('invalid')
  }
}
