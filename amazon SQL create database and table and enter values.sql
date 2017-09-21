DROP DATABASE IF EXISTS namazon;
CREATE DATABASE namazon;

USE namazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT default 0,
  stock_quantity INT default 20,
  PRIMARY KEY (item_id)
);

INSERT INTO products(item_name, department_name, price)

VALUES
	("FX100 HD Drone", "Electronics", "199"),
    ("Macbook Pro", "Electronics", "1499"),
    ("Baby Crib", "Furniture", "499"),
    ("Namazon Echo", "Electronics", "179"),
    ("Daddy's Home", "Entertainment", "19"),
    ("Bomber's Jacket", "Fashion", "79"),
    ("Seinfeld Complete Series", "Entertainment", "149"),
    ("Adidass Stan Smith's", "Fashion", "69"),
    ("Red Oak Dining Room Table", "Furniture", "999"),
    ("Colin Kaepernick Jersey", "Fashion", "199");
