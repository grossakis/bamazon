DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT(10) AUTO_INCREMENT,
    product_name VARCHAR(55) NOT NULL,
    department_name VARCHAR(55) NOT NULL,
    price DECIMAL(9,2) NOT NULL,
    stock_quantity INT(10) NOT NULL,
	PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Memory Foam Pillow", "bedding", 34.99, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("IPad", "electronics", 499.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Incredible Rubber Spatula", "cooking", 7.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Monkey Plush Toy", "toys", 9.99, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Hammer", "tools", 4.99, 500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Silk Sheet Set", "bedding", 39.99, 150);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Digital Thermometer", "electronics", 19.99, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blender", "cooking", 36.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sky Bounce Ball", "toys", 1.99, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Headphones", "electronics", 12.99, 7);

SELECT * FROM products;