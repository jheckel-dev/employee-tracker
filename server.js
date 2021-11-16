const inquirer = require("inquirer");
var mysql = require("mysql2");
const cTable = require("console.table");
var roleId = "";

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "spacejam",
    database: "employee_db"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("Welcome to the employee tracker!");
    console.log("--------------------------------")
    init();
  });

  function init() {
    inquirer
        .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "Remove Employee",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
       
        "exit"
      ]
    })
    .then(function(res){
      switch (res.action)  {
        case "View All Employees":
        viewEmployees();
        break;
        
        

        case  "Add Employee":
        addEmployee();       
        break;

        case "Update Employee Role":
        updateRole();
        break;

        

        case "Remove Employee":
        removeEmployee();
        break;
        
        case "View All Roles":
        viewRoles();
        break;
        
        case "Add Role":
        addRole();
        break;
        
        case "View All Departments":
        viewDepartments();
        break;
        
        case "Add Department":
        addDepartment();
        break;
        
       

        case "exit":
        connection.end();
        break;
      }
    });
  };

function viewEmployees() {
  var query = `SELECT e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS Title, r.salary AS Salary,\
  d.name AS Department, CONCAT(e2.first_name," ", e2.last_name) AS Manager\
  FROM employee e\ 
  LEFT JOIN employee e2 ON e.manager_id = e2.employee_id\
  LEFT JOIN role r ON e.role_id = r.id\
  LEFT JOIN department d ON r.department_id = d.id`;
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.log("\n");
    console.table(res);
  });
  init();
};

  
function viewDepartment(){
  var departmentArr = [];
  let query = "SELECT name FROM department";
  connection.query(query, function(err, res){
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      let departmentSelect = res[i].name;
      departmentArr.push(departmentSelect);
    }
    inquirer.prompt(
      {
        name: "depart",
        message: "Which department would you like to view?",
        type: "list",
        choices: departmentArr
      }
    ).then(function(viewDepartmentData){
      console.log(viewDepartmentData.depart);
      connection.query("SELECT id FROM department WHERE ?",
      {
        name: viewDepartmentData.depart
      },
      function(err, res) {
        if (err) throw err;
        
        var query = `SELECT id FROM role WHERE ?`;
        connection.query(query, 
          [{
            department_id: res[0].id
          }],
        async function(err, res2){
          if (err) throw (err);
           
          
          let query = `SELECT employee_id FROM employee WHERE ?`;
          var byDepartmentArr = [];
          for (var i=0; i<res2.length; i++) {
            connection.query(query, 
              [{
                role_id: res2[i].id
              }],
              function(err, res3){
                if (err) throw (err);
                query= `SELECT e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS Title, r.salary AS Salary
                FROM employee e
                LEFT JOIN role r ON e.role_id = r.id
                WHERE ?`;
                connection.query(query,
                  [{
                    employee_id: res3[0].employee_id
                  }],
                  function(err, res4){
                    if (err) throw err;
                    
                    let objSelect = res4[0];
                    byDepartmentArr.push(objSelect);
                    

                  }
                  )
              }
              )
          }  
        
        }
        ).then(console.log(byDepartmentArr))
      }
      )
    })
    })
};
function addEmployee() {
  
  let employeeArr = ["No Manager"];
    let query = "SELECT first_name, last_name FROM employee";
    connection.query(query, function(err, res){
      if (err) throw err;
      
      for (var i = 0; i < res.length; i++) {
        
        let employeeSelect = res[i].first_name + " " + res[i].last_name;
    
        employeeArr.push(employeeSelect);
      }
       
       inquirer
       .prompt([
         {
         name: "firstName",
         type: "input",
         message: "What is the employee's first name?"
       },{
         name: "lastName",
         type: "input",
         message: "What is the employee's last name?"
       },{
         name: "title",
         type: "list",
         message: "What is the employee's title?",
         choices: [
           "Sales Lead",
           "Sales Person",
           "Lead Engineer",
           "Software Engineer",
           "Legal Team Lead",
           "Lawyer",
           "Accountant"
         ]
       },{
         name:"manager",
         type: "list",
         message: "Who is this employee's manager?",
         choices: employeeArr
       }
       ])
       .then(function(newData){
         console.log(newData.manager);
         connection.query (
           "SELECT role.id FROM role WHERE ?",
           [{
             title: newData.title
           }],
           function(err, res) {
           if(err) throw err;
           roleId = res[0].id;
           console.log(res[0].id);
           if (newData.manager !== "No Manager"){
           connection.query(
             "SELECT employee_id FROM employee WHERE ? AND ?",
             [{
               first_name: newData.manager.split(" ")[0]
             },{
               last_name: newData.manager.split(" ")[1]
             }],
             function(err, res2) {
               if(err) throw err;
               
               connection.query(
                 "INSERT INTO employee SET ?",
                 {
                   first_name: newData.firstName,
                   last_name: newData.lastName,
                   role_id: parseInt(roleId),
                   manager_id: res2[0].employee_id
                 },
                 function(err, res) {
                 if (err) throw err;
                 console.log("Employee Added!");
                 init();
                 }
               )
               } 
             )}
             else {
               connection.query(
                 "INSERT INTO employee SET ?",
                 {
                   first_name: newData.firstName,
                   last_name: newData.lastName,
                   role_id: parseInt(roleId),
                   manager_id: null
                 },
                 function(err, res) {
                 if (err) throw err;
                 console.log("Employee Added!");
                 init();
                 }
               )
             }   
           }
         )  
       })
    });
 };
 
function removeEmployee() {
   let employeeArr = [];
   let query = "SELECT first_name, last_name FROM employee";
   connection.query(query, function(err, res){
     if (err) throw err;
     
     for (var i = 0; i < res.length; i++) {
       let employeeSelect = res[i].first_name + " " + res[i].last_name;
       employeeArr.push(employeeSelect);
     }
     inquirer
     .prompt([
       {
        name: "delete",
        type: "list",
        message: "Who would you like to remove from the tracker?",
        choices: employeeArr 
       }
     ])
     .then(function(deleteData){
       console.log(deleteData.delete);
       console.log("Deleting employee...\n");
       connection.query(
         "SELECT employee_id FROM employee WHERE ? AND ?",
         [{
           first_name: deleteData.delete.split(" ")[0]
         },{
           last_name: deleteData.delete.split(" ")[1]
         }],
         function(err, res2) {
           if(err) throw err;
           console.log("ID to be deleted: "+res2[0].employee_id);
           connection.query(
             "DELETE FROM employee WHERE ?",
             {
               employee_id: res2[0].employee_id 
             },
             function(err, res) {
               if (err) throw err;
               console.log(res.affectedRows + " Employee deleted \n");
               init();
             }
           )
         } 
       ) 
     })
   });
};
function updateRole(){
  let employeeArr = [];
  connection.query("SELECT first_name, last_name FROM employee", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      var employeeSelect = res[i].first_name + " " + res[i].last_name;
      employeeArr.push(employeeSelect);
    }
    console.log("Employee Array bby  "+employeeArr);
    inquirer
      .prompt({
        name: "delete",
        message: "Which employee would you like to update?",
        type: "list",
        choices: employeeArr
      }).then(function(deleteData){
        connection.query("SELECT employee_id FROM employee WHERE ? AND ?",
          [{
          first_name: deleteData.delete.split(" ")[0]
          },{
          last_name: deleteData.delete.split(" ")[1]
          }],
          function(err, employId) {
            if (err) throw err;
            console.log(employId[0].employee_id);
            let updateArr = [];
            connection.query("SELECT title FROM role", function(err, res){
              if (err) throw err;
              for (var i = 0; i < res.length; i++) {
                let updateSelect = res[i].title;
                updateArr.push(updateSelect);
              }
              inquirer.prompt([
                {
                  name:"update",
                  message: "What role does this employee now fill?",
                  type: "list",
                  choices: updateArr
                }
              ]).then(function(updateData){
                let newRole = updateData.update;
                connection.query("SELECT id FROM role WHERE ?",
                  {
                    title: newRole
                  },
                function(err, roleIdData) {
                  if (err) throw err;
                  connection.query("UPDATE employee SET ? WHERE ?",
                  [{
                    role_id: roleIdData[0].id
                  },
                  {
                   employee_id: employId[0].employee_id
                  }],
                  function(err, res) {
                    if(err) throw err;
                  console.log("Updated");
                  init();
                  }
                  )
                }
                )

              })
            })

          }
        )
      })
  })
};
function viewRoles() {
  var query = "SELECT r.title AS Title, r.salary AS Salary, d.name AS Department FROM role r LEFT JOIN department d ON r.department_id = d.id;";
  connection.query(query, function(err, res) {
    if(err) throw err;
    console.log("\n");
    console.table(res);
  });
  init();
};
function addRole(){
  let departmentArr = [];
    let query = "SELECT name FROM department";
    connection.query(query, function(err, res){
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        let departmentSelect = res[i].name;
        departmentArr.push(departmentSelect);
      }
      inquirer
        .prompt([
          {
          name: "title",
          message: "What is the new role's title?",
          type: "input"
        },{
          name: "salary",
          message: "What is the role's salary?",
          type: "input"
        },{
          name: "department",
          message: "To which department does this role belong?",
          type: "list",
          choices: departmentArr
        }
        ])
        .then(function(roleData){
          connection.query("SELECT id from department WHERE ?",
          {
            name: roleData.department
          },
            function(err, res){
              if(err) throw err;
              connection.query("INSERT INTO role SET ?",
              {
                title: roleData.title,
                salary: roleData.salary,
                department_id: res.name
              }, function(err, res2){
                  if(err) throw err;
                  console.log("Added role");
                  init();
              })
            }
          )
        })
    })
};



function viewDepartments() {
  var query = "SELECT d.id AS ID, d.name AS Name FROM department d";
  connection.query(query, function(err, res) {
    if(err) throw err;
    console.log("\n");
    console.table(res);
  });
  init();
};
function addDepartment(){
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message:"What is the new department's name?"
      }
    ])
    .then(function(departmentData){
      connection.query("INSERT INTO department SET ?",
      {
        name:departmentData.name
      },
      function(err, res) {
        if(err) throw err;
        console.log("Department Created");
        init();
      }
      )
    })
};
function removeDepartment(){
  let departmentArr = [];
  let query = "SELECT name FROM department";
  connection.query(query, function(err, res){
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      let departmentSelect = res[i].name;
      departmentArr.push(departmentSelect);
    }
    inquirer
    .prompt([
      {
       name: "delete",
       type: "list",
       message: "Which department would you like to remove from the tracker?",
       choices: departmentArr 
      }
    ])
    .then(function(deleteData){
      console.log("++++++++++++++++"+deleteData.delete);
      console.log("Deleting department...\n");
      connection.query(
        "SELECT id FROM department WHERE ?",
        {
          name: deleteData.delete
        },
        function(err, res2) {
          if(err) throw err;
          console.log("_____________");
          console.log("ID to be deleted: "+res2[0].id);
        } 
      ) 
    })
  });
};
function getEmpArr() {
  let employeeArr = ["This employee has no manager"];
  let query = "SELECT first_name, last_name FROM employee";
  connection.query(query, function(err, res){
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      let employeeSelect = res[i].first_name + " " + res[i].last_name;
      employeeArr.push(employeeSelect);
    }
  });
 return employeeArr;
};