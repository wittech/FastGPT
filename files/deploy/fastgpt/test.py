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

client = openai.Client(api_key="not empty",
                       base_url="http://region-9.autodl.pro:20043/v1")
ret = client.chat.completions.create(
    model="qwen1.5-chat",
    messages=[{"role": "user", "content": "你是谁"}],
)
print(ret)
