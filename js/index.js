'use strict'
const elForm = elSelector('.js-form')
const elInput = elSelector('.js-input', elForm)
const elLists = elSelector('.js-lists')
const elCount = elSelector('.count')
const elTemplate = elSelector('.js-template').content

let data = JSON.parse(localStorage.getItem('allTodo'))
let allTodo = data ? data : []

let onCompleted = (id, isCompleted) => {
  allTodo.forEach((todo) => {
    if (todo.id === id) {
      todo.isCompleted = isCompleted
    }
  })
  localStorage.setItem('allTodo', JSON.stringify(allTodo))
  onRender(allTodo)
}

let onEdit = (id) => {
  allTodo.forEach((todo) => {
    if ((todo.id === id)) {
      let editText = prompt('Edit Todo', todo.text)
      todo.text = editText
    }
  })
  localStorage.setItem('allTodo', JSON.stringify(allTodo))
  onRender(allTodo)
}

let onDelete = (id) => {
  let arr = []
  allTodo.forEach((todo) => {
    if (todo.id !== id) {
      return arr.push(todo)
    }
  })
  allTodo = arr
  onRender(arr)
  localStorage.setItem('allTodo', JSON.stringify(allTodo))
}

let onRender = (arr) => {
  elLists.innerHTML = null
  elCount.textContent = 'Count : ' + arr.length

  arr.forEach((item) => {
    let elTodo = elTemplate.cloneNode(true)

    let elLi = elTodo.querySelector('.todo-li')
    let elText = elTodo.querySelector('.js-text')
    let elCheckbox = elTodo.querySelector('.js-input-check')

    if (item.isCompleted) {
      elText.classList.add('text-decoration-line-through')
    }

    elText.textContent = item.text
    elLi.dataset.id = item.id
    elCheckbox.checked = item.isCompleted

    elLists.append(elTodo)
  })
}

let onSubmit = (evt) => {
  evt.preventDefault()
  let inputValue = elInput.value.trim()

  if (!inputValue) {
    alert('Input Todo')
    elInput.value = null
    return
  }

  let newTodo = {
    id: allTodo.at(0) ? allTodo.at(0)?.id + 1 : 1,
    text: inputValue,
    isCompleted: false,
  }

  allTodo.unshift(newTodo)
  onRender(allTodo)
  localStorage.setItem('allTodo', JSON.stringify(allTodo))

  elInput.value = null
  elInput.focus()
}

let eventDelegation = (evt) => {
  let parentEl = evt.target.closest('.todo-li')
  let elId = parentEl.dataset.id - 0
  if (evt.target.matches('.js-delete')) {
    onDelete(elId)
  } else if (evt.target.matches('.js-edit')) {
    onEdit(elId)
  } else if (evt.target.matches('.js-input-check')) {
    onCompleted(elId, evt.target.checked)
  }
}

onRender(allTodo)
elForm.addEventListener('submit', onSubmit)
elLists.addEventListener('click', eventDelegation)
