$(document).foundation()

class Megaroster {

  constructor(listSelector) {
    this.studentList = document.querySelector(listSelector)
    this.max = 0
    this.students = []
    this.setupEventListeners()
    this.load()  
  }

  setupEventListeners() {
    document
      .querySelector('#new-student')
      .addEventListener('submit', this.handleSubmit.bind(this))
  }

  save(){
    localStorage.setItem('roster', JSON.stringify(this.students))
  }

  load(){
    const rosterArray = JSON.parse(localStorage.getItem('roster'))
    rosterArray
      .reverse()
      .map(this.addStudent.bind(this))
  }

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
  }

  promoteStudent(student, ev){
    const btn = ev.target
    const listItem = btn.closest('.student')
    let studentToPromote = listItem.querySelector('span')
    student.promoted = !student.promoted
    if(student.promoted){
      listItem.classList.add('promoted')
    } else {
      listItem.classList.remove('promoted')
    }
    this.save()
  }

  handleSubmit(ev){
    ev.preventDefault()
    const f = ev.target
    const student = {
      id: this.max + 1,
      name: f.studentName.value,
      promoted: false,
    }
    this.addStudent(student)
    f.reset()
  }

  addStudent(student) {
    this.students.unshift(student)

    const listItem = this.buildListItem(student)
    this.prependChild(this.studentList, listItem)

    if(student.id > this.max){
      this.max = student.id
    }
    this.save()
  }

  prependChild(parent, child) {
    parent.insertBefore(child, parent.firstChild)
  }

  setupActions(li, student){
    li
      .querySelector('button.remove')
      .addEventListener('click', this.removeStudent.bind(this))
    li
      .querySelector('button.success')
      .addEventListener('click', this.promoteStudent.bind(this, student))
    li
      .querySelector('button.move-up')
      .addEventListener('click', this.moveUp.bind(this, student))
    li
      .querySelector('button.move-down')
      .addEventListener('click', this.moveDown.bind(this, student))
    li
      .querySelector('button.edit')
      .addEventListener('click', this.editName.bind(this, student))
  }

  buildListItem(student) {
    const template = document.querySelector('.student.template')
    const li = template.cloneNode(true)
    this.removeClassName(li, 'template')
    li.querySelector('.student-name').textContent = student.name
    li.dataset.id = student.id

    if(student.promoted){
      li.classList.add('promoted')
    }

    this.setupActions(li, student)
    return li
  }

  moveUp(student, ev){
    const btn = ev.target
    const li = btn.closest('.student')

    const index = this.students.findIndex((currentStudent) => {
      return currentStudent.id === student.id
    })

    if(index > 0){
      this.studentList.insertBefore(li, li.previousElementSibling)

      const previousStudent = this.students[index-1]
      this.students[index-1] = student
      this.students[index] = previousStudent

      this.save()
    }
  }

  moveDown(student, ev){
    const btn = ev.target
    const li = btn.closest('.student')

    const index = this.students.findIndex((currentStudent) => {
      return currentStudent.id === student.id
    })

    if(index > 0 && index < this.students.length-1){
      this.studentList.insertBefore(li.nextElementSibling, li)

      const previousStudent = this.students[index+1]
      this.students[index+1] = student
      this.students[index] = previousStudent

      this.save()
    }    
  }

  editName(student, ev){
    const btn = ev.currentTarget
    const icon = btn.querySelector('i.fa')
    const name = btn.closest('.student').querySelector('.student-name')
    if(name.contentEditable === 'inherit' || name.contentEditable === 'false'){
      name.contentEditable = true
      icon.classList.remove('fa-pencil')
      icon.classList.add('fa-check')
    } else {
      name.contentEditable = false
      icon.classList.remove('fa-check')
      icon.classList.add('fa-pencil')
    }

    const nameToEdit = this.students.find((currentStudent) => {
      return currentStudent.id === student.id
    })

    nameToEdit.name = name.textContent
    this.save()
  }

  removeClassName(el, className){
    el.className = el.className.replace(className, '').trim()
  }
}

const roster = new Megaroster('#studentList')