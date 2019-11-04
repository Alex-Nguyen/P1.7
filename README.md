# Human Computer Interaction - Project 1
# Page
<https://alex-nguyen.github.io/P1.7/>

Video:
<http://youtube.com/embed/XpfwFVF3j5o>

# Sketch
https://alex-nguyen.github.io/P1.7/sketch-presentation/sketch.html

## Group members:
1. Vinh Nguyen (ID 79) - Team leader
2. Huyen Nguyen (ID 31)
3. Linh Ho Manh (ID 51)

## Interface design for bathroom mirror

Before log in:

![](https://alex-nguyen.github.io/P1.7/sketch-presentation/images/before.png)

After log in:

![](https://alex-nguyen.github.io/P1.7/sketch-presentation/images/p1.group7.png)


### Functions:
- Recognize face for logging in
- Sync calendar for upcoming events
- Display weather data
- Visualize health data
- Load social media feeds
- Personalize, customization for each user

## How to get personal data from Firebase

1. Include these libraries
```
   <script src="https://www.gstatic.com/firebasejs/7.2.1/firebase-app.js"></script>
   <script src="https://www.gstatic.com/firebasejs/7.2.1/firebase-database.js"></script>
   <script src="https://www.gstatic.com/firebasejs/7.2.1/firebase-analytics.js"></script>
```
2. Add this code for initialize Firebase
````
var firebaseConfig = {
            apiKey: "AIzaSyAa6_EenZKfzVFOqiWTB3qNFrQNqY6UlpE",
            authDomain: "healthkitforclass.firebaseapp.com",
            databaseURL: "https://healthkitforclass.firebaseio.com",
            projectId: "healthkitforclass",
            storageBucket: "healthkitforclass.appspot.com",
            messagingSenderId: "10115099027",
            appId: "1:10115099027:web:f32cb07dd50e089a92a066",
            measurementId: "G-Y1B923BPE2"
        };
        // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
````
3. Query data from Firebase database
````
let rootNode = firebase.database().ref()
let refNodes = rootNode.child("node-to-ref");
refNodes.once("value",function (data) {
   //Your coding for data here
}
````

# Work reports
### Vinh Nguyen 

1. Instruction to get and sync your data (from iPhone) to Firebase
````
Step 1: Clone or Download the HealthKitForClass folder
Step 2: Create an Apple Developer Account (https://developer.apple.com/programs/enroll/)
Step 3: Run the file HealthKitForClass.xcworkspace
Step 4: Select target device as (simulator or your phone)
Step 5: Run the application
Step 6: Grant access to HealthKit Data from your phone
Step 7: Syn your data to Firebase

````

### Huyen Nguyen

1. Sketch drawing
2. Widgets:
    
    - Health data visualization
    - Pop up menu 
    - Music player 
    - Autoplay video
3. Transparent design for all widgets 
4. Overall layout and widget position 
5. Project report

### Linh Manh

# Report for project 1
### Part C

Implementing the interface for the general information and health information 

- User log in
- Personalized calendar events for today
- Personalized Twitter feed
- Clock
- Local weather
- The mirror can be connected to Wifi and synched with smart phone for health data


### Part B

- Personalized health data, including:
    
    - Step counts (by number of step): By bar chart
    - Sleep data (by hours): By pie chart, for the recent days
    - Walking distance (by miles)
    
    
- User can customize the display for widget locations

- Music player with Spotify playlist: Play, pause, next, previous, pointing to a specific second

- Video with autoplay function: Play, pause

- Calendar highlight important event

- Screen brightness adjustment

- Pop up menu contains:
    
    - Time format (24h | 12h)
    - Region: The current country (e.g., U.S.)
    - Language: English, Spanish, ...
    
    
### Part A

Layout for the mirror:

![](https://i.imgur.com/gTutJHT.png)

Interactive features:

![](https://i.imgur.com/E5SED3w.png)

Video:
<http://youtube.com/embed/XpfwFVF3j5o>


