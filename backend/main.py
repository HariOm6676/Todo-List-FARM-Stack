from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient('mongodb+srv://hariomshukla337:hari123@cluster0.vsto6ay.mongodb.net/')
db = client['todo_list']
todos_collection = db['todos']

class Todo(BaseModel):
    text: str
    completed: bool
    date: str
    time: str

@app.get("/todos")
async def get_todos():
    todos = list(todos_collection.find())
    for todo in todos:
        todo["_id"] = str(todo["_id"])
    return todos

@app.post("/todos")
async def add_todo(todo: Todo):
    result = todos_collection.insert_one(todo.dict())
    new_todo = todos_collection.find_one({"_id": result.inserted_id})
    new_todo["_id"] = str(new_todo["_id"])
    return new_todo

@app.put("/todos/{id}")
async def update_todo(id: str, todo: Todo):
    result = todos_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": todo.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Todo not found")
    updated_todo = todos_collection.find_one({"_id": ObjectId(id)})
    updated_todo["_id"] = str(updated_todo["_id"])
    return updated_todo

@app.delete("/todos/{id}")
async def delete_todo(id: str):
    result = todos_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted"}
