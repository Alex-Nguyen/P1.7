# Human Computer Interaction - Project 1
# Page
https://alex-nguyen.github.io/HCIP1/.

# Sketch
https://alex-nguyen.github.io/HCIP1/sketch-presentation/sketch.html

## Group members:
1. Vinh Nguyen (ID 79) - Team leader
2. Huyen Nguyen (ID 31)
3. Linh Ho Manh (ID 51)

## Interface design for bathroom mirror

Before log in:

![](https://alex-nguyen.github.io/HCIP1/sketch-presentation/images/before.png)

After log in:

![](https://alex-nguyen.github.io/HCIP1/sketch-presentation/images/p1.group7.png)


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

## Work reports
### Vinh Nguyen 

````
````

### Huyen Nguyen

### Linh Manh