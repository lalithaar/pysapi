# 🐍 pysapi (Python Static API)
![Work in progress badge](https://img.shields.io/badge/status-work_in_progress-blue)

**Build Python APIs. Host them like HTML files. Pay nothing.**

Ever wanted to test an API idea but couldn't justify paying for server hosting? Yeah, me too.

pysapi lets you write Python APIs that run entirely on static hosting (like GitHub Pages). No backend servers, no monthly costs, no complexity. Just your `.pyapi` file and a SQLite database.

---

## 🚧 Status: Work in Progress

This is an early-stage experiment. It works, but it's rough around the edges. Built out of frustration with hosting costs and the "just spin up a server" advice that assumes everyone has $5-20/month to spare for every side project idea.

- If this sounds like something you would be interested in, please star the repo :>
- If you have any ideas on how we can make this happen, reply in the discussion tab to discuss
- Intelligence belongs to all of us. If you think of a better way to spin this up, feel free to do so - I just ask you to take care of yourself in return, you don't have to attribute me.
- If you want to look up other ideas in my scratchbook, checkout my ideabank [scrapebook](https://github.com/lalithaar/ideabank) - list of ideas I thought of, free for anyone to use and implement from



---

## The Problem

You have 10 API ideas. Maybe 1 will actually matter. But to test any of them, you need:
- A server (costs money)
- Deployment setup (takes time)  
- Maintenance (costs sanity)

Meanwhile, static sites can be hosted **free forever** on GitHub Pages, Netlify, Vercel, etc.

**The question:** Why can't APIs be as simple as hosting an HTML file?

---

## The Solution

Write your API in a `.pyapi` file with Python. Deploy it to GitHub Pages. Done.

```python
# weather.pyapi

"""
@database: weather.db
@endpoint: /api/weather
"""

import sqlite3
from urllib.parse import parse_qs

def handler(request):
    params = parse_qs(request.query_string)
    city = params.get('city', [''])[0]
    
    conn = sqlite3.connect('weather.db')
    result = conn.execute(
        "SELECT * FROM weather WHERE city = ?", 
        (city,)
    ).fetchone()
    
    return {
        "city": city,
        "temp": result[1],
        "condition": result[2]
    }
```

**Deploy it:**
```bash
pyapi build weather.pyapi
git add .
git commit -m "weather api"
git push
pyapi deploy

✨ Live at: https://yourusername.github.io/weather-api
```

---

## How It Works

1. **You write** Python code with SQLite queries
2. **pysapi bundles** it with a Python runtime (Pyodide/WASM)
3. **You deploy** to any static host (GitHub Pages, Netlify, etc.)
4. **Users request** your API endpoint
5. **Python runs in the browser** (or edge worker) and returns JSON
6. **You pay** absolutely nothing

---

## What It's Good For

✅ **Perfect for:**
- Testing API ideas before committing to real infrastructure
- Personal data APIs (your reading list, project portfolio, etc.)
- Learning/tutorial projects
- Read-only public datasets (country codes, zip codes, reference data)
- Side projects that get 100 requests/month
- Prototypes that need to prove value before scaling

❌ **Not suitable for:**
- User authentication (everything is client-side)
- Real-time data updates
- Handling secrets/API keys
- High-frequency writes
- Production apps with serious traffic

---

## Getting Started

### Installation
```bash
pip install pysapi  # (coming soon)
```

### Create Your First API
```bash
# Create a new API
pyapi init my-api

# Define your routes in my-api.pyapi
# Add your SQLite database: my-data.db

# Build it
pyapi build my-api.pyapi

# Deploy to GitHub Pages
pyapi deploy --github-pages
```

---

## Example APIs

### 1. Random Quote API
```python
# quotes.pyapi
import sqlite3
import random

def handler(request):
    conn = sqlite3.connect('quotes.db')
    quotes = conn.execute("SELECT quote, author FROM quotes").fetchall()
    random_quote = random.choice(quotes)
    
    return {
        "quote": random_quote[0],
        "author": random_quote[1]
    }
```

### 2. Simple Data Lookup
```python
# pokemon.pyapi
import sqlite3
from urllib.parse import parse_qs

def handler(request):
    params = parse_qs(request.query_string)
    name = params.get('name', [''])[0]
    
    conn = sqlite3.connect('pokemon.db')
    result = conn.execute(
        "SELECT * FROM pokemon WHERE name = ?", 
        (name,)
    ).fetchone()
    
    return {"name": result[0], "type": result[1], "hp": result[2]}
```

---

## Limitations

Let's be honest about what this can't do:

- **No write operations:** You can't update the SQLite database from API calls (static hosting = read-only)
- **Initial load time:** First request loads the Python runtime (~10MB, but cached after)
- **Size limits:** GitHub Pages has 1GB repo limit (plenty for most use cases)
- **No secrets:** Everything is client-side, so no API keys or sensitive data
- **Performance:** WASM Python is slower than native (but fine for simple queries)

---

## Why Does This Exist?

I'm a student with limited resources and infinite ideas. I can't afford to pay $5-20/month for every project I want to test. Static hosting is free, Python is what I know, and SQLite is perfect for small datasets.

This scratches my own itch. If it helps you too, great. If not, that's okay—this isn't trying to replace real servers for real production apps.

---

## Philosophy

- **Free first:** Should work on free hosting tiers
- **Simple setup:** Minimal configuration, maximum clarity  
- **Honest limitations:** This isn't magic; it has trade-offs
- **Learning-friendly:** Good for experimentation, not just production

---

## Contributing

This is very early and very rough. If you want to help:
- Try building an API with it
- Report what breaks
- Share ideas for making it simpler
- Contribute code if you're feeling generous

No pressure, no expectations. Just building in public and seeing where it goes.

---

## Roadmap (Maybe)

- [ ] CLI tool (`pyapi init`, `pyapi build`, `pyapi deploy`)
- [ ] Better error handling
- [ ] Faster load times (optimize WASM bundle)
- [ ] Example gallery
- [ ] Edge worker support (Cloudflare Workers)
- [ ] Documentation site

---

## License

GPL v3 — Free to use, free to modify, must stay free.

---

## A Note

You don't need to justify your project ideas to anyone. If you want to build a weather API that nobody will use, go for it. If you want to test 20 concepts before finding one that sticks, that's valid.

Building should be fun, not expensive. Learning should be accessible, not gatekept by hosting costs.

This is my small attempt at making that easier. I hope it helps you, even just a little 🌱

---

**Made by someone who had too many ideas and not enough budget to test them all.**
