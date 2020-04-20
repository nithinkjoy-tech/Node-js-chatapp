// const mongoose=require("mongoose")

// mongoose.connect("mongodb://localhost/chat")
//         .then(()=>console.log("connected to database"))
//         .catch(err=>console.log(err))

// const user=new mongoose.Schema({
//     user:Array
// })        

// const User=mongoose.model("user",user)

// async function userJoin(id,username,room){
//     const user=new User({
//         user:{id,username,room}
//     })
//     return await user.save()
// }

// async function getCurrentUser(id){
//     const res=[]= await User.find({id:id})  //user=>user.id===id
//     return res.find(user=>user.id===id)
// }

// async function userLeave(id){
//     const index=await User.find({id:id})                         // index(user=>user.id===id)

//     // if(index!=-1){
//     //     return  User.findByIdAndRemove({id:id})                                     // users.splice(index,1)[0]
//     // }
// }

// async function getRoomUsers(room,id){
//     // const res=[]= await User.findById(id)  //user=>user.id===id
//     // return res.find(user=>user.room===room)
//     return
//    // return await User.find(user=>user.room===room)
// }

const users=[];

function userJoin(id,username,room){
    const user={id,username,room}

    users.push(user)

    return user
}


function getCurrentUser(id){
    return users.find(user=>user.id===id)
}

function userLeave(id){
    const index=users.findIndex(user=>user.id===id)

    if(index!=-1){
        return users.splice(index,1)[0]
    }
}

function getRoomUsers(room){
    return users.filter(user=>user.room===room)
}


 module.exports={
     userJoin,
     getCurrentUser,
     userLeave,
     getRoomUsers,
 }