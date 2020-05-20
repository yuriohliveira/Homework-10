const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");


const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const employeeArr = []; 

const render = require("./lib/htmlRenderer.js");

const inputArr = [
    {
        type: "list",
        message: "Select the role of the employee:",
        name: "employeeRole",
        choices: ["Intern","Engineer","Manager"]
    },
    {
        type: "input",
        message: "Type the name of the employee",
        name: "name"
    },
    {
        type: "input",
        message: "Type the ID of the employee",
        name: "id"
    },
    {
        type: "input",
        message: "Type the email of the employee",
        name: "email"
    },
    //interns only (school)
    {
        type: "input", 
        message: "Type the employee's school",
        name: "school",
        when: (response) => response.employeeRole === 'Intern'
    },
    //engineers only (github)
    {
        type: "input", 
        message: "Type the employee's GitHub username",
        name: "github",
        when: (response) => response.employeeRole === 'Engineer'
    },
    //managers only (office number)
    {
        type: "input", 
        message: "Type the employee's office number",
        name: "officeNumber",
        when: (response) => response.employeeRole === 'Manager'
    },
    {
        type: "list",
        message: "Would you like to enter another employee?",
        name: "anotherEmployee",
        choices: ["Yes","No"]
    }
  ]

function prompt() {
    inquirer

    .prompt(inputArr)
    .then(function(response) {

        let employee = null; 
        if(response.employeeRole === "Intern") {
            employee = new Intern(response.name,response.id,response.email,response.school); 
        }
        else if(response.employeeRole === "Engineer") {
            employee = new Engineer(response.name,response.id,response.email,response.github); 
        }
        else {
            employee = new Manager(response.name,response.id,response.email,response.officeNumber); 
        }

        employeeArr.push(employee); 

        if(response.anotherEmployee === "Yes") {
            prompt(); 
        }
        else {
            try {
                writeToFile(render(employeeArr)); 
            } catch(error) {
                console.error(error);
            } 
        }
    }); 
}

function writeToFile(fileData) { 
    if (!fs.existsSync(OUTPUT_DIR)){
        fs.mkdirSync(OUTPUT_DIR);
    }
    
    fs.writeFile(outputPath,fileData,function(error) {
        if(error) {
            return console.log(error); 
        }
    }); 
}

prompt(); 