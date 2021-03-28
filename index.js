const expObj=require("express");
const fetch = require('node-fetch');
const bodyParserObj= require('body-parser');
const path=require("path");
require("dotenv").config();
const app=expObj();
app.use(bodyParserObj.urlencoded({extended:true}));
app.use(expObj.static(path.join(__dirname,"./script")));
app.get("/", async (request,result)=>{
    result.sendFile(path.join(__dirname,"./views/index.html"));
})
app.post('/finalResult',async (request, result) => {
    console.log(request.body)
    const inputRollNums=request.body.inputRollNums.split(",");  
    let ResultofRoll=[];
    inputRollNums.forEach(passRoll=>{
        let resultRollNums=fetch("https://terriblytinytales.com/testapi?rollnumber="+passRoll);
        ResultofRoll.push(resultRollNums);
    })
    Promise.all(ResultofRoll)
        .then(data=>{
            let newListOfRoll=[];
            console.log(data)
            data.forEach(pass=>{
                newListOfRoll.push(Promise.resolve(pass.text()
                .then(final=>[pass.url.slice(49),final])))
            })
            Promise.all(newListOfRoll)
                .then(dataStored=>{
                    console.log(dataStored)
                    return result.json(dataStored)
                })
        })
        .catch(er=>{
            console.log("Opps.. Something went wrong"+er);
        })
})
app.listen(process.env.PORT, function(request,result){
    console.log("Server Started..")
})