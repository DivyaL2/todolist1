//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require("lodash");
var path=require("path")
const app = express();
var items=[];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));






   mongoose.connect("mongodb+srv://divya:test123@cluster0.rwx6lma.mongodb.net/todolistDB");

const itemsSchema=new mongoose.Schema({
  name:String
  })
  const Item=mongoose.model("Item",itemsSchema);
  const item1=new Item({
      name:"welcome to todo list"
  });
  const item2=new Item({
      name:"press plues to add new item"
  });
  const item3=new Item({
      name:"thank u"
  });
  const defaultItems=[item1,item2,item3];

const listSchema={
  name:String,
  items:[itemsSchema]
};
const List=mongoose.model("List",listSchema);
  


app.get("/", function(req, res) {
  const day = date.getDate();
  Item.find().then(function(foundItems){
    if(foundItems.length===0){
        Item.insertMany(defaultItems).then(function(){
        
            console.log("succesfully saved");
     }).catch(function(err){
    
        console.log(err);})
        res.redirect("/");
    }
    
    
    
    
    else{
    
    
        res.render("list",{listTitle:"Today",newListItems:foundItems});
       }
    });
    



    
});

app.post("/", function(req, res){

  const inp= req.body.newItem;
  const listName=req.body.list;

  const item=new Item({
    name:inp
  });
  if(listName==="Today")
  {
    item.save();
    res.redirect("/")
  }
  else{
    List.findOne({name:customListName}).then(function(foundlist){
      foundlist.items.push(item);
      foundlist.save();
      res.redirect("/"+listName);
    })
  
  item.save();
  res.redirect("/");
}
})
// app.post("/delete",function(req,res){
//   const checkedItemId=req.body.checkbox;
//   const listName=req.body.listName;
//   if(listName=="Today")
//   {
//     Item.findByIdAndDelete(checkedItemId).then(function(err){
//    if(err) {
//     console.log("successful");
//     res.redirect("/");
//    }
//     });
  
//   }else {
//     List.findByIdAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}}.then(function(err){
//       if(!err){
//         res.redirect("/",+listName);
//       }
//     }))
//   }
  
// })
app.get("/:customListName",function(req,res){
  const customListName=_.capitalize(req.params.customListName)
  List.findOne({name:customListName}).then(function(foundlist){
    if(!foundlist){
       const list=new List({
        name:customListName,
        items:defaultItems
       });
       list.save()
       res.redirect("/"+customListName)
    }else{
      res.render("list",{listTitle:foundlist.name,newListItems:foundlist.items});
    }
  })
  const list=new List({
    name:customListName,
    items:defaultItems
  });
  list.save();

  
})
app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
