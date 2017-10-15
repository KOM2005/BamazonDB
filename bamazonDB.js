const AsciiTable = require('ascii-table');
const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: '000111',
	database: 'bamazonDB_db'
})

 
startApp();


function startApp() {
	let table = new AsciiTable();
	table.setHeading('ID', 'Description', 'Department', 'Price', 'Quantity', 'Total');

	connection.query('SELECT * FROM products WHERE quantity>0', (error,response) => {
		console.log(`\n       Items for purchase:`);
		response.forEach((product) => {
			table.addRow(product.id, product.description, product.department, product.price, product.quantity, (product.price * product.quantity).toFixed(2));
		})
		console.log(`${table.toString()}\n`);

		setTimeout(pickItem, 500);	
	});
}


function pickItem() {
	inquirer.prompt([
	{
		name: `id`,
		message: `Chose item by ID number you'd like to buy:`,
		validate: (value) => !isNaN(value)
		
	},
	{
		name: `qtytobuy`,
		message: `How many units would you like to buy?`,
		validate: (value) => !isNaN(value)
	}
	]).then((answertobuy) => {
		itemPicked(answertobuy.id, answertobuy.qtytobuy);
	})
}


function itemPicked(id, qtytobuy) {
	connection.query(`SELECT * FROM products WHERE id=${id}`, (error,response) => {
		if (error) {
			console.log(`\nYou've encount an erroror.`);
			restart();
		}

		if (qtytobuy > response[0].quantity) {
			console.log(`\nInsufficient Quantity, try again...\n`);
			setTimeout(pickItem, 500);	
		} else {
			if (qtytobuy == 1) {
				console.log(`\nYou have selected ${qtytobuy} ${response[0].description} for $${response[0].price}.`);
				let total = qtytobuy*response[0].price;
				console.log(`Amount due: $ ${total}.\n`);
				buyItem(id, response[0].quantity.toFixed(2), qtytobuy, total);
			} else if (qtytobuy > 1) {
				console.log(`\nYou have selected ${qtytobuy} ${response[0].description} for $${response[0].price.toFixed(2)} each.`);
				let total = qtytobuy*response[0].price;
				console.log(`Amount due: $${total.toFixed(2)}.\n`);
				buyItem(id, response[0].quantity, qtytobuy, total);
			}
		}
	});
}


function buyItem(id, IQty, customerQtytobuy, total) {
	let newQty = IQty - customerQtytobuy;
	inquirer.prompt([
	{
		name: `payment`,
		message: `DO you want to pay now ?`,
		type: 'confirm'
	},
	{
		name: `confirm`,
		message: `it will cost you $${total.toFixed(2)}.`,
		type: 'confirm'
	}
	]).then((answertobuy) => {
		if (answertobuy.confirm) {
			console.log(`\nThank you for your purchase.\n`);
			updateDataQtytobuy(id, newQty, total);
			setTimeout(restart, 700);
		} else {
			console.log(`\nOops.\n`);
			restart();
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
	]).then((answertobuy) => {
		if(answertobuy.confirm) {
			console.log('\nHave a great day!\n');
			connection.end();
		} else {
			startApp();
		}
	})
}


function updateDataQtytobuy(id, qtytobuy, total) {
	connection.query(`UPDATE products SET quantity=${qtytobuy} WHERE id=${id}`, (error, response) => {
		if (error) throw error;
	})
}













