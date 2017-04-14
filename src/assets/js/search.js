function emoji(data) {
  const div = document.createElement('div')
  div.className = "result"
  div.innerHTML = `<span class="emoji">${data.emoji}</span> <span class="description">${data.aliases[0]}</span>`
  return div
}

const results = document.getElementById("results")

emojis.map(emoji).forEach(element => results.appendChild(element))

results.firstElementChild.classList.add("selected")

let selected = null

const search = document.getElementById("search")

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
  } else if (e.keyCode === 13) { // Enter
    const emoji = selected.firstChild.textContent
    const {ipcRenderer} = require('electron')
    ipcRenderer.send('finish', emoji)
    selected.classList.remove("selected")
    results.firstElementChild.classList.add("selected")
    search.value = ""
    selected = null
  } 
}

search.onkeyup = function(e) {
  if (e.keyCode !== 9 && e.keyCode !== 13) {
    filterEmojis()
    selected = results.firstElementChild
    selected.classList.add("selected")
  }
}

function filterEmojis() {
  const query = search.value
  console.log(query)
  results.innerHTML = ""
  emojis.filter(e => e.aliases[0].includes(query))
      .forEach(element => results.appendChild(emoji(element)))
}
