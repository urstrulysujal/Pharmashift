import socket

def get_wifi_ip():
    try:
        # Create a socket to connect to an external server
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            # The server's IP and port don't matter as long as it's reachable
            s.connect(("8.8.8.8", 80))  # Google DNS
            ip_address = s.getsockname()[0]  # Get the IP address of the Wi-Fi interface
        return ip_address
    except Exception as e:
        return f"Error: {e}"

# Print the current Wi-Fi IP address
wifi_ip = get_wifi_ip()
print(f"Your current Wi-Fi IP address is: {wifi_ip}")



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - Overhead Medicine Transportation System</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='styles.css') }}">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
        }
        .container {
            max-width: 90%;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        h1, h2 {
            color: #0056b3;
        }
        h1 {
            text-align: center;
        }
        .team-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }
        .team-member {
            position: relative;
            width: 220px; /* Existing size */
            height: 300px; /* Existing height */
            margin: 15px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #74d3e28d;
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Added box shadow */
        }
        .team-member:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Enhanced shadow on hover */
        }
        .team-member img {
            width: 150px; /* Increased size for circular images */
            height: 150px; /* Increased size for circular images */
            border-radius: 50%; /* Circular images */
            margin-bottom: 10px;
            filter: drop-shadow(2px 2px 5px black);
        }
        .team-member .details {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
        }
        .team-member:hover .details {
            display: block;
        }
        .special-thanks {
            margin-top: 30px;
            font-style: italic;
            background-color: #e9f5ff;
            padding: 10px;
            border-left: 4px solid #0056b3;
            border-radius: 4px;
        }
        
    </style>
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="navbar-left">
                <img src="{{ url_for('static', filename='logo.png') }}" alt="Logo" class="logo">
                <span class="branding">Hospital Management System</span>
            </div>
            <div class="navbar-right">
                <a href="{{ url_for('about') }}">About Us</a>
                <a href="#profile">Profile</a>
                <a href="{{ url_for('home') }}">Logout</a>
            </div>
        </nav>
    </header>
    <div class="container">
        <h1>About Us</h1>
        <p>
            Welcome to the <strong>Overhead Medicine Transportation System</strong> project!
        </p>
        <p>
            Our team is dedicated to revolutionizing the way medicines are transported within hospitals. 
            By leveraging cutting-edge technology, we aim to streamline and prioritize medical supply delivery, 
            ensuring faster and more efficient patient care.
        </p>
        
        <h2>Meet Our Team</h2>
        <div class="team-container">
            <div class="team-member">
                <img src="{{ url_for('static', filename='prashant.png') }}" alt="Prashant Sir">
                <h3>Prashant Sir</h3>
                <p>Project Guide</p>
                <div class="details">
                    <p>We would like to express our heartfelt gratitude to Prashant Sir for his invaluable guidance, support, and mentorship throughout this journey. His expertise and insights have inspired us to achieve our goals and deliver a system that truly makes a difference.</p>
                </div>
            </div>
            <div class="team-member">
                <img src="{{ url_for('static', filename='developer1.jpg') }}" alt="Abubaker Osman">
                <h3>Abubaker Osman</h3>
                <p>Project Lead</p>
                <div class="details">
                    <p>The visionary behind our project, Abubaker spearheaded the initiative and ensured seamless coordination among the team members. His leadership and innovative ideas have been instrumental in the project's success.</p>
                </div>
            </div>
            <div class="team-member">
                <img src="{{ url_for('static', filename='developer2.jpg') }}" alt="Zeeshan Malik">
                <h3>Zeeshan Malik</h3>
                <p>Software Developer</p>
                <div class="details">
                    <p>Zeeshan has played a pivotal role in designing and developing the software interface and ensuring a user-friendly experience. His expertise in front-end and back-end technologies brought our platform to life.</p>
                </div>
            </div>
            <div class="team-member">
                <img src="{{ url_for('static', filename='developer3.jpg') }}" alt="Varun MG">
                <h3>Varun MG</h3>
                <p>Software Developer</p>
                <div class="details">
                    <p>Varun contributed significantly to the development of the system's backend functionality, ensuring robust and efficient data management. His dedication and problem-solving skills have been key to overcoming technical challenges.</p>
                </div>
            </div>
            <div class="team-member">
                <img src="{{ url_for('static', filename='developer4.jpg') }}" alt="Sujal Tirumalle">
                <h3>Sujal ST</h3>
                <p>Software Developer</p>
                <div class="details">
                    <p>Sujal focused on optimizing the system's performance and ensuring smooth integration of the software components. His attention to detail and commitment to quality have enhanced the project's overall reliability.</p>
                </div>
            </div>
        </div>
        
        <div class="special-thanks">
            <p>
                Thank you for exploring our <strong>Overhead Medicine Transportation System</strong>. 
                We hope it sets a new standard in hospital efficiency and patient care.
            </p>
        </div>
    </div>
</body>
</html>
