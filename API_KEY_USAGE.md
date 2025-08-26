# How to Use Your API Key to Fetch Data from SEARS API

This guide demonstrates how to use your API key to fetch data from the SEARS API as a JSON response.

## 1. Get Your API Key
- Log in to your user dashboard.
- Copy your API key from the "Key Details" section.

## 2. Make an API Request
You can use tools like `curl`, Postman, or any programming language that supports HTTP requests.

### Example Using `curl`
```bash
curl -X POST \
  https://your-api-domain.com/api/search \
  -H "x-api-key: YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"temperature": "60"}'
```

- Replace `YOUR_API_KEY_HERE` with your actual API key.
- Replace `https://your-api-domain.com/api/search` with your actual API endpoint.
- The `-d` flag contains your search filter as JSON.

### Example Using Python (requests)
```python
import requests

url = "https://your-api-domain.com/api/search"
headers = {
    "x-api-key": "YOUR_API_KEY_HERE",
    "Content-Type": "application/json"
}
query = {"temperature": "60"}

response = requests.post(url, headers=headers, json=query)
print(response.json())
```

## 3. Response
The API will return a JSON response containing the matching data from the database.

## 4. Error Handling
- If your API key is invalid or expired, you will receive an authentication error.
- If your query is malformed, you will receive a validation error.

## 5. Additional Notes
- Keep your API key secure. Do not share it publicly.
- You can view your request history and manage your API key in the dashboard.

---
For more help, contact your administrator or refer to the dashboard info/help section.
