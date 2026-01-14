properties = [
    {
        "id": "1",
        "title": "Villa For Rent in Kedungu",
        "description": "Quiet villa near Kedungu beach, 10 mins from Canggu",
        "propertyType": "villa",
        "status": ["For Rent"],
        "city": "Kedungu",
        "address": "Kedungu, Tabanan – Bali",
    },
    {
        "id": "2",
        "title": "Apartment in Canggu",
        "description": "Modern apartment close to shops",
        "propertyType": "apartment",
        "status": ["For Sale"],
        "city": "Canggu",
        "address": "Canggu, Bali",
    },
]


import re
from collections import defaultdict

def normalize(text):
    if not text:
        return set()
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    return set(text.split())


PROPERTY_TYPE_KEYWORDS = {
    "house": ["house", "home"],
    "apartment": ["apartment", "flat"],
    "villa": ["villa"],
    "commercial": ["commercial", "shop", "office"],
    "land": ["land", "plot"],
}

STATUS_KEYWORDS = {
    "For Sale": ["sale", "buy"],
    "For Rent": ["rent", "rental"],
}



def find_best_properties(user_input, properties, top_n=3):
    user_words = normalize(user_input)
    scores = []

    for prop in properties:
        score = 0

        # Normalize fields
        title_words = normalize(prop.get("title"))
        desc_words = normalize(prop.get("description"))
        city_words = normalize(prop.get("city"))
        address_words = normalize(prop.get("address"))

        # 1. Title & description relevance
        score += len(user_words & title_words) * 4
        score += len(user_words & desc_words) * 2

        # 2. Location match (city/address)
        score += len(user_words & city_words) * 5
        score += len(user_words & address_words) * 3

        # 3. Property type intent
        for ptype, keywords in PROPERTY_TYPE_KEYWORDS.items():
            if ptype == prop.get("propertyType"):
                if any(k in user_words for k in keywords):
                    score += 6

        # 4. Status intent
        for status, keywords in STATUS_KEYWORDS.items():
            if status in prop.get("status", []):
                if any(k in user_words for k in keywords):
                    score += 6

        if score > 0:
            scores.append((score, prop))

    scores.sort(key=lambda x: x[0], reverse=True)

    return [prop for _, prop in scores[:top_n]]



search = "villa for sale near kedungu beach"

results = find_best_properties(search, properties)

for r in results:
    print(r["id"], r["title"])
