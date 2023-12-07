const express = require('express')
const router = express.Router()
const db = require('../db')
const nodemailer = require('nodemailer')
const config = require('../config.json')

// const { products, skills } = require('../data.json')

const skills = db.get('skills').value()
const products = db.get('products').value()

router.get('/', (req, res, next) => {
  res.render('pages/index', { title: 'Main page', products, skills, msgemail: req.flash('message')[0] })
})

router.post('/', (req, res, next) => {
  // TODO: Реализовать функционал отправки письма.
  const { name, email, message } = req.body 

  if(!email || !name || !message) {
    req.flash('message', 'Введите корректные данные')
    return res.redirect('/')
  } else {
    const transporter = nodemailer.createTransport(config.mail.smtp)

    const mailOptions = {
      from:  `'${req.body.name}' <${req.body.email}>`,
      to: config.mail.smtp.auth.user,
      subject: config.mail.subject,
      text: message
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // console.log(error);
        req.flash( 'message', 'Ошибка при отправке письма');
      } else {
        // console.log('Письмо успешно отправлено: ' + info.response);
        req.flash('message', 'Письмо успешно отправлено');
      }

      res.redirect('/')
    })
  }  
})

module.exports = router
