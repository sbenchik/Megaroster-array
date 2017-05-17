$(document).foundation()

const megaroster = {
  students: [],

  init(listSelector) {
    this.studentList = document.querySelector(listSelector)
    this.max = 0
    this.setupEventListeners()  
  },

  setupEventListeners() {
    document
      .querySelector('#new-student')
      .addEventListener('submit', this.addStudent.bind(this))
  },

  removeStudent(ev) {
    const btn = ev.target
    const listItem = btn.closest('.student')
    for(let i = 0; i < this.students.length; i++){
      if(this.students[i].id == listItem.dataset.id){
        this.students.splice(i, 1)
      }
    }
    listItem.remove()
  },

  promoteStudent(ev){
    const btn = ev.target
    const listItem = btn.closest('.student')
    let studentToPromote = listItem.querySelector('span')
    studentToPromote.style.fontWeight = 'bold'
  },

  addStudent(ev) {
    ev.preventDefault()
    const f = ev.target
    const student = {
      id: this.max + 1,
      name: f.studentName.value,
    }
    this.students.unshift(student)

    const listItem = this.buildListItem(student)
    this.prependChild(this.studentList, listItem)

    this.max++
    f.reset()
  },

  prependChild(parent, child) {
    parent.insertBefore(child, parent.firstChild)
  },

  buildListItem(student) {
    const template = document.querySelector('.student.template')
    const li = template.cloneNode(true)
    this.removeClassName(li, 'template')
    li.querySelector('.student-name').textContent = student.name
    li.dataset.id = student.id

    li
      .querySelector('button.remove')
      .addEventListener('click', this.removeStudent.bind(this))
    li
      .querySelector('button.success')
      .addEventListener('click', this.promoteStudent.bind(this))
    return li
  },

  removeClassName(el, className){
    el.className = el.className.replace(className, '').trim()
  }
}
megaroster.init('#studentList')
