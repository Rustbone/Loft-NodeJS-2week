const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const db = require('../db')
const path = require('path')
const fs = require('fs')



router.get('/', (req, res, next) => {  
  // TODO: Реализовать, подстановку в поля ввода формы 'Счетчики'
  // актуальных значений из сохраненых (по желанию)
  // fs.readFile('data.json', 'utf8', (err, data) => {
  //   if (err) {
  //     console.error(err)
  //     return
  //   }
  //   const savedSkill = JSON.parse(data).skills.map(skill => skill.number)
  //   req.flash('skill', savedSkill)
  //   // console.log(savedSkill)
  //   res.render('pages/admin', { 
  //     title: 'Admin page', 
  //     msgskill: req.flash('msgskill')[0],
  //     msgfile: req.flash('msgfile')[0],
  //     value: savedSkill
  //   }) 
  // }) 
  const skills = db.get('skills').value()
  const skill = skills.map(skill => skill.number)
  // req.flash('value', skill)
  
  res.render('pages/admin', { 
        title: 'Admin page', 
        msgskill: req.flash('msgskill')[0],
        msgfile: req.flash('msgfile')[0],
        value: skill
      })
})

router.post('/skills', (req, res, next) => {
  /*
  TODO: Реализовать сохранение нового объекта со значениями блока скиллов
    в переменной age - Возраст начала занятий на скрипке
    в переменной concerts - Концертов отыграл
    в переменной cities - Максимальное число городов в туре
    в переменной years - Лет на сцене в качестве скрипача
  */
    
    const formData = req.body
    Object.keys(formData).forEach((key) => {
      db.get('skills')
      .find({ type: key })
      .assign({ number: formData[key] }) // Замените 'новое значение' на актуальное значение
      .write();
    })  
      
    req.flash('msgskill', 'Навыки обновленны')
    res.redirect('/admin')
})

router.post('/upload', (req, res, next) => {
  /* TODO:
   Реализовать сохранения объекта товара на стороне сервера с картинкой товара и описанием
    в переменной photo - Картинка товара
    в переменной name - Название товара
    в переменной price - Цена товара
    На текущий момент эта информация хранится в файле data.json  в массиве products
  */
  const form = new formidable.IncomingForm()
  form.uploadDir = path.join(__dirname, '../', 'upload')
  // const upload = path.join('./upload')

  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir)
  }

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err)
      req.flash('msgfile', 'Ошибка при загрузке файла');
      return res.redirect('/admin')
    }

    const { name, price } = fields
    const {filepath, originalFilename }= files.photo[0]
    // console.log(fields)
    console.log(files.photo)
    // const { photo } = files
    const valid = validation(fields, files)
    if (valid.err) {
      fs.unlinkSync(filepath)
      req.flash('msgfile', valid.status)
      return res.redirect('/admin')
    } else {
      fs.renameSync(filepath, path.join(form.uploadDir, originalFilename))
    }

    const newProduct = {
      name: name[0],
      price: Number(price),
      src: `/${originalFilename}`, // Путь к загруженному файлу 
    }

    db.get('products')
      .push(newProduct)
      .write()

    req.flash('msgfile', 'Файлы успешно добавлены')
    res.redirect('/admin')   
  })  
})

const validation = (fields, files) => {
  console.log(files.photo.originalFilename)
  if (files.photo.size === 0) {
    return { status: 'Не загружена картинка!', err: true }
  }
  if (!fields.name[0]) {
    return { status: 'Не указано название товара!', err: true }
  }
  if (!fields.price[0]) {
    return { status: 'Не указана цена товара!', err: true }
  }
  return { status: 'Ok', err: false }
}

module.exports = router
