$(document).foundation()

Array.prototype.move = function(element, offset) {
  let index = this.indexOf(element);
  let newIndex = index + offset;
  
  if ((newIndex > -1) && (newIndex < this.length)) {
    // Remove the element from the array
    let removedElement = this.splice(index, 1)[0];
  
    // At "newIndex", remove 0 elements, insert the removed element
    return this.splice(newIndex, 0, removedElement);
  }
};

const megaroster = {
  students: [],

  init(listSelector) {
    this.studentList = document.querySelector(listSelector)
    this.max = 0
    this.setupEventListeners()
    this.load()  
  },

  setupEventListeners() {
    document
      .querySelector('#new-student')
      .addEventListener('submit', this.handleSubmit.bind(this))
  },

  save(){
    localStorage.setItem('roster', JSON.stringify(this.students))
  },

  load(){
    const rosterArray = JSON.parse(localStorage.getItem('roster'))
    rosterArray.map(this.addStudent.bind(this))
  },

  removeStudent(ev) {
    const btn = ev.target
    const listItem = btn.closest('.student')
    for(let i = 0; i < this.students.length; i++){
      if(this.students[i].id == listItem.dataset.id){
        this.students.splice(i, 1)
        break
      }
    }
    this.save()
    listItem.remove()
  },

  promoteStudent(ev){
    const btn = ev.target
    const listItem = btn.closest('.student')
    let studentToPromote = listItem.querySelector('span')
    studentToPromote.style.fontWeight = 'bold'
  },

  handleSubmit(ev){
    ev.preventDefault()
    const f = ev.target
    const student = {
      id: this.max + 1,
      name: f.studentName.value,
    }
    this.addStudent(student)
    f.reset()
  },

  addStudent(student) {
    this.students.unshift(student)

    const listItem = this.buildListItem(student)
    this.prependChild(this.studentList, listItem)

    if(student.id > this.max){
      this.max = student.id
    }
    this.save()
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
