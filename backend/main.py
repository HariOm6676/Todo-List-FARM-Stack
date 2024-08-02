import firebase_admin
from firebase_admin import credentials, auth
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional

# Initialize Firebase Admin SDK
cred = credentials.Certificate("/etc/secrets/credential.json")
firebase_admin.initialize_app(cred)

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
    user_id: Optional[str] = None  # User ID will be obtained from Firebase token

async def get_current_user_id(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    token = auth_header.split("Bearer ")[-1]
    
    try:
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token["uid"]
        return user_id
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")

@app.get("/todos")
async def get_todos(current_user_id: str = Depends(get_current_user_id)):
    # Retrieve todos specific to the logged-in user
    todos = list(todos_collection.find({"user_id": current_user_id}))
    for todo in todos:
        todo["_id"] = str(todo["_id"])
    return todos

@app.post("/todos")
async def add_todo(todo: Todo, current_user_id: str = Depends(get_current_user_id)):
    # Add user_id to the todo item
    todo_data = todo.dict()
    todo_data['user_id'] = current_user_id
    result = todos_collection.insert_one(todo_data)
    new_todo = todos_collection.find_one({"_id": result.inserted_id})
    new_todo["_id"] = str(new_todo["_id"])
    return new_todo

@app.put("/todos/{id}")
async def update_todo(id: str, todo: Todo, current_user_id: str = Depends(get_current_user_id)):
    # Ensure the todo being updated belongs to the current user
    result = todos_collection.update_one(
        {"_id": ObjectId(id), "user_id": current_user_id},
        {"$set": todo.dict(exclude_unset=True)}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Todo not found")
    updated_todo = todos_collection.find_one({"_id": ObjectId(id)})
    updated_todo["_id"] = str(updated_todo["_id"])
    return updated_todo

@app.delete("/todos/{id}")
async def delete_todo(id: str, current_user_id: str = Depends(get_current_user_id)):
    # Ensure the todo being deleted belongs to the current user
    result = todos_collection.delete_one({"_id": ObjectId(id), "user_id": current_user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted"}
