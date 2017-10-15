var AsciiTable = require('ascii-table');
var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: '000111',
	database: 'bamazonDB_db'
})


startManagerApp();


function startManagerApp() {
	inquirer.prompt([
	{
		name: 'choice',
		message: 'What would you like to do today:',
		type: 'list',
		choices: ['Inventory for Sale','Check low Inventory', 'Update Product','Add New Product', 'Exit']
	}
	]).then((ans) => {
		switch(ans.choice) {
			case 'Inventory for Sale':
				readDataTable('products');
				setTimeout(restart,500);
				break;

			case 'Check low Inventory':
				readDataLowInventory('products');
				break;

			case 'Update Product':
				readDataTable('products');
				setTimeout(updateInventory, 500);
				break;

			case 'Add New Product':
				readDataTable('products');
				setTimeout(addProduct, 500);
				break;

			case 'Exit':
				console.log(`\nHave Fun\n`);
				process.exit(0);
				break;
		}
	})
}


function restart() {
	inquirer.prompt([
	{
		name: 'confirm',
		message: 'End program?',
		type: 'confirm'
	}
	]).then((ans) => {
		if(ans.confirm) {
			console.log('\nHave a good rest of your day!\n');
			connection.end();
		} else {
			startManagerApp();
		}
	})
}



function readDataTable(db_table) {
	var table = new AsciiTable();
	table.setHeading('ID', 'Description', 'Department', 'Price', 'Quantity', 'Total Value');

	connection.query(`SELECT * FROM ${db_table}`, (err,res) => {
		console.log(`\n                  Product List`);
		res.forEach((product) => {
			table.addRow(product.id, product.description, product.department, product.price, product.quantity, (product.price * product.quantity).toFixed(2));
		})
		console.log(`${table.toString()}\n`);
	});
}


function readDataLowInventory(db_table) {
	var table = new AsciiTable();
	table.setHeading('ID', 'Description', 'Department', 'Price', 'Quantity', 'Total Sales');

	connection.query(`SELECT * FROM ${db_table} WHERE quantity<3`, (err,res) => {
		console.log(`\n         Product List with Inventory Below 3`);
		res.forEach((product) => {
			table.addRow(product.id, product.description, product.department, product.price, product.quantity, product.product_sales);
		})
		console.log(`${table.toString()}\n`);
				restart();
	});
}


function updateInventory() {
	inquirer.prompt([
	{
		name: 'id',
		message: 'What would you like to do today, enter ID you want to update'
	},
	{
		name: 'list',
		message: 'Which property would you like to update?',
		type: 'list',
		choices: ['Description', 'Department', 'Price', 'Quantity']
	},
	{
		name: 'value',
		message: 'What is the updated quantity?'
	}
	]).then((ans) => {
		switch(ans.list) {
			case 'Description':
				connection.query(`UPDATE products SET description = ${ans.value} WHERE id = ${ans.id}`, (err, res) => {
					if(err) throw err;
					console.log(`\nProduct Updated\n`)
						restart();	
				})
				break;

			case 'Department':
				connection.query(`UPDATE products SET department = ${ans.value} WHERE id = ${ans.id}`, (err, res) => {
					if(err) throw err;
					console.log(`\nProduct Updated\n`)
						restart();
				})
				break;

			case 'Price':
				connection.query(`UPDATE products SET price = ${ans.value} WHERE id = ${ans.id}`, (err, res) => {
					if(err) throw err;
					console.log(`\nProduct Updated\n`)
						restart();
				})
				break;

			case 'Quantity':
				connection.query(`UPDATE products SET quantity = ${ans.value} WHERE id = ${ans.id}`, (err, res) => {
					if(err) throw err;
					console.log(`\nProduct Updated\n`)
						restart();				
				})
				break;
		}		
	})
}


function addProduct() {
	console.log(`\nWould you like to add a new product...\n`);
	inquirer.prompt([
	{
		name: 'desc',
		message: 'Description?'
	},
	{
		name: 'dept',
		message: 'Department'
	},
	{
		name: 'price',
		message: 'Price?',
		valid: (value) => !isNaN(value)
	},
	{
		name: 'quantity',
		message: 'Quantity?',
		valid: (value) => !isNaN(value)
	}
	]).then((ans) => {
		connection.query(`INSERT INTO products (description, department, price, quantity) VALUE ('${ans.desc}', '${ans.dept}', '${ans.price}', '${ans.quantity}')`, (err, res) => {
			if (err) throw err;
			console.log(`\nNew Product Added\n`);
				restart();
		})
	})
}







