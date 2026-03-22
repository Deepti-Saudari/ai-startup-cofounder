from groq import Groq
from dotenv import load_dotenv
import os
import json
import re

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_operations_plan(startup_idea, industry):

    prompt = f"""
You are a startup operations consultant.

Create an operations strategy for the startup below.

Startup Idea: {startup_idea}
Industry: {industry}

Return ONLY JSON in this format:

{{
 "operations_structure": {{
   "teams": [],
   "tools": [],
   "processes": []
 }},
 "infrastructure": {{
   "cloud": "",
   "devops": "",
   "security": ""
 }},
 "kpis": []
}}

Rules:
- teams = operational teams needed
- tools = software tools needed
- processes = operational workflows
- kpis = metrics to track operations

Only JSON.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    text = response.choices[0].message.content.strip()

    text = re.sub(r"```json|```", "", text).strip()

    try:
        return json.loads(text)
    except Exception as e:
        return {"error": str(e), "raw": text}