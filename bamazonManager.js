var mysql      = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'bamazon'
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
    connection.query("SELECT * FROM products", function(err, results) {

        itemArray = [];
        for(var x=0; x<results.length; x++){
            itemArray.push(results[x].product_name)
        }

        inquirer
            .prompt(
                {
                    name: "choice",
                    type: "list",
                    message: "Welcome, what would you like to do?",
                    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
                }
            )
            .then( function(answer) {
                console.log(answer.choice+"\n")
                if(answer.choice === "View Products for Sale"){
                    for(var i = 0; i<results.length; i++){
                        console.log(
                            results[i].item_id + ".) " +
                            results[i].product_name + " --$" +
                            results[i].price + "-- stock: " +
                            results[i].stock_quantity
                        );
                    }
                    console.log("\n");
                    connection.end();
                }else if(answer.choice === "View Low Inventory"){
                    var stockCheck = 0;
                    for(var i = 0; i<results.length; i++){
                        if(results[i].stock_quantity < 5){
                            stockCheck++
                            console.log(
                                results[i].item_id + ".) " +
                                results[i].product_name + " --$" +
                                results[i].price + "-- stock: " +
                                results[i].stock_quantity
                            );
                        }
                    }
                    if(stockCheck === 0){
                        console.log("items sufficiently stocked")
                    }
                    console.log("\n");
                    connection.end();

                }else if(answer.choice === "Add to Inventory"){
                    inquirer
                    .prompt(
                        [
                        {
                            name: "choice",
                            type: "list",
                            message: "Which Items would you like to stock?",
                            choices: itemArray
                        },
                        {
                            name: "stock",
                            type: "input",
                            message: "How many would you like to add?",
                            validate: function(input){
                                if(isNaN(input)){
                                    console.log("\nINVALID please enter a number")
                                    return false
                                }else{
                                    return true
                                }
                            }
                        }
                        ]
                    )
                    .then( function(answer) {

                        var userItemChoice = results[itemArray.indexOf(answer.choice)];

                        var newTOTAL = parseInt(userItemChoice.stock_quantity) + parseInt(answer.stock);
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                              {
                                stock_quantity:newTOTAL
                              },
                              {
                                item_id:userItemChoice.item_id
                              }
                            ],
                            function(error) {
                                if (error) throw error;
                                console.log(
                                    "Items successfully added!\n"+
                                    newTOTAL + " now in stock\n"
                                );

                                connection.end();
                            }
                            
                        );
                        console.log("\n" + answer.stock + " unit(s) added to " + answer.choice + " stock\n")
                    })


                }else if(answer.choice === "Add New Product"){
                    inquirer
                    .prompt(
                        [
                        {
                            name: "name",
                            type: "input",
                            message: "What is the name of the product you would like to stock?"
                        },
                        {
                            name: "department",
                            type: "input",
                            message: "Which department will this item be sold in?",
                        },
                        {
                            name: "price",
                            type: "input",
                            message: "How much will this item be sold for",
                            validate: function(input){
                                if(isNaN(input) || input < 0.01){
                                    console.log("\nINVALID please enter a number")
                                    return false
                                }else{
                                    return true
                                }
                            }
                        },
                        {
                            name: "quantity",
                            type: "input",
                            message: "How many would you like to add to the inventory?",
                            validate: function(input){
                                if(isNaN(input) || input < 1){
                                    console.log("\nINVALID please enter a number")
                                    return false
                                }else{
                                    return true
                                }
                            }
                        }
                        ]
                    )
                    .then( function(answer) {
                        var post={
                            product_name: answer.name,
                            department_name: answer.department,
                            price: parseFloat(answer.price).toFixed(2),
                            stock_quantity: parseInt(answer.quantity)
                        }
                        connection.query(
                            "INSERT INTO products SET ?",
                            post,
                            function(error) {
                                if (error) throw error;
                                console.log(
                                    "Item successfully added!\n"
                                );

                                connection.end();
                            }
                        )
                    })
                }
            })

    })
});


