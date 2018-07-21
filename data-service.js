//const fs = require("fs");

//let employees = [];
//let departments = [];
const Sequelize = require('sequelize');
var sequelize = new Sequelize('d7slfjb1vnhi6m', 'khawxfdbsepnmo', 'a25f5cf1f369c950311755825bd192bdb5326f87c02354aa20779768b63a0cca', {
    host: 'ec2-107-21-126-193.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
dialectOptions: {
ssl: true
    }
});

var Employee = sequelize.define('Employees', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
},{
    createdAt: false,
    updatedAt: false
});

var Department = sequelize.define('Departments', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
}, {
    createdAt: false,
    updatedAt: false
})

module.exports.initialize = function() {
    return new Promise(function(resolve, reject){
        sequelize.sync().then( () => {
            resolve();
        }).catch( (err) => {
            reject("Unable to synchronize the database");
        })        
    });
}

module.exports.getAllEmployees = function(){

    return new Promise(function(resolve, reject){
        sequelize.sync().then( () => {
            Employee.findAll({
                attributes: [ 'employeeNum', 'firstName', 'lastName', 'email', 'SSN', 'addressStreet', 'addressCity', 'addressState', 'addressPostal', 'maritalStatus', 'isManager', 'employeeManagerNum', 'status', 'department' ,'hireDate']
            })
            .then( (data) => {
                resolve(data);
            })
            .catch( () => {
                reject("Unable to retrieve employees");
            });
        })
        .catch( () => {
            reject("Unable to retrieve employees");
        });
    });
}



module.exports.getDepartments = function(){

    return new Promise(function(resolve, reject)
    {
        sequelize.sync().then( () => {
            Department.findAll({
                attributes: [ 'departmentId', 'departmentName']
            })
            .then ( (data) => {
                resolve(data);
            })
            .catch( () => {
                reject("No result returned");
            })
        })
    });
}

module.exports.addEmployee = function(employeeData){

    return new Promise((resolve, reject) => {
        
        employeeData.isManager = (employeeData.isManager)? true: false;

        for (const prop in employeeData)
        {
            employeeData[prop] = (employeeData[prop] == "") ? null: employeeData[prop];
        }

        sequelize.sync().then( () => {
            Employee.create({
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            })
            .then( () => {
                resolve("Employee has been added");
            })
            .catch( () => {
                reject("Unable to create employee");
            })
        })
        .catch( () => {
            reject("Unable to create amployee");
        });

    });
}

module.exports.getEmployeesByStatus = (statusP) => {
    return new Promise(function(resolve, reject)
    {
        if(statusP.toString().trim() == "Full Time" || statusP.toString().trim() == "Part Time")
        {
            sequelize.sync().then( () => {
                Employee.findAll({
                    attributes: [ 'employeeNum', 'firstName', 'lastName', 'email', 'SSN', 'addressStreet', 'addressCity', 'addressState', 'addressPostal', 'maritalStatus', 'isManager', 'employeeManagerNum', 'status', 'department' ,'hireDate'],
                    where: {
                        status: statusP
                    }
                })
                .then( (data) => {
    
                    resolve(data);
                })
                .catch( () => {
                    reject("Unable to retrieve" + status + " employees");
                });
            })
            .catch( () => {
                reject("Unable to retrieve" + status + " employees");
            });
        }
        else
        {
            reject("Unable to retrieve" + status + " employees");
        }
    })
}

module.exports.getEmployeesByDepartment = (department) => {
    var departmentP = Number(department);

    return new Promise(function(resolve, reject){
        if (departmentP >= 1 && departmentP <= 7)
        {
            sequelize.sync().then( () => {
                Employee.findAll({
                    attributes: [ 'employeeNum', 'firstName', 'lastName', 'email', 'SSN', 'addressStreet', 'addressCity', 'addressState', 'addressPostal', 'maritalStatus', 'isManager', 'employeeManagerNum', 'status', 'department' ,'hireDate'],
                    where: {
                        department: departmentP
                    }
                })
                .then( (data) => {
    
                    resolve(data);
                })
                .catch( () => {
                    reject("Unable to retrieve employees from department" + departmentP);
                });
            })
            .catch( () => {
                reject("Unable to retrieve employees from department" + departmentP);
            });
        }
        else
        {
            reject("Unable to retrieve employees from department" + departmentP);
        }
    })
}

module.exports.getEmployeesByManager = (manager) => {
    var managerP = Number(manager);
    
    return new Promise(function(resolve, reject){
        if (managerP >=1 && managerP <= 30)
        {
            sequelize.sync().then( () => {
                Employee.findAll({
                    attributes: [ 'employeeNum', 'firstName', 'lastName', 'email', 'SSN', 'addressStreet', 'addressCity', 'addressState', 'addressPostal', 'maritalStatus', 'isManager', 'employeeManagerNum', 'status', 'department' ,'hireDate'],
                    where: {
                        employeeManagerNum: managerP
                    }
                })
                .then( (data) => {
    
                    resolve(data);
                })
                .catch( () => {
                    reject("Unable to retrieve employees from manager number: " + manager);
                });
            })
            .catch( () => {
                reject("Unable to retrieve employees from manager number: " + manager);
            });
        }
        else
        {
            reject("Unable to retrieve employees from manager number: " + manager);
        }
    })
}

module.exports.getEmployeeByNum = (num) => {
    var numP = Number(num);

    return new Promise(function(resolve, reject)
    {
        sequelize.sync().then( () => {
            Employee.findAll()                
            .then( (data) => {
                resolve(data);
            })
            .catch( () => {
                reject("Unable to retrieve employee " + num);
            });
        })
        .catch( () => {
            reject("Unable to retrieve employee " + num);
        });
    })
}

module.exports.deleteEmployeeByNum = (empNum) => {
    var empNumP = Number(empNum);

    return new Promise( (resolve, reject) => {
        sequelize.sync().then( () => {
            Employee.destroy({
                where: { employeeNum: empNumP}
            })
            .then( () => {
                resolve("Employee " + empNumP + " was destroyed");
            })
            .catch( () => {
                reject("Unable to remove employee " + empNumP + " / Employee "+ empNumP + " not found");
            })
        })
    })
}

module.exports.updateEmployee = (empData) => {
    return new Promise( (resolve, reject) => {
        empData.isManager = (empData.isManager)? true: false;

        for (const prop in empData)
        {
            empData[prop] = (empData[prop] == "") ? null: empData[prop];
        }
        
        sequelize.sync().then( () => {
            Employee.update({
                firstName: empData.firstName,
                lastName: empData.lastName,
                email: empData.email,
                SSN: empData.SSN,
                addressStreet: empData.addressStreet,
                addressCity: empData.addressCity,
                addressState: empData.addressState,
                addressPostal: empData.addressPostal,
                maritalStatus: empData.maritalStatus,
                isManager: empData.isManager,
                employeeManagerNum: empData.employeeManagerNum,
                status: empData.status,
                department: empData.department,
                hireDate: empData.hireDate
            }, {
                where: { employeeNum: empData.employeeNum}
            })
            .then( () => {
                resolve("Employee has been updated");
            })
            .catch( () => {
                reject("Unable to update employee");
            })
        })
        .catch( () => {
            reject("Unable to update amployee");
        });
    });
}

module.exports.addDepartment = (deptData) => {

    return new Promise ((resolve, reject) => {
        for (const prop in deptData)
        {
            deptData[prop] = (deptData[prop] == "") ? null: deptData[prop];
        }

        sequelize.sync().then( () => {
            Department.create({
                departmentName: deptData.departmentName
            })
            .then( () => {
                resolve("Department has been created");
            })
            .catch( () => {
                reject("Uanble to create department");
            });

        })
        .catch( () => {
            reject("Uanble to create department");
        })
    });
}

module.exports.updateDepartment = (deptData) => {

    return new Promise ((resolve, reject) => {
        for (const prop in deptData)
        {
            deptData[prop] = (deptData[prop] == "") ? null: deptData[prop];
        }

        sequelize.sync().then( () => {
            Department.update({
                departmentName: deptData.departmentName
            }, {
                where: { departmentId: deptData.departmentId}
            })
            .then( () => {
                resolve("Department has been updated");
            })
            .catch( () => {
                reject("Uanble to update department");
            });

        })
        .catch( () => {
            reject("Uanble to update department");
        })
    });
}

module.exports.getDepartmentById = (id) => {
    var idP = Number(id);

    return new Promise(function(resolve, reject)
    {
        sequelize.sync().then( () => {
            Department.findAll({
                attributes: [ 'departmentId', 'departmentName'],
                where: {
                    departmentId: idP
                }
            })
            .then( (data) => {
                resolve(data);
            })
            .catch( () => {
                reject("Unable to retrieve department " + id);
            });
        })
        .catch( () => {
            reject("Unable to retrieve department " + id);
        });
    })
}