import {
  $cards
} from '/js/api.js'

const $templateCards = document.getElementById('template-cards').content,
  $templateCart = document.getElementById('template-cart').content,
  $fragment = document.createDocumentFragment(),
  $paintCards = document.querySelector('.cards'),
  $tBody = document.querySelector('#cart tbody'),
  $modal = document.querySelector('.modalbox h2'),
  $content = document.querySelector(".content"),
  $contentTop = $content.offsetTop,
  $logo = document.querySelector(".logo")
window.addEventListener("scroll", fixnavbar)

document.addEventListener('DOMContentLoaded', (e) => {
  let arrayCards = JSON.parse(localStorage.getItem('cardData')) || []
  arrayCards.forEach(card => {
    addToCart(card)
  })
  e.stopPropagation()
})

document.body.addEventListener('click', (e) => {
  actions(e)
  e.stopPropagation()
})

document.body.addEventListener('change', function (e) {
  actions(e)
  e.stopPropagation()
})

$logo.addEventListener("click", function (e) {
  e.preventDefault()
  let cards = document.querySelectorAll(".cards")
  let cart = document.querySelector('.submenu')

  cards.forEach(card => {
    card.classList.remove("animate__animated")
    card.classList.remove("animate__fadeInDown")
    card.classList.add("animate__animated")
    card.classList.add("animate__fadeOutUp")
  })

  cart.classList.remove("animate__animated")
  cart.classList.remove("animate__fadeInDown")
  cart.classList.add("animate__animated")
  cart.classList.add("animate__fadeOutUp")

  setTimeout(function () {
    location.href = "/"
  }, 600)
})

function fixnavbar() {
  if (window.scrollY >= $contentTop) {
    document.body.style.paddingTop = $content.offsetHeight + "px"
    document.body.classList.add("fixed-nav")
  } else {
    document.body.style.paddingTop = 0
    document.body.classList.remove("fixed-nav")
  }
}

const paintCards = ($cards) => {
  let counter = 0
  $cards.forEach($card => {
    $templateCards.querySelector('img').src = $card.img
    $templateCards.querySelector('img').setAttribute('alt', $card.img)
    $templateCards.querySelector('img').setAttribute('width', 200)
    $templateCards.querySelector('img').setAttribute('height', 300)
    $templateCards.querySelector('h3').textContent = $card.title
    $templateCards.querySelector('span').textContent = $card.price
    $templateCards.querySelector('button').dataset.id = counter
    counter++
    const clone = $templateCards.cloneNode(true)
    $fragment.appendChild(clone)
  })
  $paintCards.appendChild($fragment)
}

const actions = (e) => {

  if (e.target.matches('.card button')) {
    let quantity = '1',
      addToCartObj = createObjCard(e, quantity)
    const $id = e.target.dataset.id,
      $tr = e.target.parentElement,
      $elementsTitle = document.getElementsByTagName('h5'),
      $elementTitle = $tr.querySelector('h3').textContent

    for (let i = 0; i < $elementsTitle.length; i++) {
      let $elementQuantity = $elementsTitle[i].closest('tr').querySelector('.input')
      if ($elementsTitle[i].textContent === $elementTitle) {
        $elementQuantity.value++
        let obj = createObjCard(e, $elementQuantity.value)
        addToCartObj = obj
        updateValueToLocalStorage($id, $elementQuantity.value)
        updateCart()
        return
      }
    }
    saveCardsToLocalStorage(addToCartObj)
    addToCart(addToCartObj)
  }

  if (e.target.matches('.delete-card')) {
    e.preventDefault()
    deleteInCart(e)
  }

  if (e.target.matches('.input')) {
    loopIds(e)
  }

  if (e.target.matches('#button-empty')) {
    e.preventDefault()
    removeAll()
    clearLocalstorage()
  }

  if (e.target.matches('#button-buy')) {
    buyCards(e)
    //removeAll()
  }
}

const createObjCard = (e, quantity) => {
  const $parent = e.target.parentElement,
    $image = $parent.querySelector('img').src,
    $title = $parent.querySelector('h3').textContent,
    $price = $parent.querySelector('span').textContent,
    $id = $parent.querySelector('button').dataset.id

  return {
    image: $image,
    title: $title,
    price: $price,
    id: $id,
    quantity
  }
}

const addToCart = (cardObj) => {
  $templateCart.querySelector('img').src = cardObj.image
  $templateCart.querySelector('img').alt = cardObj.title
  $templateCart.querySelector('h5').textContent = cardObj.title
  $templateCart.querySelector('.input').value = cardObj.quantity
  $templateCart.querySelector('span').textContent = cardObj.price
  $templateCart.querySelector('.input').dataset.id = cardObj.id
  const clone = $templateCart.cloneNode(true)
  $fragment.appendChild(clone)
  $tBody.appendChild($fragment)
  updateCart()
}

const deleteInCart = (e) => {
  const id = e.target.closest('tr').querySelector('.input').dataset.id
  deleteToLocalStorage(id)
  e.target.closest('tr').remove()
  updateCart()
}

const removeAll = () => {
  $tBody.innerHTML = ''
  updateCart()
}

const buyCards = (e) => {
  const buyTotal = e.target.closest('#cart').firstElementChild.textContent
  let total = Number(buyTotal.replace('Total $', ''))
  $modal.innerHTML = ''
  if (isNaN(total)) total = 0
  if (total === 0) $modal.innerHTML += `<h2>The purchase was not made<br>Total: $${total}</h2>`
  else $modal.innerHTML += `<h2>Successful purchase<br>Total: $${total}</h2>`
  updateCart()
}

const loopIds = (e) => {
  let ids = JSON.parse(localStorage.getItem('cardData')) || []
  let idEvent = e.target.dataset.id
  ids.forEach((id) => {
    if (id.id === idEvent) {
      updateQuantity(e)
      updateValueToLocalStorage(idEvent, e.target.value)
    }
  })
}

const updateQuantity = (e) => {
  if (e.target.value <= 0) e.target.value = 1
  updateCart()
}

const updateCart = () => {
  let total = 0
  const $calculateCartTotal = document.querySelector('#cart .empty'),
    $elements = document.querySelectorAll('#cart tbody tr')
  $elements.forEach($element => {
    const $price = $element.querySelector('span').textContent,
      $quantity = $element.querySelector('.input').value
    total += Number($price * $quantity)
  })
  $calculateCartTotal.textContent = `Total $${total}`
}

const saveCardsToLocalStorage = (addToCartObj) => {
  let addToCartObjArray = JSON.parse(localStorage.getItem('cardData'))
  if (addToCartObjArray === null) addToCartObjArray = []
  addToCartObjArray.push(addToCartObj)
  localStorage.setItem('cardData', JSON.stringify(addToCartObjArray))
}

const deleteToLocalStorage = (id) => {
  const deleteCardsArray = JSON.parse(localStorage.getItem('cardData'))
  deleteCardsArray.forEach((deleteCard, index) => {
    if (deleteCard.id === id) deleteCardsArray.splice(index, 1)
  })
  localStorage.setItem('cardData', JSON.stringify(deleteCardsArray))
}

const updateValueToLocalStorage = (id, quantityvalue) => {
  const UpdateCardsArray = JSON.parse(localStorage.getItem('cardData')) || []
  UpdateCardsArray.forEach(element => {
    if (element.id === id) element.quantity = quantityvalue
  })
  localStorage.setItem('cardData', JSON.stringify(UpdateCardsArray))
}

const clearLocalstorage = () => {
  localStorage.clear()
}
paintCards($cards)