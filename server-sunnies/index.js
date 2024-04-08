"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt = __importStar(require("jsonwebtoken"));
const bodyParser = __importStar(require("body-parser"));
const sql = __importStar(require("mssql"));
const cors_1 = __importDefault(require("cors"));
const crypto = __importStar(require("crypto"));
const app = (0, express_1.default)();
app.use(bodyParser.json());
app.use((0, cors_1.default)());
// test connection to SQL server using node-mssql
const sqlConfig = {
    user: "preethacp",
    password: "Rf6PVyj7B8!PNcT",
    server: "preethacp.database.windows.net",
    database: "sunnies",
};
const SECRET_KEY = "}IMg0pTg_x8flg&";
function verifyToken(req, res, next) {
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
    }
    catch (err) {
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
function getProducts(req, res) {
    var _a, _b, _c, _d;
    try {
        const productsArray = (_b = (_a = req.query.products) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.split(",").filter(Boolean);
        const priceArray = (_d = (_c = req.query.prices) === null || _c === void 0 ? void 0 : _c.toString()) === null || _d === void 0 ? void 0 : _d.split(",").filter(Boolean);
        sql.connect(sqlConfig, (err) => {
            if (err) {
                console.log("There was an error connecting to database", err);
                return;
            }
            const request = new sql.Request();
            let products = `'` + (productsArray === null || productsArray === void 0 ? void 0 : productsArray.join(`','`)) + `'`;
            let sqlString = `SELECT product_id AS productId,
                        product_name AS productName,
                        product_model AS productModel,
                        description,
                        brand_name AS brandName,
                        price,
                        stock_on_hand AS stockOnHand,
                        IMAGE AS imageUrl
                      FROM product Where 1=1 `;
            if (productsArray === null || productsArray === void 0 ? void 0 : productsArray.length) {
                sqlString += ` and brand_name in (${products})`;
            }
            if (priceArray === null || priceArray === void 0 ? void 0 : priceArray.length) {
                sqlString += ` and (1=2 `;
                if (priceArray.includes("<500"))
                    sqlString += ` Or Price < 500`;
                if (priceArray.includes("500-1000"))
                    sqlString += ` Or Price between 500 and 1000`;
                if (priceArray.includes(">1000"))
                    sqlString += ` Or Price > 1000`;
                sqlString += `)`;
            }
            request.query(sqlString, (err, data) => {
                if (err) {
                    console.log("There was an error connecting to database", err);
                    return;
                }
                res.send(data === null || data === void 0 ? void 0 : data.recordset);
            });
        });
    }
    catch (err) {
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
            const { productModel, productName, brandName, imageUrl, price, stockOnHand, description, } = req.body;
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
    }
    catch (err) {
        res.send(err);
    }
});
//Http PUT for product
app.put("/products", (req, res) => {
    sql.connect(sqlConfig, function () {
        let request = new sql.Request();
        const { productName, productModel, brandName, price, stockOnHand, imageUrl, productId, description, } = req.body;
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
    }
    catch (err) {
        res.send(err);
    }
});
//Http POST for Customers
app.post("/customers", (req, res) => {
    try {
        sql.connect(sqlConfig, function () {
            let request = new sql.Request();
            const { first_name, last_name, phone_number, email_address, password, street_address, city, state, postcode, product_id, quantity, } = req.body;
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
                var _a;
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
          ${(_a = data === null || data === void 0 ? void 0 : data.recordset[0]) === null || _a === void 0 ? void 0 : _a.customer_id},
          ${order_date}
        )`;
                request.query(stringRequest, function (err, data) {
                    var _a;
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
                    ${(_a = data === null || data === void 0 ? void 0 : data.recordset[0]) === null || _a === void 0 ? void 0 : _a.order_id},
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
    }
    catch (err) {
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
            request.query(`SELECT admin_id AS adminId,
                      admin_role AS adminRole,
                      first_name AS firstName,
                      last_name AS lastName,
                      username,
                      password
                    FROM admin`, (err, data) => {
                if (err) {
                    console.log("There was an error connecting to database", err);
                    return;
                }
                //send records as a response
                res.send(data === null || data === void 0 ? void 0 : data.recordset);
            });
        });
    }
    catch (err) {
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
    }
    catch (err) {
        res.send(err);
    }
});
//Http PUT for Admin
app.put("/admin", (req, res) => {
    sql.connect(sqlConfig, function () {
        let request = new sql.Request();
        const { firstName, lastName, adminRole, username, password, adminId } = req.body;
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
    }
    catch (err) {
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
            if (isAdminLogin)
                request.input("password", password);
            else
                request.input("password", hashPassword(password));
            request.query(sqlString, (err, data) => {
                if (err) {
                    res.status(400);
                    res.send(err);
                }
                else if ((data === null || data === void 0 ? void 0 : data.recordset) && (data === null || data === void 0 ? void 0 : data.recordset.length) > 0) {
                    // auth admin
                    const admin = { data };
                    const token = jwt.sign({ admin }, SECRET_KEY, {
                        expiresIn: "1d",
                    });
                    var responseData = isAdminLogin
                        ? { token: token, role: data.recordset[0].admin_role }
                        : {
                            token: token,
                            customerId: data.recordset[0].customer_id,
                        };
                    res.send(responseData);
                }
                else {
                    res.status(401);
                    res.send("Invalid Username or Password");
                }
            });
        });
    }
    catch (err) {
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
                sqlString +=
                    " WHERE sc.customer_id = @customerId or sc.customer_id is null";
            else
                sqlString += " WHERE sc.customer_id is null";
            //query to the database and get the records
            request.query(sqlString, (err, data) => {
                if (err) {
                    console.log("There was an error connecting to database", err);
                    return;
                }
                //send records as a response
                res.send(data === null || data === void 0 ? void 0 : data.recordset);
            });
        });
    }
    catch (err) {
        res.send(err);
    }
});
//Http GET for cart
app.get("/orders/:id", (req, res) => {
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
            request.input("orderId", id);
            let sqlString = `SELECT p.product_id,
                      p.IMAGE as imageUrl,
                      p.product_model as productModel,
                      p.brand_name as brandName,
                      p.product_name as productName,
                      od.quantity,
                      od.price_sold as price,
                      price * quantity AS total
                    FROM order_details od
                    INNER JOIN [order] o
                      ON od.order_id = o.order_id
                    INNER JOIN product p
                      ON od.product_id = p.product_id
                    WHERE o.order_id = @orderId`;
            //query to the database and get the records
            request.query(sqlString, (err, data) => {
                if (err) {
                    console.log("There was an error connecting to database", err);
                    return;
                }
                //send records as a response
                res.send(data === null || data === void 0 ? void 0 : data.recordset);
            });
        });
    }
    catch (err) {
        res.send(err);
    }
});
//Http GET for cart
app.get("/orders", (req, res) => {
    //connect to database
    try {
        sql.connect(sqlConfig, (err) => {
            if (err) {
                console.log("There was an error connecting to the database", err);
                return;
            }
            //create Request object
            const request = new sql.Request();
            let sqlString = `SELECT p.product_id,
                        o.order_Id as orderId,
                        p.IMAGE as imageUrl,
                        p.product_model as productModel,
                        p.brand_name as brandName,
                        p.product_name as productName,
                        od.quantity,
                        od.price_sold as price,
                        o.order_date as orderDate,
                  CONCAT(first_name,' ',c.last_name) as customerName,
                        price * quantity AS total
                      FROM order_details od
                      INNER JOIN [order] o
                        ON od.order_id = o.order_id
                  INNER JOIN customer c
                        ON c.customer_id = o.customer_id
                      INNER JOIN product p
                        ON od.product_id = p.product_id`;
            //query to the database and get the records
            request.query(sqlString, (err, data) => {
                if (err) {
                    console.log("There was an error connecting to database", err);
                    return;
                }
                //send records as a response
                res.send(data === null || data === void 0 ? void 0 : data.recordset);
            });
        });
    }
    catch (err) {
        res.send(err);
    }
});
//Http post for cart
app.post("/cart", (req, res) => {
    try {
        sql.connect(sqlConfig, function () {
            let request = new sql.Request();
            const { productId, quantity, customerId } = req.body;
            let updatedCustomerId = customerId == "undefined" ? null : customerId;
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
                }
                else {
                    // auth admin
                    res.status(200);
                    res.send();
                }
            });
        });
    }
    catch (err) {
        res.send(err);
    }
});
//Http post for checkout
app.post("/checkout", (req, res) => {
    try {
        sql.connect(sqlConfig, function () {
            let requestOrder = new sql.Request();
            let requestOrderDetail = new sql.Request();
            const { cartItems, customerId } = req.body;
            let orderId;
            let sqlOrderString = `INSERT INTO [order] (
                        customer_id,
                        order_date
                        )
                      VALUES (
                        @customerId,
                        @orderDate
                        )
                        SELECT SCOPE_IDENTITY() as orderId`;
            requestOrder.input("customerId", customerId);
            requestOrder.input("orderDate", new Date().toLocaleDateString());
            requestOrder.query(sqlOrderString, function (err, data) {
                if (err) {
                    res.status(400);
                    res.send(err);
                }
                else {
                    cartItems.forEach((cartItem) => {
                        orderId = (data === null || data === void 0 ? void 0 : data.recordset[0]).orderId;
                        let sqlOrderDetailString = `INSERT INTO order_details (
              product_id,
              order_id,
              quantity,
              price_sold
              )
            VALUES (
              ${cartItem.productId},
              ${orderId},
              ${cartItem.quantity},
              ${cartItem.price}
              )`;
                        requestOrderDetail.query(sqlOrderDetailString, function (err, data) {
                            if (err) {
                                res.status(400);
                                res.send(err);
                            }
                            else {
                                // res.send("came here");
                            }
                        });
                    });
                    res.status(200);
                    res.send({ orderId });
                }
            });
        });
    }
    catch (err) {
        res.send(err);
    }
});
//Http post for cart
app.post("/increaseCart", (req, res) => {
    try {
        sql.connect(sqlConfig, function () {
            let request = new sql.Request();
            const { productId, customerId } = req.body;
            let updatedCustomerId = customerId == "undefined" ? null : customerId;
            let sqlString = `Update shopping_cart
                        Set Quantity = Quantity + 1
                        Where product_id = @productId`;
            if (updatedCustomerId !== null)
                sqlString = sqlString + ` and customer_id = @customerId`;
            else
                sqlString = sqlString + ` and customer_id is null`;
            request.input("productId", productId);
            request.input("customerId", updatedCustomerId);
            request.query(sqlString, function (err, data) {
                if (err) {
                    res.status(400);
                    res.send(err);
                }
                else {
                    // auth admin
                    res.status(200);
                    res.send();
                }
            });
        });
    }
    catch (err) {
        res.send(err);
    }
});
//Http post for cart
app.post("/decreaseCart", (req, res) => {
    try {
        sql.connect(sqlConfig, function () {
            let request = new sql.Request();
            const { productId, customerId } = req.body;
            let updatedCustomerId = customerId == "undefined" ? null : customerId;
            let sqlString = `Update shopping_cart
                        Set Quantity = Quantity - 1
                        Where product_id = @productId`;
            if (updatedCustomerId !== null)
                sqlString = sqlString + ` and customer_id = @customerId`;
            else
                sqlString = sqlString + ` and customer_id is null`;
            request.input("productId", productId);
            request.input("customerId", updatedCustomerId);
            request.query(sqlString, function (err, data) {
                if (err) {
                    res.status(400);
                    res.send(err);
                }
                else {
                    // auth admin
                    res.status(200);
                    res.send();
                }
            });
        });
    }
    catch (err) {
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
    }
    catch (err) {
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
                stringRequest = `Select count(*) as cartCount from shopping_cart where customer_id = ${id} or customer_id is null`;
            else
                stringRequest = `Select count(*) as cartCount from shopping_cart where customer_id is null`;
            request.query(stringRequest, function (err, data) {
                if (err) {
                    res.status(500);
                    res.send(err);
                }
                res.end(JSON.stringify(data === null || data === void 0 ? void 0 : data.recordset[0])); // Result in JSON format
            });
        });
    }
    catch (err) {
        res.send(err);
    }
});
//Http Post for registration
app.post("/register", (req, res) => {
    try {
        sql.connect(sqlConfig, function () {
            let request = new sql.Request();
            const { firstName, lastName, phone, email, password, address, city, state, postCode, product_id, quantity, } = req.body;
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
        );
        SELECT SCOPE_IDENTITY() as customerId`;
            request.input("firstName", firstName);
            request.input("lastName", lastName);
            request.input("phone", phone);
            request.input("email", email);
            request.input("password", hashPassword(password));
            request.input("address", address);
            request.input("city", city);
            request.input("state", state);
            request.input("postcode", postCode);
            request.query(stringRequest, (err, data) => {
                if (err) {
                    console.log("There was an error", err);
                    res.send(err);
                }
                let customerId = (data === null || data === void 0 ? void 0 : data.recordset[0]).customerId;
                res.send({ customerId }); // Result in JSON format
            });
        });
    }
    catch (err) {
        res.send(err);
    }
});
//Http GET for checkout
app.get("/user/:id", (req, res) => {
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
            request.query(`SELECT TOP (1000) [customer_id]
                  ,[first_name] as firstName
                  ,[last_name] as lastName
                  ,[phone_number] as phone
                  ,[email_address] as email
                  ,[street_address] as address
                  ,[city]
                  ,[state]
                  ,[postcode] as postCode
              FROM [dbo].[customer]
              WHERE customer_id = @customerId`, (err, data) => {
                if (err) {
                    console.log("There was an error connecting to database", err);
                    return;
                }
                //send records as a response
                res.send(data === null || data === void 0 ? void 0 : data.recordset[0]);
            });
        });
    }
    catch (err) {
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
            request.query(`SELECT cart_id AS cartId,
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
          WHERE sc.customer_id = @customerId`, (err, data) => {
                if (err) {
                    console.log("There was an error connecting to database", err);
                    return;
                }
                //send records as a response
                res.send(data === null || data === void 0 ? void 0 : data.recordset);
            });
        });
    }
    catch (err) {
        res.send(err);
    }
});
function hashPassword(plaintextPassword) {
    if (!plaintextPassword)
        return "";
    const md5sum = crypto.createHash("md5");
    return md5sum.update(plaintextPassword).digest("hex");
}
app.listen(process.env.PORT || 8080, () => {
    console.log("Listening to port 8080");
});
