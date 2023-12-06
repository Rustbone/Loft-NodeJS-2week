const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('pages/login', { title: 'SigIn page' })
})

router.post('/', (req, res, next) => {
  // TODO: Реализовать функцию входа в админ панель по email и паролю
  const { email, password } = req.body

  if (email === 'admin@example.com' && password === 'admin123') {
    req.session.isLoggedIn = true
    res.redirect('/admin')
  } else {
    req.flash('error', 'Неправильные данные')
    res.redirect('/login')
  }

  res.send('Реализовать функцию входа по email и паролю')
})

module.exports = router
