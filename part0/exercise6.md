# Exercise 0.6: New note in single page app diagram

```mermaid
sequenceDiagram
    participant browser
    participant server
    
    Note right of browser: User writes a note and clicks Save then the JavaScript code prevents default form submission
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of browser: Request is sent as JSON (Content-Type: application/json)
    Note left of server: Server receives the JSON data: "content": "note text", "date": "(generated in browser)"}
    server-->>browser: HTTP 201 Created {"content": "note text", "date": "(generated in browser)"}
    deactivate server
    
    Note right of browser: The browser updates the notes list immediately without reloading the page (client-side rendering)
    
    Note over browser,server: No additional GET requests for HTML/CSS/JS because the SPA architecture keeps the page loaded
```
