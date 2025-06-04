from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from .utils.get_images import get_images
import cv2
import numpy as np
import requests
from .utils.get_images import profiles_collection
from .utils.medical_question import get_medical_response
from rest_framework.parsers import MultiPartParser, FormParser
from bson import json_util
import json

# Create your views here.

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def compare_images(request):
    try:
        print("Files:", request.FILES)
        print("Data:", request.data)
        
        if 'image' not in request.FILES:
            return Response({'error': 'Image file is required'}, status=400)
        
        image_file = request.FILES['image']
        people = get_images()
        
        # Read image file
        image_bytes = image_file.read()
        if not image_bytes:
            return Response({'error': 'Empty image file'}, status=400)
            
        image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
        if image is None:
            return Response({'error': 'Invalid image format'}, status=400)

        results = []

        # Iterate over each person
        for person in people:
            try:
                # Download the person's image
                response = requests.get(person['image'])
                if response.status_code != 200:
                    results.append({'person': person, 'match': False})
                    continue
                    
                person_image = cv2.imdecode(np.frombuffer(response.content, np.uint8), cv2.IMREAD_COLOR)
                if person_image is None:
                    results.append({'person': person, 'match': False})
                    continue

                # Convert images to grayscale
                gray_target = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
                gray_person = cv2.cvtColor(person_image, cv2.COLOR_BGR2GRAY)

                # Detect faces
                face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
                target_faces = face_cascade.detectMultiScale(gray_target, scaleFactor=1.1, minNeighbors=5)
                person_faces = face_cascade.detectMultiScale(gray_person, scaleFactor=1.1, minNeighbors=5)

                if len(target_faces) > 0 and len(person_faces) > 0:
                    # Extract and compare face regions
                    target_face = image[target_faces[0][1]:target_faces[0][1]+target_faces[0][3], 
                                 target_faces[0][0]:target_faces[0][0]+target_faces[0][2]]
                    person_face = person_image[person_faces[0][1]:person_faces[0][1]+person_faces[0][3], 
                                   person_faces[0][0]:person_faces[0][0]+person_faces[0][2]]

                    target_face = cv2.resize(target_face, (100, 100))
                    person_face = cv2.resize(person_face, (100, 100))

                    gray_target_face = cv2.cvtColor(target_face, cv2.COLOR_BGR2GRAY)
                    gray_person_face = cv2.cvtColor(person_face, cv2.COLOR_BGR2GRAY)

                    diff = cv2.absdiff(gray_target_face, gray_person_face)
                    mean_diff = np.mean(diff)

                    results.append({
                        'person': person, 
                        'match': mean_diff < 50  # Your threshold
                    })
                else:
                    results.append({'person': person, 'match': False})
                    
            except Exception as e:
                print(f"Error processing {person['username']}: {str(e)}")
                results.append({'person': person, 'match': False})

        # Get full profiles of matched users
        matched_users = [result['person'] for result in results if result['match']]
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
                {"$unwind": "$user"},
                {"$match": {"user.username": user['username']}},
                {
                    "$addFields": {
                        "user._id": {"$toString": "$user._id"},
                        "_id": {"$toString": "$_id"},
                        "createdAt": {"$dateToString": {"format": "%Y-%m-%dT%H:%M:%SZ", "date": "$createdAt"}},
                        "updatedAt": {"$dateToString": {"format": "%Y-%m-%dT%H:%M:%SZ", "date": "$updatedAt"}},
                        "dateOfBirth": {"$dateToString": {"format": "%Y-%m-%dT%H:%M:%SZ", "date": "$dateOfBirth"}}
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
                                    "dateVisited": {"$dateToString": {"format": "%Y-%m-%dT%H:%M:%SZ", "date": "$$hospital.dateVisited"}}
                                }
                            }
                        }
                    }
                },
                {"$project": {"user.authentication": 0}}
            ]
            
            profile = list(profiles_collection.aggregate(pipeline))
            if profile:
                # Convert MongoDB document to JSON-serializable format
                serialized = json.loads(json_util.dumps(profile[0]))
                full_profiles.append(serialized)

        return Response(full_profiles)
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    

@api_view(['POST'])
def medical_chat(request):
    try:
        # Get the user message from the request
        # data = request.get_json()
        user_message = request.data.get('message')
        
        if not user_message:
            return Response({"error": "Message is required"}, status=400)

        response = get_medical_response(user_message)

        return Response({"response": response})
    except Exception as e:
        return Response({'error': str(e)}, status=500)