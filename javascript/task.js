const fs=require('fs');
const { resolve } = require('path');
const commands=process.argv;
const command=commands[2];
const tasks=new Map();
const completedTasks=new Map();
let priorityNumbers=[];


function getData(filename,mapname){
    return new Promise((resolve,reject)=>{
        fs.readFile(__dirname+`/${filename}.txt`,"utf-8",(err,response)=>{
            if(err){
                console.log(err);
                reject();
                return;
            }
          
           if(response==="") {
                resolve();
               return true;
              
           }
            if(response){
                if(filename==="task"){
                    const list=response.trim().split('\r\n');
                  
                    list.forEach(task=>{
                        idx=task.charAt(0);
                        if(mapname.has(idx)){
                            mapname.set(idx,[...mapname.get(idx),task.substring(2)]);
                        }
                        else{
                            mapname.set(idx,[task.substring(2)]);
                        }
                    })
                    
                }

                resolve();
            }
        });
    })
    

    
}

function sortMap(map){
    priorityNumbers=Array.from(map.keys());
    priorityNumbers.sort();
    
    return true;
}



//Help
let helpMessage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

if(command===undefined || command==="help"){
    console.log((helpMessage).toString("UTF-8"));
}


//Add
if(command==="add"){
    const filePath=process.cwd();
    if(!fs.existsSync(filePath+`/task.txt`)){
        fs.writeFile(filePath+"/task.txt","",(err,res)=>{
            if(err){
                console.log(err);
                return;
            }

        });
    }
    const priorityNumber=commands[3];
    const task=commands[4];
    const errMessage="Error: Missing tasks string. Nothing added!";
    let finalContent="";
    if(task===undefined || priorityNumber===undefined){
        console.log(errMessage.toString("UTF-8"));
        return;
    }
    
    const content=priorityNumber+" "+task;
    getData("task",tasks).then(()=>{
        if(tasks.has(priorityNumber)){
            tasks.set(priorityNumber,[...tasks.get(priorityNumber),task]);
        }
        else{
            tasks.set(priorityNumber,[task]);
        }
    }).then(()=>{
        sortMap(tasks);
    }).then(()=>{
        priorityNumbers.forEach(priorityNumber=>{
            let content="";
            tasks.get(priorityNumber).forEach(task=>{
                finalContent=finalContent+(`${priorityNumber} ${task} \r\n`);
            });

            
        })
    }).then(()=>{
        fs.writeFile(filePath+"/task.txt",finalContent,(err,res)=>{
            if(err){
                console.log(err);
                return;
            }

        });
    })
    

    


    
    

    
    const message=`Added task: "${task}" with priority ${priorityNumber}`;
        
    console.log(message.toString("UTF-8"));
    
    
    
}



//Ls

if(command==="ls"){
    const errMessage="There are no pending tasks!"
    if(!fs.existsSync(__dirname+`/task.txt`)){
        console.log(errMessage.toString("UTF-8"));
        return;
    }
   
    fs.readFile(__dirname+`/task.txt`,'utf-8',(err,response)=>{
        if(err){
            console.log(err);
            return;
        }
        if(response===""){
            console.log(errMessage.toString("UTF-8"));
            return;
        }
        if(response){
            const data=response.trim().split(`\r\n`);
            let content="";
            data.forEach((task,idx)=>{
                task=task.trim();
                if(content.length!==0) content=content+`\n`;
                content=content+`${idx+1}. ${task.substring(2,task.length)} [${task.charAt(0)}]`;
                
            });
            
            console.log(content.toString("UTF-8"));
        }
        
    })
}



//Delete Item

if(command==="del"){
    const filePath=process.cwd();
    const delIdx=commands[3];
    if(delIdx===undefined){
        const missingErrMessage="Error: Missing NUMBER for deleting tasks.";
        console.log(missingErrMessage.toString("UTF-8"));
        return;
    }

    const noExistentErrMessage=`Error: task with index #${delIdx} does not exist. Nothing deleted.`;
    
    if(delIdx==='0' || !fs.existsSync(filePath+`/task.txt`)){
        console.log(noExistentErrMessage.toString("UTF-8"));
        return;
    }
    else{

    
    
        fs.readFile(__dirname+`/task.txt`,'utf-8',(err,response)=>{
            if(err){
                console.log(err);
                return;
            }
            if(response===""){
                console.log(noExistentErrMessage.toString("UTF-8"));
                return;
            }
            if(response){
                let data=response.trim().split(`\r\n`);
                let content="";
            
                if(data.length<delIdx){
                    console.log(noExistentErrMessage.toString("UTF-8"));
                    return;
                }
                data=data.slice(0,delIdx-1).concat(data.slice(delIdx));
            
                data.forEach((task,idx)=>{
                    task=task.trim();
                    if(content.length!==0) content=content+`\r\n`;
                    content=content+`${task.charAt(0)} ${task.substring(2,task.length)}`;
                    
                });


                fs.writeFile(filePath+"/task.txt",content,(err,res)=>{
                    if(err){
                        console.log(err);
                        return;
                    }

                    else{
                        const successMessage=`Deleted task #${delIdx}`;
                        console.log(successMessage.toString("UTF-8"));
                    }
        
                });


                
                
            }
            
        })

    }
    

    
}



//Mark as done

if(command==="done"){
    const filePath=process.cwd();
    const markIdx=commands[3];
    if(markIdx===undefined){
        const missingErrMessage="Error: Missing NUMBER for marking tasks as done.";
        console.log(missingErrMessage.toString("UTF-8"));
        return;
    }

    const noExistentErrMessage=`Error: no incomplete item with index #${markIdx} exists.`;
    
    if(markIdx==='0' || !fs.existsSync(filePath+`/task.txt`)){
        console.log(noExistentErrMessage.toString("UTF-8"));
        return;
    }
    else{

    
    
        fs.readFile(__dirname+`/task.txt`,'utf-8',(err,response)=>{
            if(err){
                console.log(err);
                return;
            }
            if(response===""){
                console.log(noExistentErrMessage.toString("UTF-8"));
                return;
            }
            if(response){
                let data=response.trim().split(`\r\n`);
                let content="";
            
                if(data.length<markIdx){
                    console.log(noExistentErrMessage.toString("UTF-8"));
                    return;
                }
                let completedTask=data[markIdx-1].trim().substring(2)+`\r\n`;
                data=data.slice(0,markIdx-1).concat(data.slice(markIdx));
            
                data.forEach((task,idx)=>{
                    task=task.trim();
                    if(content.length!==0) content=content+`\r\n`;
                    content=content+`${task.charAt(0)} ${task.substring(2,task.length)}`;
                    
                });


                fs.writeFile(filePath+"/task.txt",content,(err,res)=>{
                    if(err){
                        console.log(err);
                        return;
                    }
        
                });

                
                fs.writeFile(__dirname+'/completed.txt',completedTask,{flag:'a'},(err,res)=>{
                    if(err){
                        console.log(err);
                        return;
                    }
                    else{
                        const successMessage=`Marked item as done.`
                        console.log(successMessage.toString("UTF-8"));
                    }
                });
                


                
                
            }
            
        })

    }
}


//Generate A Report

if(command==="report"){
    
    
    let content="";
    return new Promise((resolve,reject)=>{
        if(!fs.existsSync(__dirname+`/task.txt`)){
            content=`Pending : ${0}\n`;
        }
        else{
            fs.readFile(__dirname+`/task.txt`,'utf-8',(err,response)=>{
                if(err){
                    console.log(err);
                    reject();
                    return;
                }
                if(response===""){
                    content=`Pending : ${0}\n`;
                    resolve();
                }
                if(response){
                    const data=response.trim().split(`\r\n`);
                   
                    content=`Pending : ${data.length}\n`;
                    data.forEach((task,idx)=>{
                        task=task.trim();
                        
                        content=content+`${idx+1}. ${task.substring(2,task.length)} [${task.charAt(0)}]\n\n`;
                        
                    });
                    
                    resolve();
                }
                
            });
            
        }
    }).then(()=>{

        return new Promise((resolve,reject)=>{
            if(!fs.existsSync(__dirname+`/completed.txt`)){
                content=content+`Completed : ${0}\n`;
                resolve();
            }

            else{
                fs.readFile(__dirname+`/completed.txt`,"utf-8",(err,response)=>{
                    if(err){
                        console.log(err);
                        reject();
                        return;
                    }
                    if(response===""){
                        content=content+`\nCompleted : ${0}\n`;
                        resolve();
            
                    }
                    if(response){
                        const data=response.trim().split(`\r\n`);
                        
                        content=content+`Completed : ${data.length}\n`;
                        data.forEach((task,idx)=>{
                            task=task.trim();
                            if(idx!==task.length-1){
                                content=content+`${idx+1}. ${task}\n`;
                            }else{
                                content=content+`${idx+1}. ${task}`;
                            }
                            
                            
                        });

                        resolve();
                       
                    }
                });
                
            }
        })
        
    }).then(()=>{
            console.log(content);
        });  
        
}



