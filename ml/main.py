from flask import Flask, request, jsonify
import cv2
import numpy as np
import requests
app = Flask(__name__)
from bson import ObjectId
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
client = MongoClient(os.getenv('MONGO_URI'))
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

@app.route('/compare', methods=['POST'])
def compare_images():
    if 'image' not in request.files:
        return jsonify({'error': 'Missing required fields'}), 400

    image_file = request.files['image']
    people = get_images()

    print(people)

    try:
        # Convert the image file to a numpy array
        image = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)

        # Initialize an empty list to store the results
        results = []

        # Iterate over each person
        for person in people:
            # Download the person's image
            response = requests.get(person['image'])
            person_image = cv2.imdecode(np.frombuffer(response.content, np.uint8), cv2.IMREAD_COLOR)

            # Convert images to grayscale
            gray_target = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            gray_person = cv2.cvtColor(person_image, cv2.COLOR_BGR2GRAY)

            # Detect faces using Haar cascades
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            target_faces = face_cascade.detectMultiScale(gray_target, scaleFactor=1.1, minNeighbors=5)
            person_faces = face_cascade.detectMultiScale(gray_person, scaleFactor=1.1, minNeighbors=5)

            # Check if faces were detected in both images
            if len(target_faces) > 0 and len(person_faces) > 0:
                # Extract face regions
                target_face = image[target_faces[0][1]:target_faces[0][1]+target_faces[0][3], target_faces[0][0]:target_faces[0][0]+target_faces[0][2]]
                person_face = person_image[person_faces[0][1]:person_faces[0][1]+person_faces[0][3], person_faces[0][0]:person_faces[0][0]+person_faces[0][2]]

                # Resize face regions to 100x100
                target_face = cv2.resize(target_face, (100, 100))
                person_face = cv2.resize(person_face, (100, 100))

                # Convert face regions to grayscale
                gray_target_face = cv2.cvtColor(target_face, cv2.COLOR_BGR2GRAY)
                gray_person_face = cv2.cvtColor(person_face, cv2.COLOR_BGR2GRAY)

                # Calculate the absolute difference between the two face regions
                diff = cv2.absdiff(gray_target_face, gray_person_face)

                # Calculate the mean of the absolute difference
                mean_diff = np.mean(diff)

                # Thresholding
                if mean_diff < 50:
                    results.append({'person': person, 'match': True})
                else:
                    results.append({'person': person, 'match': False})
            else:
                results.append({'person': person, 'match': False})

        matched_users = [result['person'] for result in results if result['match'] == True]

        # Get the full profiles of the matched users
        full_profiles = []
        for user in matched_users:
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
                        "user.username": user['username']
                    }
                },
                {
                    "$addFields": {
                        "user._id": {"$toString": "$user._id"},
                        "_id": {"$toString": "$_id"},
                        "createdAt": {"$dateToString": {"format": "%Y-%m-%dT%H:%M:%S", "date": "$createdAt"}},
                        "updatedAt": {"$dateToString": {"format": "%Y-%m-%dT%H:%M:%S", "date": "$updatedAt"}},
                        "dateOfBirth": {"$dateToString": {"format": "%Y-%m-%dT%H:%M:%S", "date": "$dateOfBirth"}}
                    }
                },
                {
                    "$addFields": {
                        "previousHospitals": {
                            "$map": {
                                "input": "$previousHospitals",
                                "as": "hospital",
                                "in": {
                                    "_id": {"$toString": "$$hospital._id"},
                                    "hospitalName": "$$hospital.hospitalName",
                                    "dateVisited": {"$dateToString": {"format": "%Y-%m-%dT%H:%M:%S", "date": "$$hospital.dateVisited"}}
                                }
                            }
                        },
                        "user": {
                            "_id": "$user._id",
                            "email": "$user.email",
                            "username": "$user.username"
                        }
                    }
                },
                {
                    "$project": {
                        "user.authentication": 0
                    }
                }
            ]
            profile = list(profiles_collection.aggregate(pipeline))
            if profile:
                full_profiles.append(profile[0])

        return jsonify(full_profiles)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)