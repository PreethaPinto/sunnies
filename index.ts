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

process.on("uncaughtException", (error, origin) => {
  console.log("----- Uncaught exception -----");
  console.log(error);
  console.log("----- Exception origin -----");
  console.log(origin);
});

//Http GET for products
app.get("/customerProducts", (req, res) => {
  getProducts(req, res);
});

//Http GET for products
app.get("/products", (req, res) => {
  getProducts(req, res);
});

function getProducts(req: any, res: any) {
  try {
    const productsArray = req.query.products
      ?.toString()
      ?.split(",")
      .filter(Boolean);
    const priceArray = req.query.prices?.toString()?.split(",").filter(Boolean);
    sql.connect(sqlConfig, (err) => {
      if (err) {
        console.log("There was an error connecting to database", err);
        return;
      }
      const request = new sql.Request();
      let products = `'` + productsArray?.join(`','`) + `'`;

      

      let sqlString = `SELECT product_id AS productId,
                        product_name AS productName,
                        product_model AS productModel,
                        description,
                        brand_name AS brandName,
                        price,
                        stock_on_hand AS stockOnHand,
                        IMAGE AS imageUrl
                      FROM product Where 1=1 `;
      if (productsArray?.length) {
        sqlString += ` and brand_name in (${products})`;
      }
      
      if (priceArray?.length) {
        sqlString += ` and (1=2 `;
        if (priceArray.includes("<500")) sqlString += ` Or Price < 500`;
        if (priceArray.includes("500-1000"))
          sqlString += ` Or Price between 500 and 1000`;
        if (priceArray.includes(">1000")) sqlString += ` Or Price > 1000`;
        sqlString += `)`;
      }

      request.query(sqlString, (err, data) => {
        if (err) {
          console.log("There was an error connecting to database", err);
          return;
        }
        res.send(data?.recordset);
      });
    });
  } catch (err) {
    res.send(err);
  }
}

// //Http Get for Product
// app.get("/products", verifyToken, (req, res) => {
//   //connect to database
//   try {
//     sql.connect(sqlConfig, (err) => {
//       if (err) {
//         console.log("There was an error connecting to the database", err);
//         return;
//       }
//       //create Request object
//       const request = new sql.Request();
//       //query to the database and get the records
//       request.query("select * from product", (err, data) => {
//         if (err) {
//           console.log("There was an error connecting to database", err);
//           return;
//         }
//         //send records as a response
//         res.send(data?.recordset);
//       });
//     });
//   } catch (err) {
//     res.send(err);
//   }
// });

//Http Post for products
app.post("/products", (req, res) => {
  try {
    sql.connect(sqlConfig, function () {
      let request = new sql.Request();

      const {
        productModel,
        productName,
        brandName,
        imageUrl,
        price,
        stockOnHand,
        description,
      } = req.body;

      let stringRequest = `INSERT INTO [product](
        product_name,
        product_model,
        brand_name,
        price,
        stock_on_hand,
        image,
        description
      )

      VALUES (
        @productName,
        @productModel,
        @brandName,
        @price,
        @stockOnHand,
        @imageUrl,
        @description
        )`;
      request.input("productModel", productModel);
      request.input("productName", productName);
      request.input("brandName", brandName);
      request.input("price", price);
      request.input("stockOnHand", stockOnHand);
      request.input("imageUrl", imageUrl);
      request.input("description", description);
      // res.send(stringRequest);

      request.query(stringRequest, (err, data) => {
        if (err) {
          console.log("There was an error", err);
          res.send(err);
        }

        res.end(JSON.stringify(data)); // Result in JSON format
      });
    });
  } catch (err) {
    res.send(err);
  }
});

//Http PUT for product
app.put("/products", (req, res) => {
  sql.connect(sqlConfig, function () {
    let request = new sql.Request();

    const {
      productName,
      productModel,
      brandName,
      price,
      stockOnHand,
      imageUrl,
      productId,
      description,
    } = req.body;

    let stringRequest = `UPDATE [product]
    SET product_name = '${productName}',
    product_model = '${productModel}',
    brand_name = '${brandName}',
    price = ${price},
    stock_on_hand = ${stockOnHand},
    image = '${imageUrl}',
    description = '${description}'
    WHERE product_id = ${productId}
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
app.get("/admin", (req, res) => {
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
      request.query(
        `SELECT admin_id AS adminId,
                      admin_role AS adminRole,
                      first_name AS firstName,
                      last_name AS lastName,
                      username,
                      password
                    FROM admin`,
        (err, data) => {
          if (err) {
            console.log("There was an error connecting to database", err);
            return;
          }
          //send records as a response
          res.send(data?.recordset);
        }
      );
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

      const { firstName, lastName, adminRole, username, password } = req.body;
      let stringRequest = `INSERT INTO [admin] (
              first_name,
              last_name,
              admin_role,
              username,
              password
              )
      OUTPUT Inserted.admin_id
      VALUES (
              @firstName,
              @lastName,
              @adminRole,
              @username,
              @password
              )`;

      request.input("firstName", firstName);
      request.input("lastName", lastName);
      request.input("adminRole", adminRole);
      request.input("username", username);
      request.input("password", password);

      request.query(stringRequest, (err, data) => {
        if (err) {
          console.log("There was an error connecting to database", err);
          return;
        }
        res.end(JSON.stringify(data));
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

    const { firstName, lastName, adminRole, username, password, adminId } =
      req.body;

    let stringRequest = `UPDATE [admin]
    SET first_name = @firstName,
    last_name = @lastName,
    admin_role = @adminRole,
    username = @username,
    password= @password
    WHERE admin_id = @adminId
    `;

    request.input("firstName", firstName);
    request.input("lastName", lastName);
    request.input("adminRole", adminRole);
    request.input("username", username);
    request.input("password", password);
    request.input("adminId", adminId);
    request.query(stringRequest, (err, data) => {
      if (err) {
        console.log("There was an error connecting to database", err);
        return;
      }
      res.end(JSON.stringify(data));
    });
  });
});

//Http DELETE for admin
app.delete("/admin/:id", (req, res) => {
  try {
    const { id } = req.params;
    sql.connect(sqlConfig, function () {
      let request = new sql.Request();

      let stringRequest = `Delete from admin where admin_id = ${id}`;
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

app.post("/login", (req, res) => {
  try {
    sql.connect(sqlConfig, function () {
      let request = new sql.Request();
      const { username, password, isAdminLogin } = req.body;
      let sqlString = "";
      if (isAdminLogin)
        sqlString = `Select * from [admin] where username = @username and password = @password`;
      else
        sqlString = `Select * from [customer] where email_address = @username and password = @password`;
      request.input("username", username);
      request.input("password", password);

      request.query(sqlString, (err, data) => {
        if (err) {
          res.status(400);
          res.send(err);
        } else if (data?.recordset && data?.recordset.length > 0) {
          // auth admin
          const admin = { data };
          const token = jwt.sign({ admin }, SECRET_KEY, {
            expiresIn: "1d",
          });
          var responseData = isAdminLogin
            ? { token: token }
            : {
                token: token,
                customerId: (data.recordset[0] as any).customer_id,
              };
          res.send(responseData);
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

//Http GET for cart
app.get("/cart/:id", (req, res) => {
  //connect to database
  try {
    const { id } = req.params;
    sql.connect(sqlConfig, (err) => {
      if (err) {
        console.log("There was an error connecting to the database", err);
        return;
      }
      //create Request object
      const request = new sql.Request();
      request.input("customerId", id);

      let sqlString = `SELECT cart_id AS cartId,
            P.product_Id AS productId,
            quantity,
            brand_name AS brandName,
            product_name AS productName,
            product_model AS productModel,
            price,
            price * quantity AS total,
            image AS imageUrl
          FROM shopping_cart sc
          INNER JOIN Product P
            ON sc.product_id = p.product_Id`;
      if (id && id !== "null" && id !== "undefined")
        sqlString += " WHERE sc.customer_id = @customerId";
      else sqlString += " WHERE sc.customer_id is null";

      //query to the database and get the records
      request.query(sqlString, (err, data) => {
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

//Http post for cart
app.post("/cart", (req, res) => {
  try {
    sql.connect(sqlConfig, function () {
      let request = new sql.Request();
      const { productId, quantity, customerId } = req.body;
      
      let updatedCustomerId = customerId == 'undefined' ? null : customerId;
     //  res.send(updatedCustomerId);

      let sqlString = `INSERT INTO shopping_cart (
                        customer_id,
                        product_id,
                        quantity
                        )
                      VALUES (
                        @customerId,
                        @productId,
                        @quantity
                        )`;
      request.input("productId", productId);
      request.input("quantity", quantity);
      request.input("customerId", updatedCustomerId);

      request.query(sqlString, function (err, data) {
        if (err) {
          res.status(400);
          res.send(err);
        } else {
          // auth admin
          res.status(200);
          res.send();
        }
      });
    });
  } catch (err) {
    res.send(err);
  }
});

//Http post for cart
app.post("/increaseCart", (req, res) => {
  try {
    sql.connect(sqlConfig, function () {
      let request = new sql.Request();
      const { productId, customerId } = req.body;
      
      let updatedCustomerId = customerId == 'undefined' ? null : customerId;
      let sqlString = `Update shopping_cart
                        Set Quantity = Quantity + 1
                        Where product_id = @productId`;

      if(updatedCustomerId !== null)
      sqlString = sqlString + ` and customer_id = @customerId`;
      else sqlString = sqlString + ` and customer_id is null`;

      request.input("productId", productId);
      request.input("customerId", updatedCustomerId);

      request.query(sqlString, function (err, data) {
        if (err) {
          res.status(400);
          res.send(err);
        } else {
          // auth admin
          res.status(200);
          res.send();
        }
      });
    });
  } catch (err) {
    res.send(err);
  }
});

//Http post for cart
app.post("/decreaseCart", (req, res) => {
  try {
    sql.connect(sqlConfig, function () {
      let request = new sql.Request();
      const { productId, customerId } = req.body;
      
      let updatedCustomerId = customerId == 'undefined' ? null : customerId;
      let sqlString = `Update shopping_cart
                        Set Quantity = Quantity - 1
                        Where product_id = @productId`;

      if(updatedCustomerId !== null)
      sqlString = sqlString + ` and customer_id = @customerId`;
      else sqlString = sqlString + ` and customer_id is null`;

      request.input("productId", productId);
      request.input("customerId", updatedCustomerId);

      request.query(sqlString, function (err, data) {
        if (err) {
          res.status(400);
          res.send(err);
        } else {
          // auth admin
          res.status(200);
          res.send();
        }
      });
    });
  } catch (err) {
    res.send(err);
  }
});

//Http delete for cart
app.delete("/cart/:id", (req, res) => {
  try {
    const { id } = req.params;
    sql.connect(sqlConfig, function () {
      let request = new sql.Request();

      let stringRequest = `Delete from shopping_cart where cart_id = ${id}`;
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

//Http get for cart count
app.get("/cartCount/:id", (req, res) => {
  try {
    const { id } = req.params;
    sql.connect(sqlConfig, function () {
      let request = new sql.Request();
      let stringRequest;
      if (id && id !== "null" && id !== "undefined")
        stringRequest = `Select count(*) as cartCount from shopping_cart where customer_id = ${id}`;
      else
        stringRequest = `Select count(*) as cartCount from shopping_cart where customer_id is null`;
      request.query(stringRequest, function (err, data) {
        if (err) {
          res.status(500);
          res.send(err);
        }
        res.end(JSON.stringify(data?.recordset[0])); // Result in JSON format
      });
    });
  } catch (err) {
    res.send(err);
  }
});

//Http Post for registration
app.post("/register", (req, res) => {
  try {
    sql.connect(sqlConfig, function () {
      let request = new sql.Request();

      const {
        firstName,
        lastName,
        phone,
        email,
        password,
        address,
        city,
        state,
        postCode,
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

      VALUES (
        @firstName,
        @lastName,
        @phone,
        @email,
        @password,
        @address,
        @city,
        @state,
        @postcode
        )`;
      request.input("firstName", firstName);
      request.input("lastName", lastName);
      request.input("phone", phone);
      request.input("email", email);
      request.input("password", password);
      request.input("address", address);
      request.input("city", city);
      request.input("state", state);
      request.input("postcode", postCode);

      request.query(stringRequest, (err, data) => {
        if (err) {
          console.log("There was an error", err);
          res.send(err);
        }

        res.end(JSON.stringify(data)); // Result in JSON format
      });
    });
  } catch (err) {
    res.send(err);
  }
});

//Http GET for checkout
app.get("/checkout/:id", (req, res) => {
  //connect to database
  try {
    const { id } = req.params;
    sql.connect(sqlConfig, (err) => {
      if (err) {
        console.log("There was an error connecting to the database", err);
        return;
      }
      //create Request object
      const request = new sql.Request();
      request.input("customerId", id);
      //query to the database and get the records
      request.query(
        `SELECT cart_id AS cartId,
            P.product_Id AS productId,
            quantity,
            brand_name AS brandName,
            product_name AS productName,
            product_model AS productModel,
            price,
            price * quantity AS total,
            image AS imageUrl
          FROM shopping_cart sc
          INNER JOIN Customer C
            ON sc.customer_id = C.customer_Id
          INNER JOIN Product P
            ON sc.product_id = p.product_Id
          WHERE sc.customer_id = @customerId`,

        (err, data) => {
          if (err) {
            console.log("There was an error connecting to database", err);
            return;
          }
          //send records as a response
          res.send(data?.recordset);
        }
      );
    });
  } catch (err) {
    res.send(err);
  }
});

app.listen(8080, () => {
  console.log("Listening to port 8080");
});
