const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  const msglogin = req.flash('formStatus')[0]
  res.render('pages/login', { title: 'SigIn page', msglogin })
})

router.post('/', (req, res, next) => {
  // TODO: Реализовать функцию входа в админ панель по email и паролю
  const { email, password } = req.body

  if (email === 'admin@example.com' && password === 'admin123') {
    req.session.isLoggedIn = true
    res.redirect('/admin')
  } else {
    req.flash('formStatus', 'error')
    res.redirect('/login')
  }
})

module.exports = router
