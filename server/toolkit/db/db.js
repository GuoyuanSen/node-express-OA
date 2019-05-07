const MongoDB = require("mongodb");

const MongoClient = MongoDB.MongoClient;

const ObjectID = MongoDB.ObjectID;

const Config = {
    dbUrl:"mongodb://localhost:27017/",
    dbName:"cms"
}

class Db{
    static getInstance(){
        if(!Db.instance){
            Db.instance = new Db();
        }
        return Db.instance;
    }
    constructor(){
        this.dbClient="";
        this.connect();
    }
    connect(){
        let _that = this;
        return new Promise((resolve,reject)=>{
            if(!_that.dbClient){
                MongoClient.connect(Config.dbUrl,{useNewUrlParser:true},(err,client)=>{
                    if(err){
                        reject(err)
                    }else{
                        _that.dbClient = client.db(Config.dbName);
                        resolve(_that.dbClient)
                    }
                })
            }else{
                resolve(_that.dbClient)
            }
        })
    }
    find(collectionName,json1={},json2={},page=0,rows=0){
        page = parseInt(page);
        rows = parseInt(rows);
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                let result = db.collection(collectionName).find(json1,json2).skip((page-1)*rows).limit(rows);
                result.toArray(function(err,data){
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(data)
                })
            })
        })
    }
    update(collectionName,json1,json2){
        if(json1["_id"]){
            json1["_id"] = this.getObjectId(json1["_id"]);
        }
        console.log(json1);
        if(json2["_id"]){
            delete json2["_id"]
        }
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).updateOne(json1,{$set:json2},(err,result)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                })
            })
        })
    }
    insert(collectionName,json){
        json["state"] = "1";
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).insertOne(json,(err,result)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                })
            })
        })
    }
    remove(collectionName,json){
        json._id =  this.getObjectId(json._id);;
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).removeOne(json,(err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result)
                    }
                })
            })
        })
    }
    getObjectId(id){  // 5c21d229d1754320acfab771 ObjectID(5c21d229d1754320acfab771)
        return new ObjectID(id);
    }
    count(collectionName,json={}){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                let result = db.collection(collectionName).count(json);
                result.then((count)=>{
                    resolve(count)
                })
            })
        })
    }
}

module.exports = Db.getInstance();