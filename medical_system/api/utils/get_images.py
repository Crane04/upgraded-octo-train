from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

import os
client = MongoClient(os.getenv('MONGO_URI'), tlsAllowInvalidCertificates=True)
db = client['test']
profiles_collection = db['profiles']
users_collection = db['users']


def get_images():
    pipeline = [
        {
            "$lookup": {
                "from": "users",
                "localField": "user",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            "$unwind": "$user"
        },
        {
            "$match": {
                "image": {"$ne": None}
            }
        },
        {
            "$project": {
                "_id": 0,
                "username": "$user.username",
                "image": "$image"
            }
        }
    ]
    profiles = list(profiles_collection.aggregate(pipeline))
    return profiles
