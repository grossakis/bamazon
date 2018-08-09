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
        console.log("\n");
        for(var i = 0; i < results.length; i++){
            console.log(results[i].item_id + ".) " + results[i].product_name + " -- $" + results[i].price)
        }
        console.log("\n");
        if (err) throw err;
        userQuery = function (){
            inquirer
            .prompt(
                [
                {
                    name: "item_number",
                    type: "input",
                    message: "Please enter the ID number for the item you would like to purchase"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like?"
                }
            ]
            )
            .then( function(answer) {

                var userItem = results[answer.item_number - 1];

                if(answer.item_number > results.length || answer.item_number < 1 || isNaN(answer.item_number)){
                    console.log("Invalid Item ID Please Try Again")
                    userQuery();
                }else{
                    if(answer.quantity > userItem.stock_quantity){
                        console.log("\nInsufficient Quantity!!!\n" +
                            "only " + userItem.stock_quantity + " left in stock\n"
                        )
                        userQuery();
                    }else{
                        console.log("\nyou want " + answer.quantity + " " + userItem.product_name);
                        console.log("Your total will be $" + (answer.quantity*userItem.price).toFixed(2) + "\n");
                        var newTOTAL = userItem.stock_quantity-answer.quantity;
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                              {
                                stock_quantity:newTOTAL
                              },
                              {
                                item_id:answer.item_number
                              }
                            ],
                            function(error) {
                              if (error) throw error;
                              console.log("Item successfully purchased!");
                            }
                            
                        );

                        connection.end();
                    }
                }
            })
        }
        userQuery();
    })
});