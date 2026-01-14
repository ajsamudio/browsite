# How to Add Calendly to Your Website

## 1. Set Your Availability (Time & Schedule)
You cannot set your availability directly in the HTML code. You must do this on the Calendly website.
1. Log in to [Calendly.com](https://calendly.com).
2. Click on **Availability** in the menu.
3. Set your "Working Hours" (e.g., 9:00 AM - 5:00 PM).
4. You can also create specific "Schedules" for different event types (e.g., 30 min lash fill vs 1 hour full set).

## 2. Get the Embed Code
To put the calendar on your site so clients can book:
1. Go to your **Calendly Home** page.
2. Find the Event Type you want to share (e.g., "30 Minute Meeting" or "Lash Appointment").
3. Click the **Share** button on that event card.
4. Click the **Add to Website** tab.
5. Choose one of the three options:
   - **Inline Embed**: Shows the calendar directly on the page (Good for a "Booking" section).
   - **Popup Widget**: A floating button in the corner that opens the calendar.
   - **Popup Text**: A link that opens the calendar when clicked.
6. Click **Continue**, then **Copy Code**.

## 3. Add to Your Website
Once you have the code, you can paste it into your `index.html`.
- If you chose **Inline Embed**, paste it where you want the calendar to appear (e.g., inside a `<div class="booking-section">`).
- If you chose **Popup Widget**, paste it at the very bottom of your `<body>` tag.

## Example of what the code looks like:
```html
<!-- Calendly inline widget begin -->
<div class="calendly-inline-widget" data-url="https://calendly.com/YOUR_USERNAME/YOUR_EVENT" style="min-width:320px;height:630px;"></div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
<!-- Calendly inline widget end -->
```
