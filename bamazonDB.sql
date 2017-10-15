DROP DATABASE IF EXISTS bamazonDB_db;
CREATE DATABASE bamazonDB_db;

USE bamazonDB_db;


CREATE TABLE products(	
	id INT AUTO_INCREMENT NOT NULL,
	description VARCHAR(50) NOT NULL,
	department VARCHAR(50),
	price FLOAT(10,2),
	quantity INT(10),
	PRIMARY KEY (id)
);


CREATE TABLE departments(
	department_id INT(10) NOT NULL,
	department_name VARCHAR(50) NOT NULL,
	over_head_costs INT(10) NOT NULL,
	PRIMARY KEY (department_id)
);


INSERT INTO products (description, department, price, quantity)
VALUE 
('Hammer 5'' ', 'Tool', 5.99, 30), 
('Hammer 7'' ', 'Tool', 9.99, 20),
('Ratchet', 'Tool', 9.99, 5),
('Screw Driver', 'Tool', 1.99, 10),
('Axe', 'Tool', 12.99, 60),
('Tape', 'Spare', 0.99, 30),
('Canister', 'Spare', 14.99, 40),
('Tarp', 'Spare', 3.99, 20);