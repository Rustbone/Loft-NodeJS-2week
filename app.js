const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')


const mainRouter = require('./routes/')

const app = express()


app.use(cookieParser('keyboard cat'));
app.use(session({ 
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true,
  secret: 'jhkkjk'
}));
app.use(flash());


// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

process.env.NODE_ENV === 'development'
  ? app.use(logger('dev'))
  : app.use(logger('short'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'upload')))

app.use('/', mainRouter)

// catch 404 and forward to error handler
app.use((req, __, next) => {
  next(
    createError(404, `Ой, извините, но по пути ${req.url} ничего не найдено!`)
  )
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(3000, () => {})
