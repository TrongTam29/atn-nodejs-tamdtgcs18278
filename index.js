const express = require('express')
const path = require('path')
const { Client } = require('pg');
const cors = require('cors');
const { request, response } = require('express');

const connectionString = 'postgres://ueeyffjteefsga:0fe798cdc96fc5244d5655c82af816d881230ec428b12442a486e66459724636@ec2-50-19-26-235.compute-1.amazonaws.com:5432/d1h8l461s6fs69'

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.listen(PORT, () => console.log(`Listening on ${PORT}`))


const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

app.get('/api/product/AssemblyLogo/all', (request, response) => {
  try {
    client.query('SELECT * FROM product;', (err, res) => {
      response.send(res.rows)
    });
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/Agency/all', (request, response) => {
  try {
    client.query('SELECT * FROM agency;', (err, res) => {
      response.send(res.rows)
    });
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/customer/all', (request, response) => {
  try {
    client.query('SELECT * FROM customer;', (err, res) => {
      response.send(res.rows)
    });
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/category/all', (request, response) => {
  try {
    client.query('SELECT * FROM category;', (err, res) => {
      response.send(res.rows)
    });
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/supplier/all', (request, response) => {
  try {
    client.query('SELECT * FROM supplier;', (err, res) => {
      response.send(res.rows)
    });
  } catch (error) {
    console.log(error)
  }
})

app.post('/api/Agency/register', (request, response) => {
  const account = request.query.account
  const password = request.query.password
  const address = request.query.address
  try {
    client.query("INSERT INTO agency (agencyaccount, agencypassword, agencyaddress) VALUES (LOWER($1), $2, $3);", [account, password, address], (err, res) => {
      response.send("Register Agency Done")
    });
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/Agency/login', (request, response) => {
  const account = request.query.account
  const password = request.query.password
  try {
    client.query("Select * from agency WHERE (agencyaccount = LOWER($1) AND agencypassword = $2);", [account, password], (err, res) => {
      response.send(res.rows)
    });
  } catch (error) {
    console.log(error)
  }
})

app.post('/api/product/addproduct', (request, response) => {
  const name = request.query.name
  const image = request.query.image
  const price = request.query.price
  const supplier = request.query.supplier
  const category = request.query.category
  try {
    client.query("Insert into product (productname, productimage, productprice, supplierid, categoryid) values ($1, $2, $3, $4, $5);",
      [name, image, price, supplier, category], (err, res) => {
        response.send("Add Product Done")
      });
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/orderitem/all', (request, response) => {
  try {
    client.query("Select * from orderitem;", (err, res) => {
      response.send(res.rows)
    });
  } catch (error) {
    console.error(error)
  }
})

app.post('/api/orderitem/addorder', (request, response) => {
  const customer = request.query.customer
  const agency = request.query.agency
  const quantity = request.query.quantity
  try {
    client.query("Insert into orderitem (customerid, agencyid, orderquantity, orderdate) values ($1, $2, $3, current_timestamp);",
      [customer, agency, quantity], (err, res) => {
        response.send("Add Order Done")
      })
  } catch (error) {
    console.error(error)
  }
})

app.get('/api/orderitem/showorder', (request, response) => {
  try {
    client.query("Select product.productname, product.productprice, orderitem.orderquantity, agency.agencyaccount, customer.customer_username FROM orderitem INNER JOIN product ON orderitem.productid = product.productid INNER JOIN agency ON orderitem.agencyid=agency.agencyid INNER JOIN customer ON orderitem.customerid=customer.customerid;", (err, res) => {
      response.send(res.rows)
    });
  } catch (error) {
    console.error(error)
  }
})

app.post('/api/orderdetail/add', (request, response) => {
  const orderId = request.query.orderId
  const productId = request.query.productId
  try {
    client.query("INSERT INTO orderdetail (orderid, productid) values ($1, $2)", [orderId, productId], (err, res) => {
      response.send("Done")
    });
  } catch (error) {
    console.error(error)
  }
})


