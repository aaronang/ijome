const data = [
  {
    emoji: "😬",
    shortcode: "grimacing",
    aka: [
      "awkward",
      "eek",
      "foot in mouth", 
      "nervous", 
      "snapchat mutual #1 best friend"
    ]
  },
  {
    emoji: "😂",
    shortcode: "joy",
    aka: [
      "laughing",
      "laughing crying",
      "laughing tears",
      "lol"
    ]
  },
  {
    emoji: "❤️",
    shortcode: "heart",
    aka: [
      "heart",
      "love heart",
      "red heart"
    ]
  },
]


function emoji(data) {
  const div = document.createElement('div')
  div.className = "result"
  div.innerHTML = `<span class="emoji">${data.emoji}</span> <span class="description">${data.shortcode}</span>`
  return div
}

const results = document.getElementById("results")

data.map(emoji).forEach(element => results.appendChild(element))

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
};
