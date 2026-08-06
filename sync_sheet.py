#!/usr/bin/env python3
import urllib.request
import ssl
import csv
import json
import time
import sys

URL = "https://docs.google.com/spreadsheets/d/15n6wstZajaR98ZzD5ZnV5tH6B8quAoCYTRD5CiH7h-M/export?format=csv&gid=0"

def sync_leads():
    try:
        req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"})
        ctx = ssl._create_unverified_context()
        response = urllib.request.urlopen(req, context=ctx)
        csv_text = response.read().decode("utf-8")

        lines = csv_text.splitlines()
        header_idx = -1
        for i, line in enumerate(lines):
            if "S No." in line:
                header_idx = i
                break

        parsed_leads = []
        if header_idx != -1:
            reader = csv.reader(lines[header_idx:])
            next(reader)
            for row in reader:
                if row and row[0].strip().isdigit():
                    status_raw = row[5].strip() if len(row) > 5 else "Unspecified"
                    status_clean = "Other"
                    if "Converted" in status_raw: status_clean = "Converted"
                    elif "Not intrested" in status_raw or "Not interested" in status_raw: status_clean = "Not Interested"
                    elif "Follow-up" in status_raw: status_clean = "Follow-up"
                    elif "Link Sent" in status_raw: status_clean = "Link Sent"
                    elif "Unanswered" in status_raw: status_clean = "Unanswered"

                    parsed_leads.append({
                        "id": row[0].strip(),
                        "date": row[1].strip() if len(row) > 1 else "",
                        "contact": row[2].strip() if len(row) > 2 else "",
                        "agent": row[4].strip() if len(row) > 4 and row[4].strip() else "Unassigned",
                        "status": status_clean,
                        "location": row[6].strip() if len(row) > 6 and row[6].strip() else "Riyadh",
                        "comments": row[11].strip() if len(row) > 11 else "",
                        "notes": row[12].strip() if len(row) > 12 else ""
                    })

        with open("leads_data.js", "w", encoding="utf-8") as f:
            f.write("const leadsData = " + json.dumps(parsed_leads, indent=2) + ";")

        print(f"[{time.strftime('%H:%M:%S')}] ✅ Synced {len(parsed_leads)} leads from Google Sheet to leads_data.js")
    except Exception as e:
        print(f"[{time.strftime('%H:%M:%S')}] ⚠️ Sync failed: {e}")

if __name__ == "__main__":
    if "--watch" in sys.argv:
        print("🔄 Live watcher active: Syncing Google Sheet every 10 seconds... (Press Ctrl+C to stop)")
        while True:
            sync_leads()
            time.sleep(10)
    else:
        sync_leads()
