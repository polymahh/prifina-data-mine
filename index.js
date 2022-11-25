require('dotenv').config()
const express = require('express')
const {Client} = require("@notionhq/client")


const app = express()

const path = require("path")
const logger = require("morgan")
const cors = require('cors')

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cors());

const notionSecret = process.env.NOTION_SECRET
const notionDataSourcesId = process.env.NOTION_DATASOURCES_ID
const notionDataAttributesId = process.env.NOTION_DATAATTRIBUTES_ID

if(!notionSecret || !notionDataSourcesId || !notionDataAttributesId ){
    throw Error("Must define NOTION_SECRET and NOTION_DATASOURCES_ID and NOTION_DATAATTRIBUTES_ID in env")
}

const notion = new Client({
    auth: notionSecret,
})

app.get("/api",(req,res)=>{
    res.send("test")
})

app.use(express.static(path.join(__dirname, "./data-mine/build")))

app.get("*",function (_,res){
    res.sendFile(
        path.join(__dirname,"./data-mine/build/index.html"),
        function(err){
            if(err){
                res.status(500).send(err)
            }
        }
    )
})


const port = process.env.PORT || 5000;
app.listen(port,()=> console.log(`server Running on port ${port}`))

module.exports = app