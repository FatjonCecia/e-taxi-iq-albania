import os
from database import client

url = os.getenv("MONGODB_URL")

if url:
    print("MONGODB_URL found")
    print("Starts with:", url[:20])
else:
    print("MONGODB_URL NOT FOUND")

try:
    client.admin.command("ping")
    print("MongoDB connected successfully!")

except Exception as e:
    print("MongoDB connection failed:")
    print(e)