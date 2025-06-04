from groq import Groq

from dotenv import load_dotenv
load_dotenv()

import os
groq_client = Groq(api_key= os.getenv('GROQ_API_KEY'))

