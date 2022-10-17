import express from "express";
import * as jwt from "jsonwebtoken";
import * as bodyParser from "body-parser";
import * as sql from "mssql";
import cors from "cors";
const app = express();
app.use(bodyParser.json());
app.use(cors());

// test connection to SQL server using node-mssql
const sqlConfig = {
  user: "preethacp",
  password: "Rf6PVyj7B8!PNcT",
  server: "preethacp.database.windows.net",
  database: "sunnies",
};

const SECRET_KEY = "}IMg0pTg_x8flg&";

function verifyToken(req: any, res: any, next: any) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).send("Unauthorized request");
  }
  try {
    let payload = jwt.verify(token, SECRET_KEY);

    next();
  } catch (err) {
    return res.status(401).send("Unauthorized request");
  }
}

//Http Get for Product
app.get("/products", verifyToken, (req, res) => {
  //connect to database
  try {
    sql.connect(sqlConfig, (err) => {
      if (err) {
        console.log("There was an error connecting to the database", err);
        return;
      }
      //create Request object
      const request = new sql.Request();
      //query to the database and get the records
      request.query("select * from product", (err, data) => {
        if (err) {
          console.log("There was an error connecting to database", err);
          return;
        }
        //send records as a response
        res.send(data?.recordset);
      });
    });
  } catch (err) {
    res.send(err);
  }
});

//Http Post for products
app.post("/products", (req, res) => {
  sql.connect(sqlConfig, function () {
    let request = new sql.Request();

    const {
      product_name,
      product_model,
      brand_name,
      price,
      stock_on_hand,
      image,
    } = req.body;

    let stringRequest = `INSERT INTO [product] (
      product_name,
      product_model,
      brand_name,
      price,
      stock_on_hand,
      image
    )
    OUTPUT Inserted.product_id
    VALUES (
      '${product_name}',
      '${product_model}',
      '${brand_name}',
      ${price},
      ${stock_on_hand},
      '${image}'
    )`;
    request.query(stringRequest, (err, data) => {
      if (err) {
        console.log("There was an error connecting to database", err);
        return;
      }
      res.end(JSON.stringify(data));
    });
  });
});

//Http PUT for product
app.put("/products", (req, res) => {
  sql.connect(sqlConfig, function () {
    let request = new sql.Request();

    const {
      product_name,
      product_model,
      brand_name,
      price,
      stock_on_hand,
      image,
      product_id,
    } = req.body;

    let stringRequest = `UPDATE [product]
    SET product_name = '${product_name}',
    product_model = '${product_model}',
    brand_name = '${brand_name}',
    price = ${price},
    stock_on_hand = ${stock_on_hand},
    image = '${image}'
    WHERE product_id = ${product_id}
    `;
    request.query(stringRequest, (err, data) => {
      if (err) {
        console.log("There was an error connecting to database", err);
        return;
      }
      res.end(JSON.stringify(data));
    });
  });
});

//Http DELETE for products
app.delete("/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    sql.connect(sqlConfig, function () {
      let request = new sql.Request();

      let stringRequest = `Delete from product where Product_id = ${id}`;
      request.query(stringRequest, function (err, data) {
        if (err) {
          res.status(500);
          res.send(err);
        }
        res.end(JSON.stringify(data)); // Result in JSON format
      });
    });
  } catch (err) {
    res.send(err);
  }
});

//Http POST for Customers
app.post("/customers", (req, res) => {
  try {
    sql.connect(sqlConfig, function () {
      let request = new sql.Request();

      const {
        first_name,
        last_name,
        phone_number,
        email_address,
        password,
        street_address,
        city,
        state,
        postcode,
        product_id,
        quantity,
      } = req.body;

      let stringRequest = `INSERT INTO [customer](
      first_name,
      last_name,
      phone_number, 
      email_address,
      password,
      street_address, 
      city,
      state,
      postcode
      )
      
      OUTPUT Inserted.customer_id

      VALUES (
        @first_name,
        @last_name,
        @phone_number,
        @email_address,
        @password,
        @street_address,
        @city,
        @state,
        @postcode
        )`;
      request.input("first_name", first_name);
      request.input("last_name", last_name);
      request.input("phone_number", phone_number);
      request.input("email_address", email_address);
      request.input("password", password);
      request.input("street_address", street_address);
      request.input("city", city);
      request.input("state", state);
      request.input("postcode", postcode);

      request.query(stringRequest, (err, data) => {
        if (err) {
          console.log("There was an error connecting to database", err);
          return;
        }

        //Http POST for orders
        let date = new Date();
        let order_date = date.toISOString().split("T")[0];

        let stringRequest = `INSERT INTO [order] (
          customer_id,
          order_date
        )
        OUTPUT Inserted.order_id
        VALUES (
          ${(data?.recordset[0] as any)?.customer_id},
          ${order_date}
        )`;

        request.query(stringRequest, function (err, data) {
          if (err) {
            res.status(500);
            res.send(err);
          }

          //Http POST for order details
          let price_sold = `SELECT price FROM [product] where product_id = ${product_id}`;
          let orderDetailsRequest = `INSERT INTO [order_details] (
                    product_id,
                    order_id,
                    quantity,
                    price_sold
                   )
                   OUTPUT Inserted.order_details_id
              VALUES (
                    ${product_id},
                    ${(data?.recordset[0] as any)?.order_id},
                    ${quantity},
                    (${price_sold})
                    )`;

          request.query(orderDetailsRequest, function (err, data) {
            if (err) {
              res.status(500);
              res.send(err);
            }

            res.end(JSON.stringify(data)); // Result in JSON format
          });
        });
      });
    });
  } catch (err) {
    res.send(err);
  }
});

//Http GET for admin
app.get("/admin", verifyToken, (req, res) => {
  //connect to database
  try {
    sql.connect(sqlConfig, (err) => {
      if (err) {
        console.log("There was an error connecting to the database", err);
        return;
      }
      //create Request object
      const request = new sql.Request();
      //query to the database and get the records
      request.query("select * from admin", (err, data) => {
        if (err) {
          console.log("There was an error connecting to database", err);
          return;
        }
        //send records as a response
        res.send(data?.recordset);
      });
    });
  } catch (err) {
    res.send(err);
  }
});

//Http Post for admin
app.post("/admin", (req, res) => {
  try {
    sql.connect(sqlConfig, function () {
      let request = new sql.Request();

      const { first_name, last_name, admin_role, username, password } =
        req.body;
      let stringRequest = `INSERT INTO [admin] (
              first_name,
              last_name,
              admin_role,
              username,
              password
              )
      OUTPUT Inserted.admin_id
      VALUES (
              '${first_name}',
              '${last_name}',
              '${admin_role}',
              '${username}',
              '${password}'
              )`;
      request.query(stringRequest, (err, data) => {
        if (err) {
          console.log("There was an error connecting to database", err);
          return;
        }
        res.end(JSON.stringify(data));

        res.end(JSON.stringify(data)); // Result in JSON format
      });
    });
  } catch (err) {
    res.send(err);
  }
});

//Http PUT for Admin
app.put("/admin", (req, res) => {
  sql.connect(sqlConfig, function () {
    let request = new sql.Request();

    const { first_name, last_name, admin_role, username, password, admin_id } =
      req.body;

    let stringRequest = `UPDATE [admin]
    SET first_name = '${first_name}',
    last_name = '${last_name}',
    admin_role = '${admin_role}',
    username = ${username},
    password= ${password},
    WHERE adminpa_id = ${admin_id}
    `;
    request.query(stringRequest, (err, data) => {
      if (err) {
        console.log("There was an error connecting to database", err);
        return;
      }
      res.end(JSON.stringify(data));
    });
  });
});

app.post("/login", (req, res) => {
  try {
    sql.connect(sqlConfig, function () {
      let request = new sql.Request();
      const { username, password } = req.body;

      let sqlString = `Select * from [admin] where username = @username and password = @password`;
      request.input("username", username);
      request.input("password", password);

      request.query(sqlString, function (err, data) {
        if (err) {
          res.status(400);
          res.send(err);
        } else if (data?.recordset && data?.recordset.length > 0) {
          // auth admin
          const admin = { data };
          const token = jwt.sign({ admin }, SECRET_KEY, {
            expiresIn: "1d",
          });
          res.send({ token: token });
        } else {
          res.status(401);
          res.send("Invalid Username or Password");
        }
      });
    });
  } catch (err) {
    res.send(err);
  }
});

app.listen(8080, () => {
  console.log("Listening to port 8080");
});
