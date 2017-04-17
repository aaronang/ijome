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
  console.log(query)
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
  } else if (e.keyCode === 27) { // Esc
    ipcRenderer.send('escape')
    search.value = ""
    selected.classList.remove("selected")
    selected = results.firstElementChild
    selected.classList.add("selected")
  }
}

search.onkeyup = function(e) {
  if (e.keyCode !== 9 && e.keyCode !== 13) {
    filterEmojis()
    selected = results.firstElementChild
    selected.classList.add("selected")
  }
}
