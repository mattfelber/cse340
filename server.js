const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")

const app = express()

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressLayouts)
app.set("layout", "layouts/layout")

/* ***********************
 * Static Files Middleware
 *************************/
app.use(express.static(path.join(__dirname, "public")))

/* ***********************
 * Routes
 *************************/
// Render the home (index) view
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' })
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || 'localhost'

/* ***********************
 * Start the Server
 *************************/
app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`)
})
