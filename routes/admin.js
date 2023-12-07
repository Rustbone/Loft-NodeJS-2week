const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const db = require('../db')
const path = require('path')
const fs = require('fs')


// const skills = db.get('skills').value()
// const products = db.get('products').value()

router.get('/', (req, res, next) => {
  // TODO: Реализовать, подстановку в поля ввода формы 'Счетчики'
  // актуальных значений из сохраненых (по желанию)
  // db.update('skills', (skills) => {
  //   return skills.map((skill) => {
  //     if (skill.id === 0) {
  //       return { ...skill, number: '' }
  //     }
  //     return skill
  //  }).write()
  // }) 
  const msgskill = req.flash('msgskill')[0]
  const msgfile = req.flash('msgfile')[0]

  res.render('pages/admin', { title: 'Admin page', msgskill, msgfile }) 
})

router.post('/skills', (req, res, next) => {
  /*
  TODO: Реализовать сохранение нового объекта со значениями блока скиллов

    в переменной age - Возраст начала занятий на скрипке
    в переменной concerts - Концертов отыграл
    в переменной cities - Максимальное число городов в туре
    в переменной years - Лет на сцене в качестве скрипача
  */
    const { number, text } = req.body
    const newSkill = []
    newSkill.push({
      number: Number(number),
      text: text
    })
    for (let i = 0; i < newSkill.length; i++) {
      newSkill[i].number += 1; 
    }
  
    req.flash('msgskill')
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
  const upload = path.join('./upload')

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload)
  }

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      res.send('Ошибка при загрузке файла');
      return;
    }

    const { name, price } = fields
    const { photo } = files
    const valid = validation(fields, files)
    if (valid.err) {
      fs.unlinkSync(files.photo.path)
      return res.redirect(req.flash('msgfile'))
    }

    const newProduct = {
      name: name,
      price: Number(price),
      photo: photo.path, // Путь к загруженному файлу 
    }

    db.get('products')
      .push(newProduct)
      .write()   
  })
  req.flash('msgfile')
})

const validation = (fields, files) => {
  if (!files.photo) {
    return { status: 'Не загружена картинка!', err: true }
  }
  if (!fields.name) {
    return { status: 'Не указано описание картинки!', err: true }
  }
  return { status: 'Ok', err: false }
}

module.exports = router