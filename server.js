const express = require("express");
const path = require("path");
const dataObjs = require("./data-service.js");
const bodyParser = require('body-parser');
const fs = require("fs");
const multer = require("multer");
const exphbs = require('express-handlebars');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

// new code
function onHttpStart(){
    console.log("Express http server listening on " + HTTP_PORT);
};

app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: "main",
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }      
    }
}))

app.set('view engine', '.hbs');

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

// new code
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true}));

app.get("/", function(req,res){
    res.render(path.join(__dirname, "/views/home"));
});

app.get("/about", function(req,res){
    res.render(path.join(__dirname, "/views/about"));
});

app.get("/employees", function(req,res){
    if (req.query.status != null)
    {
        dataObjs.getEmployeesByStatus(req.query.status)
        .then((data) => {
            if (data.length > 0)
            {
                res.render(path.join(__dirname, "/views/employees"), {
                    emps: data
                });
            }
            else
            {
                res.render(path.join(__dirname, "/views/employees"), {
                    message: "no results"
                });
            }
        })
        .catch((data) => {
            res.render({message : "No Results"});
        });
    }
    else if(req.query.department != null)
    {
        dataObjs.getEmployeesByDepartment(req.query.department)
        .then((data) => {
            if (data.length > 0)
            {
                res.render(path.join(__dirname, "/views/employees"), {
                    emps: data
                });
            }
            else
            {
                res.render(path.join(__dirname, "/views/employees"), {
                    message: "no results"
                });
            }
        })
        .catch((data) => {
            res.render({message : "No Results"});
        });
    }
    else if(req.query.manager != null)
    {
        dataObjs.getEmployeesByManager(req.query.manager)
        .then((data) => {
            if (data.length > 0)
            {
                res.render(path.join(__dirname, "/views/employees"), {
                    emps: data
            });
            }
            else
            {
                res.render(path.join(__dirname, "/views/employees"), {
                    message: "no results"
                });
            }
        })
        .catch((data) => {
            res.render({message : "No Results"});
        });
    }
    else
    {
        dataObjs.getAllEmployees()
        .then(function(data){
            if (data.length > 0)
            {
                res.render(path.join(__dirname, "/views/employees"), {
                    emps: data
                });
            }
            else
            {
                res.render(path.join(__dirname, "/views/employees"), {
                    message: "no results"
                });
            }
            })
        .catch(function(data){
            res.render({message : "No Results"});
        });
    }
});

app.get("/employee/:empNum", (req, res) => {
        // initialize an empty object to store the values
        let viewData = {};

        dataObjs.getEmployeeByNum(req.params.empNum).then((data) => {
            if (data) {
                viewData.employee = data[0]; //store employee data in the "viewData" object as "employee"
            } else {
                viewData.employee = null; // set employee to null if none were returned
            }
        }).catch(() => {
            viewData.employee = null; // set employee to null if there was an error 
        })
        .then(dataObjs.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
    
            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching 
            // viewData.departments object
    
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                    break;
                }
            }
        }).catch(() => {
            viewData.departments = [];
        }).then(() => {
            if (viewData.employee == null) {
                res.status(404).send("Employee Not Found");
            } else {
                res.render(path.join(__dirname, "/views/employee") , { viewData: viewData }); 
            }
        })
        .catch( (err) => {
            res.status(500).send("Unable to retrieve employee");
        });
    });
    



app.post("/employee/update", /*upload.array(),*/ (req,res) => {
   // console.log(req.body.viewData.employee);
    dataObjs.updateEmployee(req.body)
    .then((data) => {
        console.log(data);
        res.redirect("/employees");
    })
    .catch( (data) => {
        console.log(data);
        res.redirect("/employees");
    });   
})

app.get("/departments", function(req,res){
    dataObjs.getDepartments()
    .then(function(data){
        if(data.length > 0)
        {
            res.render(path.join(__dirname, "/views/departments"), {
                depts: data
            });
        }
        else
        {
            res.render(path.join(__dirname, "/views/departments"), {
                message: "no results"
            });
        }
    })
    .catch(function(data){
        console.log(data);
        res.render({message : "No Results"});
    });
});

app.get("/employees/add", function(req,res){
    dataObjs.getDepartments()
    .then( (data) => {
        res.render(path.join(__dirname, "/views/addEmployee"), {
            departments: data
        });
    })
    .catch( () => {
        res.render(path.join(__dirname, "/views/addEmployee"), {
            departments: []
        });
    });
    
});

app.post("/employees/add", upload.array(), (req, res) => {
    dataObjs.addEmployee(req.body)
    .then( (data) => {
        console.log(data);
    })
    .catch( (data) => {
        console.log(data);
    });
    res.redirect("/employees");
});

app.get("/employees/delete/:empNum", (req, res) => {
    dataObjs.deleteEmployeeByNum(req.params.empNum)
    .then ( (data) => {
        console.log(data);
        res.redirect("/employees");
    })
    .catch( (data) => {
        console.log(data);
        res.status(500).send(data);
    })
});

app.get("/images/add", function(req,res){
    res.render(path.join(__dirname, "/views/addImage"));
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images", (req, res)=>{
    var imgPath = path.join(__dirname, "/public/images/uploaded");

    fs.readdir(imgPath, (err, items) => {
        if (err)
        {
            res.send(err);
        }

        res.render(path.join(__dirname, "/views/images"), {
            images: items
        });
    });
});

app.get("/departments/add", (req, res) => {
    res.render(path.join(__dirname, "/views/addDepartment"));
})

app.post("/departments/add", upload.array(), (req, res) => {
    dataObjs.addDepartment(req.body)
    .then( (data) => {
        console.log(data);
    })
    .catch( (data) => {
        console.log(data);
    })
    res.redirect("/departments");
})

app.post("/departments/update", (req, res) => {
    dataObjs.updateDepartment(req.body)
    .then((data) => {
        console.log(data);
        res.redirect("/departments");
    })
    .catch( (data) => {
        console.log(data);
        res.redirect("/departments");
    });  
})

app.get("/department/:deptId", (req, res) => {
    dataObjs.getDepartmentById(req.params.deptId)
    .then((data) =>{
        if(data)
        {
            res.render(path.join(__dirname, "/views/department"), {
                dept: data[0]
            });
        }
        else
        {
            res.status(404).send("Department Not Found");
        }
    })
    .catch(function(data){
        res.status(404).send("Department Not Found");
    });
})

app.get("*", function(req,res){
    res.sendFile(path.join(__dirname, "/public/404.png"));
    res.status(404);
})

dataObjs.initialize()
.then(function(){
    app.listen(HTTP_PORT, onHttpStart);
})
.catch(function(data){
    console.log(data);
});