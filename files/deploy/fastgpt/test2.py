import openai

tools = [
    {
        "type": "function",
        "function": {
            "name": "uber_ride",
            "description": "Find suitable ride for customers given the location, "
            "type of ride, and the amount of time the customer is "
            "willing to wait as parameters",
            "parameters": {
                "type": "object",
                "properties": {
                    "loc": {
                        "type": "int",
                        "description": "Location of the starting place of the Uber ride",
                    },
                    "type": {
                        "type": "string",
                        "enum": ["plus", "comfort", "black"],
                        "description": "Types of Uber ride user is ordering",
                    },
                    "time": {
                        "type": "int",
                        "description": "The amount of time in minutes the customer is willing to wait",
                    },
                },
            },
        },
    }
]

# 必须是走自定义渠道
client = openai.Client(api_key="sk-yBYkFQvGfCYOJALY9e43BaB9Ba94427681067917Ce5f0eCd",
                       base_url="http://127.0.0.1:3000/v1")
ret = client.chat.completions.create(
    model="qwen1.5-chat",
    messages=[{"role": "user", "content": "你是谁"}],
)
print(ret)
