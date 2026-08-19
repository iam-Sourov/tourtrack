import sys
import json
import requests
import datetime

# Force UTF-8 encoding for stdout (Fixes degree symbol  issues on Windows)
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')
LOCAL_KNOWLEDGE = {
    "sylhet": {
        "famous_spots": [
            "Ratargul Swamp Forest",
            "Jaflong",
            "Bholaganj Sada Pathor",
            "Bisnakandi",
            "Lalakhal",
            "Malnicherra Tea Estate",
            "Hazrat Shah Jalal Mazar"
        ],
        "local_tips": "Try the traditional beef curry cooked with local 'Shatkora' (a unique sour citrus fruit popular in Sylhet), and visit the tea gardens for fresh local tea. Taste the Seven-Color Tea at Nilkantha Tea Cabin.",
        "weather": {
            "winter": "Sylhet is cool, dry, and sunny. Extremely pleasant for visiting tea gardens, though water levels in Ratargul and Bisnakandi will be very low.",
            "summer": "Hot and humid, with high temperatures and frequent sudden thunderstorms (Nor'westers) bringing pre-monsoon rain.",
            "monsoon": "Heavy monsoon rains. Ratargul Swamp Forest is beautifully flooded and Jaflong/Bisnakandi streams are in full, spectacular force, but rain gear is mandatory.",
            "general": "Sub-tropical climate, heavily influenced by monsoons (June to October) and dry winters (November to February)."
        }
    },
    "sitakunda": {
        "famous_spots": [
            "Chandranath Temple / Chandranath Hill",
            "Guliyakhali Beach",
            "Khoiyachhora Waterfall",
            "Banshbaria Beach",
            "Sitakunda Botanical Garden and Eco Park",
            "Napittachora Waterfall"
        ],
        "local_tips": "Start the Chandranath Hill climb very early in the morning to beat the heat. Wear sturdy trekking shoes with good grip as the paths and waterfall rocks can be extremely slippery.",
        "weather": {
            "winter": "Cool, dry weather with refreshing sea breezes. Ideal for climbing Chandranath Hill and walking on beaches without excessive heat.",
            "summer": "Hot, humid, and sunny. Climbing Chandranath Hill can be physically exhausting due to high temperatures.",
            "monsoon": "Heavy rainfall. Multi-tiered waterfalls like Khoiyachhora are spectacular and in full volume, but hill trekking paths are muddy and extremely slippery.",
            "general": "Coastal tropical climate with strong monsoons (June to October) and pleasant winters (November to February)."
        }
    },
    "bandarban": {
        "famous_spots": [
            "Nilagiri",
            "Nafakhum Waterfall",
            "Buddha Dhatu Jadi / Golden Temple",
            "Chimbuk Hill & Nilachal",
            "Boga Lake"
        ],
        "local_tips": "Respect the local tribal culture and ask permission before taking photos of people. Sangu river boat rides are spectacular; wear a life jacket.",
        "weather": {
            "winter": "Cool mountain weather with misty mornings and clear sunny days. The best time for trekking, camping, and hiking.",
            "summer": "Warm days, but relatively cooler at night compared to the plains. Occasional pre-monsoon hill storms.",
            "monsoon": "Heavy rains. Waterfalls are at peak volume, but mountain roads can experience landslides and trekking paths become very muddy.",
            "general": "High altitude hilly climate with cool winters (November to February) and heavy monsoons (June to October)."
        }
    },
    "cox": {
        "famous_spots": [
            "Inani Beach",
            "Himchari National Park",
            "Kolatoli & Laboni Beach",
            "Dulahazara Safari Park",
            "Maheshkhali Island"
        ],
        "local_tips": "Try local dried fish (Shutki) and fresh seafood fry from beachside stalls. Always check the safety flags on the beach before swimming.",
        "weather": {
            "winter": "Warm, sunny, dry days and cool sea breezes. Perfect beach weather, very safe for swimming and beach activities.",
            "summer": "Hot and humid beach weather with strong sun. Good for beach resorts, but stay hydrated.",
            "monsoon": "Rough seas, high winds, and heavy downpours. Beach swimming is often restricted due to dangerous undercurrents.",
            "general": "Tropical beach climate with warm winters (November to February) and wet, stormy monsoons (June to October)."
        }
    },
    "sundarban": {
        "famous_spots": [
            "Karamjal Wildlife Centre",
            "Hiron Point (Nilkamal)",
            "Kotka Beach & Wildlife Sanctuary",
            "Kochikhali",
            "Harbaria Eco Tourism Center"
        ],
        "local_tips": "Travel only with registered tour operators. Always stay close to your tour guide and group, and follow their instructions. Hire armed forest guards for any walking treks inside the deep forest.",
        "weather": {
            "winter": "Cool, pleasant, and dry. The absolute best time for boat cruises, navigating channels, and spotting wildlife like tigers and deer.",
            "summer": "Hot and humid forest environment. Honey collectors enter the forest, and mosquito activity is high.",
            "monsoon": "Extremely wet and stormy. Rivers and channels swell, and heavy winds make boat navigation risky and restricted.",
            "general": "Tidal mangrove climate with mild winters (November to February) and heavy monsoon winds (June to September)."
        }
    },
    "sreemangal": {
        "famous_spots": [
            "Lawachara National Park",
            "Madhabpur Lake",
            "Baikka Beel Bird Sanctuary",
            "Hum Hum Waterfall",
            "Nilkantha Tea Cabin (Famous 7-Layer Tea)",
            "Nurjahan Tea Estate"
        ],
        "local_tips": "Try the famous 7-layer tea at Nilkantha Tea Cabin. When walking inside Lawachara National Park, maintain absolute silence to stand a chance of spotting rare Hoolock Gibbons and wildlife.",
        "weather": {
            "winter": "Chilly mornings, misty tea gardens, and pleasant sunny days. Best time to explore the national park and hike.",
            "summer": "Warm and humid. Regular afternoon rains keep the tea gardens green and fresh.",
            "monsoon": "Lush, vibrant green tea estate landscape with heavy rainfall. Great for photography, but watch out for leeches on forest trails.",
            "general": "Mild tea-country climate, slightly cooler than the rest of Bangladesh throughout the year."
        }
    },
    "srimangal": {
        "famous_spots": [
            "Lawachara National Park",
            "Madhabpur Lake",
            "Baikka Beel Bird Sanctuary",
            "Hum Hum Waterfall",
            "Nilkantha Tea Cabin (Famous 7-Layer Tea)",
            "Nurjahan Tea Estate"
        ],
        "local_tips": "Try the famous 7-layer tea at Nilkantha Tea Cabin. When walking inside Lawachara National Park, maintain absolute silence to stand a chance of spotting rare Hoolock Gibbons and wildlife.",
        "weather": {
            "winter": "Chilly mornings, misty tea gardens, and pleasant sunny days. Best time to explore the national park and hike.",
            "summer": "Warm and humid. Regular afternoon rains keep the tea gardens green and fresh.",
            "monsoon": "Lush, vibrant green tea estate landscape with heavy rainfall. Great for photography, but watch out for leeches on forest trails.",
            "general": "Mild tea-country climate, slightly cooler than the rest of Bangladesh throughout the year."
        }
    },
    "dhaka": {
        "famous_spots": [
            "Lalbagh Fort",
            "Ahsan Manzil (Pink Palace)",
            "Sadarghat River Port",
            "National Parliament Building (Jatiya Sangsad Bhaban)",
            "Curzon Hall",
            "Dhakeshwari Temple",
            "Shankhari Bazar (Old Dhaka)"
        ],
        "local_tips": "Indulge in authentic Old Dhaka Biryani (Haji or Nanna) and try traditional Bakarkhani. Use manual rickshaws to traverse the narrow, historically vibrant alleys of Old Dhaka.",
        "weather": {
            "winter": "Cool, dry, and very comfortable for outdoor walking tours of historical monuments.",
            "summer": "Very hot, dry, and dusty summer days. High traffic congestion makes transit warm, requiring air-conditioned transport.",
            "monsoon": "High humidity and heavy downpours, which can cause local waterlogging in city streets.",
            "general": "Hot and humid summers, with monsoon rain from June to September. Winters (December to January) are dry and comfortably mild."
        }
    },
    "sajek": {
        "famous_spots": [
            "Sajek Valley Peak Viewpoint",
            "Konglak Para (Highest peak in Sajek)",
            "Ruilui Para",
            "Sajek Helipads (Sunset points)",
            "Stone Garden"
        ],
        "local_tips": "Wake up early before sunrise to watch the sea of clouds fill up the valley from your cottage. Respect the local tribal communities and check security schedules, as army escorts are required for vehicles entering/leaving Sajek.",
        "weather": {
            "winter": "Chilly mountain weather, dense fog, and clear skies. High chances of seeing a thick sea of clouds over the hills.",
            "summer": "Comfortably warm during the day and pleasantly cool at night. Less cloudy, giving clear starlit night skies.",
            "monsoon": "Spectacular valleys covered in dense rolling clouds, but roads are slippery and rain is heavy.",
            "general": "Pleasant hilly mountain climate, significantly cooler than the plains year-round."
        }
    },
    "rangamati": {
        "famous_spots": [
            "Kaptai Lake",
            "Hanging Bridge (Jhoolonto Pool)",
            "Shuvolong Waterfall",
            "Rajban Vihara Buddhist Temple",
            "Kaptai National Park",
            "Peda Ting Ting Island"
        ],
        "local_tips": "Rent a local wooden boat to tour Kaptai Lake and cruise down to Shuvolong Waterfall. Try 'Bamboo Chicken' (chicken cooked inside bamboo tubes) at local tribal restaurants.",
        "weather": {
            "winter": "Pleasant, dry, and misty lake cruises. Clear blue skies over Kaptai Lake make boat rides highly comfortable.",
            "summer": "Warm and humid. Good for lakeside resort stays, but afternoon sun is strong.",
            "monsoon": "Kaptai Lake is filled to its maximum level, making boat cruises and waterfalls like Shuvolong spectacular and high-volume.",
            "general": "Hilly lake basin climate, hot in summer, wet in monsoon, and comfortably cool in winter."
        }
    },
    "kuakata": {
        "famous_spots": [
            "Kuakata Sandy Beach",
            "Gangamati Reserved Forest (Sunrise viewpoint)",
            "Misripara Buddhist Temple (Giant Buddha Statue)",
            "Jhau Bon (Tamarisk Forest)",
            "Fatrar Char (Mangrove Forest part of Sundarbans)"
        ],
        "local_tips": "Watch both the sunrise and sunset from the same beach! Rent a local motorcycle on the beach to ride to the Gangamati forest for sunrise. Try freshly fried sea crabs from beach stalls.",
        "weather": {
            "winter": "Sunny, mild coastal weather. Ideal for cycling on the beach and catching both sunrise and sunset clearly.",
            "summer": "Hot beach weather with strong sea winds and warm ocean water.",
            "monsoon": "Heavy rains and high sea waves, making the coastal beaches windy and wet. Sea tides are high.",
            "general": "Coastal maritime climate with mild winters (November to February) and wet monsoons (June to September)."
        }
    },
    "rajshahi": {
        "famous_spots": [
            "Hazrat Shah Makhdum Shrine",
            "Padma River Bank (T-Groin & Padma Garden)",
            "Varendra Research Museum",
            "Puthia Temple Complex (Terracotta temples)",
            "Bagha Mosque"
        ],
        "local_tips": "If visiting between May and July, try the famous local Rajshahi mangoes (Gopalbhog, Himsagar, Langra). Take a boat ride on the Padma river along the India-Bangladesh border at sunset.",
        "weather": {
            "winter": "Cold and dry. Comfortable for visiting terracotta temples in Puthia and walking by the Padma river bank.",
            "summer": "Extremely hot and dry (often crosses 40°C). Peak season for local Rajshahi mangoes.",
            "monsoon": "Humid with moderate rainfall. The Padma river swells to its maximum capacity, making boat rides scenic.",
            "general": "Dry Varendra climate with extreme temperatures (very hot summers and cold winter nights)."
        }
    },
    "barisal": {
        "famous_spots": [
            "Bhimruli Floating Guava Market",
            "Guthia Mosque (Baitul Aman)",
            "Durga Sagar Dighi",
            "Kuriana Floating Market",
            "Oxford Mission Church"
        ],
        "local_tips": "Visit during the monsoon (July to September) to witness the floating guava markets at their peak. Rent a traditional boat (trawler) to navigate the narrow fruit-growing canals.",
        "weather": {
            "winter": "Cool and pleasant river canal cruises. Dry weather makes rural and delta exploring comfortable.",
            "summer": "Warm and humid riverine weather with occasional storms.",
            "monsoon": "Heavy monsoon rains. Canals are full of water and the famous floating guava markets are at peak activity.",
            "general": "Lush, riverine, and highly humid climate. Heaviest rains fall during the monsoon, making water navigation beautiful but wet."
        }
    },
    "bagerhat": {
        "famous_spots": [
            "Sixty Dome Mosque (Shat Gombuj Masjid)",
            "Tomb of Khan Jahan Ali",
            "Nine Dome Mosque",
            "Singair Mosque",
            "Kodla Math (Ayodhya Shiv Temple)"
        ],
        "local_tips": "Sixty Dome Mosque is a UNESCO World Heritage site; hire an official local guide to learn about its unique 15th-century architecture and history. Avoid swimming in the Khan Jahan Ali pond due to resident crocodiles.",
        "weather": {
            "winter": "Cool and dry, comfortable for outdoor walking tours around the Sixty Dome Mosque.",
            "summer": "Hot and humid weather with strong sun.",
            "monsoon": "Humid with heavy rain, making outdoor walking tours wet.",
            "general": "Warm and humid throughout most of the year. Coolest and most comfortable for walking tours during winter (November to February)."
        }
    },
    "panchagarh": {
        "famous_spots": [
            "Banglabandha Zero Point (India-Bangladesh Border)",
            "Tetulia Flat-land Tea Gardens",
            "Kazi & Kazi Organic Tea Estate",
            "Views of Mt. Kanchenjunga (Himalayan peak visible in clear autumn skies)",
            "Mahananda River Bank"
        ],
        "local_tips": "Visit during late October or November for a rare chance to see the snow-capped peak of Mount Kanchenjunga in the distance on a clear morning. Enjoy local organic tea.",
        "weather": {
            "winter": "Very cold (temperatures drop near 5°C). Dense fog, but clear morning skies reveal Mt. Kanchenjunga.",
            "summer": "Mildly warm days and cool evenings. Comfortable and less humid.",
            "monsoon": "Heavy rains from the nearby Himalayas, creating rapid river flows in the Mahananda.",
            "general": "Panchagarh is the northernmost district and is the coldest place in Bangladesh during winter, with temperatures dropping near 5°C in December-January."
        }
    },
    "tetulia": {
        "famous_spots": [
            "Banglabandha Zero Point",
            "Tetulia Tea Gardens",
            "Views of Mt. Kanchenjunga",
            "Mahananda River Bank",
            "Tetulia Dak Bungalow"
        ],
        "local_tips": "Visit during late October or November for a rare chance to see the snow-capped peak of Mount Kanchenjunga in the distance on a clear morning. Enjoy local organic tea.",
        "weather": {
            "winter": "Very cold (temperatures drop near 5°C). Dense fog, but clear morning skies reveal Mt. Kanchenjunga.",
            "summer": "Mildly warm days and cool evenings. Comfortable and less humid.",
            "monsoon": "Heavy rains from the nearby Himalayas, creating rapid river flows in the Mahananda.",
            "general": "Panchagarh is the northernmost district and is the coldest place in Bangladesh during winter, with temperatures dropping near 5°C in December-January."
        }
    }
}

def get_season_from_time(free_time):
    time_str = free_time.lower()
    if any(k in time_str for k in ["jan", "feb", "nov", "dec", "winter", "cool", "cold", "chilly"]):
        return "winter"
    elif any(k in time_str for k in ["jun", "jul", "aug", "sep", "oct", "monsoon", "rain", "rainy", "wet"]):
        return "monsoon"
    elif any(k in time_str for k in ["mar", "apr", "may", "summer", "hot", "warm"]):
        return "summer"
    return "general"

def generate_itinerary(destination, vibes, free_time):
    # Set the specific model requested by user
    model_name = "qwen2.5:1.5b"
    
    # Check if Ollama is running and model exists (optional but good for debugging)
    try:
        models_resp = requests.get('http://127.0.0.1:11434/api/tags')
        if models_resp.status_code == 200:
            models = models_resp.json().get('models', [])
            # Verify if llama3:latest is available
            available_models = [m['name'] for m in models]
            if model_name not in available_models:
                # If specifically requested model isn't found, try to find any 'llama3' or fallback to first
                fallback = next((m for m in available_models if 'llama3' in m), None)
                if fallback:
                    model_name = fallback
                elif available_models:
                    model_name = available_models[0]
                else:
                    return json.dumps({"error": "No models found in Ollama. Please run 'ollama pull llama3:latest'"})
        else:
            return json.dumps({"error": "Could not connect to Ollama"})
    except requests.exceptions.ConnectionError:
        return json.dumps({"error": "Ollama service not running"})

    # Look up destination in local knowledge base to prevent hallucinations
    dest_key = destination.strip().lower()
    season = get_season_from_time(free_time)
    knowledge_context = ""
    for key, data in LOCAL_KNOWLEDGE.items():
        if key in dest_key or dest_key in key:
            weather_desc = data["weather"].get(season, data["weather"]["general"])
            knowledge_context = f"""
            CRITICAL FACTUAL DATA FOR {destination.upper()}:
            - Real, actual spots in {destination}: {', '.join(data['famous_spots'])}
            - Real Local Tips: {data['local_tips']}
            - Real Weather Info for {free_time.upper()} ({season.upper()} season): {weather_desc}
            
            Instructions to follow:
            1. ONLY plan activities at the real spots listed above. Do NOT make up any fictional spots (like Shahinipur Beach, Kamini Beach, Bishtar Lake, Shahinipur Market, Kamini Garden, etc.).
            2. Incorporate the real local tips and specific weather info provided above into the itinerary, local tip, and weather summary fields.
            """
            break

    # Prepare prompt
    final_prompt = f"""
    You are a professional travel expert.
    User wants a trip to: "{destination}"
    Vibe: "{vibes}"
    Time: "{free_time}"
    
    {knowledge_context}
    
    Task:
    1.  Act as a LOCAL GUIDE specifically for **{destination}**.
    2.  Check if {destination} is a known city/region. If it is in Bangladesh, DO NOT generalize to "Bangladesh". Focus ONLY on {destination}.
    3.  Analyze weather for {destination} in {free_time}.
    4.  Create a 3-day itinerary that contains REAL, SPECIFIC spots in {destination}.
        *   Example: If destination is "Bandarban", mention "Nilagiri", "Nafakhum", "Golden Temple". Do NOT mention "Cox's Bazar" or "Sylhet".
    5.  Local Tip: Must be specific to {destination}.
    
    IMPORTANT: The "destination" field in JSON must be exactly "{destination}".
    
    Output structured JSON ONLY:
    {{
        "destination": "{destination}",
        "weather_summary": "Specific weather for {destination} in {free_time}",
        "itinerary": [
            {{"day": 1, "plan": "Specific places in {destination} to visit in morning, afternoon, evening."}},
            {{"day": 2, "plan": "More specific spots in {destination}."}},
            {{"day": 3, "plan": "Hidden gems in {destination}."}}
        ],
        "packing_list": ["item1", "item2"],
        "local_tip": "Unique tip for {destination}",
        "vibe_match_score": 100
    }}
    """

    try:
        response = requests.post('http://127.0.0.1:11434/api/generate', json={
            "model": model_name,
            "prompt": final_prompt,
            "format": "json",
            "stream": False
        })
        
        if response.status_code == 200:
            result = response.json()
            return result['response'] # Returns the JSON string content generated by model
        else:
            return json.dumps({"error": f"Ollama API Error: {response.text}"})

    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    try:
        # Read args from stdin or command line
        if len(sys.argv) > 1:
            input_data = json.loads(sys.argv[1])
            destination = input_data.get('destination', 'Bangladesh')
            vibes = input_data.get('vibes', 'Relaxed')
            free_time = input_data.get('free_time', 'Anytime')
            
            result = generate_itinerary(destination, vibes, free_time)
            print(result)
        else:
            print(json.dumps({"error": "No input provided"}))
    except Exception as e:
        print(json.dumps({"error": f"Script Error: {str(e)}"}))
