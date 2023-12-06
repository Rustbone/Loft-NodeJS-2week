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
  db.update('skills', (skills) => {
    return skills.map((skill) => {
      if (skill.id === 0) {
        return { ...skill, number: '' }
      }
      return skill
   }).write()
  }) 

  res.render('pages/admin', { title: 'Admin page' }) 
})

router.post('/skills', (req, res, next) => {
  /*
  TODO: Реализовать сохранение нового объекта со значениями блока скиллов

    в переменной age - Возраст начала занятий на скрипке
    в переменной concerts - Концертов отыграл
    в переменной cities - Максимальное число городов в туре
    в переменной years - Лет на сцене в качестве скрипача
  */
    const { age, concerts, cities, years } = req.body
    const newSkill = {
      age: Number(age),
      concerts: Number(concerts),
      cities: Number(cities),
      years: Number(years)
    }
    db.get('skills')
    .push(newSkill)
    .write()
  
  res.send('Данные о навыках успешно сохранены')
})

router.post('/upload', (req, res, next) => {
  /* TODO:
   Реализовать сохранения объекта товара на стороне сервера с картинкой товара и описанием
    в переменной photo - Картинка товара
    в переменной name - Название товара
    в переменной price - Цена товара
    На текущий момент эта информация хранится в файле data.json  в массиве products
  */
  const form = formidable({ multiples: true })
  const upload = path.join('./public', 'upload')

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
      return res.redirect(`/?msg=${valid.status}`)
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
  res.send('Объект товара успешно сохранен на стороне сервера')
})

const validation = (fields, files) => {
  if (files.photo.name === '' || files.photo.size === 0) {
    return { status: 'Не загружена картинка!', err: true }
  }
  if (!fields.name) {
    return { status: 'Не указано описание картинки!', err: true }
  }
  return { status: 'Ok', err: false }
}

module.exports = router