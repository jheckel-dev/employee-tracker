

DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;


CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
 
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  manager_id INT,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)

);


INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("Finance");
INSERT INTO department (name)
VALUE ("Legal");


INSERT INTO role (title, salary, department_id)
VALUE ("Lead Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Legal Team Lead", 250000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Salesperson", 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Lawyer", 190000, 4);


INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Jerry", "Seinfeld", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Elaine", "Benes", null, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("George","Costanza",null,3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Newmain", "The Mailman", 1, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Cosmo", "Kramer", 4, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Allen", "Alda", 1, 6);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Clark", "Gable", 2, 7);


SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
