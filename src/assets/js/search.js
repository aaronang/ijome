import {ipcRenderer} from 'electron'
import emojis from './assets/js/emoji'

const results = document.getElementById("results")
const search = document.getElementById("search")
let selected = null

emojis.map(emoji).forEach(element => results.appendChild(element))
results.firstElementChild.classList.add("selected")

function mouseenter(e) {
  if (selected !== null) {
    selected.classList.remove("selected")
  } else {
    results.firstElementChild.classList.remove("selected")
  }
  selected = e.target
  selected.classList.add("selected")
  search.value = selected.lastChild.textContent
}

function click(e) {
  selected = e.currentTarget
  const emoji = selected.firstChild.textContent
  ipcRenderer.send('finish', emoji)
  selected.classList.remove("selected")
  results.firstElementChild.classList.add("selected")
  search.value = ""
  selected = null
  window.scrollTo(0, 0)
  search.focus()
}

function emoji(data) {
  const div = document.createElement('div')
  div.className = "result"
  div.innerHTML = `<span class="emoji">${data.emoji}</span> <span class="description">${data.aliases[0]}</span>`
  div.addEventListener('mouseenter', mouseenter)
  div.addEventListener('click', click)
  return div
}

function filterEmojis() {
  const query = search.value
  results.innerHTML = ""
  emojis.filter(e => e.aliases[0].includes(query))
      .forEach(element => results.appendChild(emoji(element)))
}

search.onkeydown = function(e) {
  if (e.keyCode === 9) { // Tab
    e.preventDefault()
    if (selected === null) {
      selected = results.firstElementChild
    } else {
      selected.classList.remove("selected")
      selected = selected.nextSibling || results.firstElementChild
      selected.classList.add("selected")
    }
    search.value = selected.lastChild.textContent
    selected.scrollIntoView(false)
  } else if (e.keyCode === 13) { // Enter
    const emoji = selected.firstChild.textContent
    ipcRenderer.send('finish', emoji)
    selected.classList.remove("selected")
    results.firstElementChild.classList.add("selected")
    search.value = ""
    selected = null
    window.scrollTo(0, 0)
  } else if (e.keyCode === 27) { // Esc
    ipcRenderer.send('escape')
    search.value = ""
    selected.classList.remove("selected")
    selected = results.firstElementChild
    selected.classList.add("selected")
  } else if (e.keyCode === 37 || e.keyCode === 38) { // Left, Up
    e.preventDefault()
    if (selected === null) {
      selected = results.firstElementChild
    } else if (selected !== results.firstElementChild) {
      selected.classList.remove("selected")
      selected = selected.previousSibling || results.firstElementChild
      selected.classList.add("selected")
    }
    search.value = selected.lastChild.textContent
    selected.scrollIntoView(false)
  } else if (e.keyCode === 39 || e.keyCode === 40) { // Right, Down
    e.preventDefault()
    if (selected === null) {
      selected = results.firstElementChild
    } else {
      selected.classList.remove("selected")
      selected = selected.nextSibling || results.firstElementChild
      selected.classList.add("selected")
    }
    search.value = selected.lastChild.textContent
    selected.scrollIntoView(false)
  }
}

search.onkeyup = function(e) {
  if (e.keyCode !== 9 && 
      e.keyCode !== 13 && 
      e.keyCode !== 186 && 
      e.keyCode !== 91 &&
      e.keyCode !== 37 &&
      e.keyCode !== 38 &&
      e.keyCode !== 39 &&
      e.keyCode !== 40) {
    filterEmojis()
    selected = results.firstElementChild
    selected.classList.add("selected")
  }
}
