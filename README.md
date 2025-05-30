@host=http://localhost:5000


###
POST {{host}}/compare
Content-Type: application/json

{
    "target_image_url": "https://static.wikia.nocookie.net/amazingspiderman/images/3/33/Tobey_Maguire_Infobox.png/revision/latest/scale-to-width-down/535?cb=20240322015635"
}


###
GET {{host}}/profiles