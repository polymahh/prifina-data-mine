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



// this for dynamically getting data sources
const dataRouter = express.Router()

dataRouter.get("/", async (req,res)=>{
    res.status(200)
    const query = await notion.databases.query({                    
    database_id: notionDataSourcesId
    }).then(result => res.json(result.results.map(item=> item.properties)))
})
    
    

dataRouter.get("/:id",(req,res) => {
    console.log(req.url)
    res.status(200)
    res.json({result:`data source with id ${req.params.id}`})
})

app.use("/api/data-sources",dataRouter)

// this for dynamically getting conectors data
const connectorRouter = express.Router()

connectorRouter.get("/",(req,res) => {
    console.log(req.url)
    res.status(200)
    res.json({result:"sucess connector"})
})
connectorRouter.get("/:id",(req,res) => {
    console.log(req.url)
    res.status(200)
    res.json({result:`connecor with id ${req.params.id}`})
})

app.use("/api/data-connectors",connectorRouter)



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