from flask import Flask, request, jsonify, render_template, redirect, url_for, session
import pandas as pd
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Needed for session management

# File paths for storing data
ORDERS_FILE = 'orders.csv'
USERS_FILE = 'users.csv'
MEDICINES_FILE = 'medicines.csv'

# Load data from CSV files if they exist and are not empty, otherwise create empty DataFrames
def load_csv(file_path, columns):
    if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
        return pd.read_csv(file_path)
    else:
        return pd.DataFrame(columns=columns)

orders_df = load_csv(ORDERS_FILE, ["id", "patient", "bed", "phone", "doctor", "medicine", "status", "emergency", "date", "time"])
users_df = load_csv(USERS_FILE, ["username", "email", "password", "role"])
medicines_df = load_csv(MEDICINES_FILE, ["name", "quantity", "description"])

@app.route('/')
def home():
    return render_template('index.html', title="Home", page_name="Hospital Management System")

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    role = request.form['role']
    
    user = users_df[(users_df['username'] == username) & (users_df['password'] == password) & (users_df['role'] == role)]
    if not user.empty:
        session['username'] = username
        session['role'] = role
        if role == 'nurse':
            return redirect(url_for('nurse_panel'))
        elif role == 'pharmacy':
            return redirect(url_for('pharmacy_panel'))
    return "Invalid credentials", 401

@app.route('/register', methods=['GET', 'POST'])
def register():
    global users_df  # Declare global at the beginning of the function
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        role = request.form['role']
        
        if not users_df[(users_df['username'] == username) | (users_df['email'] == email)].empty:
            return "User already exists", 400
        
        new_user = pd.DataFrame([[username, email, password, role]], columns=["username", "email", "password", "role"])
        users_df = pd.concat([users_df, new_user], ignore_index=True)
        users_df.to_csv(USERS_FILE, index=False)  # Save to CSV
        return redirect(url_for('home'))
    return render_template('register.html', title="Register", page_name="Register")

@app.route('/nurse')
def nurse_panel():
    if 'username' in session and session['role'] == 'nurse':
        return render_template('nurses.html', title="Nurse Panel", page_name="Nurse Panel")
    return redirect(url_for('home'))

@app.route('/pharmacy')
def pharmacy_panel():
    if 'username' in session and session['role'] == 'pharmacy':
        return render_template('pharmacy.html', title="Pharmacy Panel", page_name="Pharmacy Panel")
    return redirect(url_for('home'))

@app.route('/orders', methods=['GET', 'POST', 'PUT'])
def orders():
    global orders_df  # Declare global at the beginning of the function
    if request.method == 'POST':
        data = request.json
        new_order = pd.DataFrame([data])
        orders_df = pd.concat([orders_df, new_order], ignore_index=True)
        orders_df.to_csv(ORDERS_FILE, index=False)  # Save to CSV
        return jsonify({"message": "Order added successfully!"}), 201
    elif request.method == 'PUT':
        data = request.json
        order_id = data['id']
        orders_df.loc[orders_df['id'] == order_id, 'status'] = data['status']
        orders_df.to_csv(ORDERS_FILE, index=False)  # Save to CSV
        return jsonify({"message": "Order updated successfully!"}), 200
    elif request.method == 'GET':
        return orders_df.to_json(orient='records')

@app.route('/orders/<patient>', methods=['GET'])
def get_order_by_patient(patient):
    order = orders_df[orders_df['patient'] == patient]
    if not order.empty:
        return order.to_json(orient='records')
    return jsonify({"message": "Order not found"}), 404

@app.route('/medicines', methods=['GET', 'POST', 'PUT', 'DELETE'])
def medicines():
    global medicines_df  # Declare global at the beginning of the function
    if request.method == 'POST':
        data = request.json
        new_medicine = pd.DataFrame([data])
        medicines_df = pd.concat([medicines_df, new_medicine], ignore_index=True)
        medicines_df.to_csv(MEDICINES_FILE, index=False)  # Save to CSV
        return jsonify({"message": "Medicine added successfully!"}), 201
    elif request.method == 'PUT':
        data = request.json
        medicine_name = data['name']
        medicines_df.loc[medicines_df['name'] == medicine_name, 'quantity'] = data['quantity']
        medicines_df.to_csv(MEDICINES_FILE, index=False)  # Save to CSV
        return jsonify({"message": "Medicine updated successfully!"}), 200
    elif request.method == 'DELETE':
        data = request.json
        medicine_name = data.get('name')
        if not medicine_name:
            return jsonify({"message": "No medicine name provided"}), 400
        medicines_df = medicines_df[medicines_df['name'] != medicine_name]
        medicines_df.to_csv(MEDICINES_FILE, index=False)
        return jsonify({"message": f"Medicine {medicine_name} deleted successfully!"}), 200
    elif request.method == 'GET':
        query = request.args.get('query', '')
        if query:
            filtered_medicines = medicines_df[medicines_df['name'].str.contains(query, case=False, na=False)]
            return filtered_medicines.to_json(orient='records')
        return medicines_df.to_json(orient='records')

@app.route('/medicines_csv', methods=['GET'])
def get_medicines_csv():
    medicines = []
    with open(MEDICINES_FILE, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            medicines.append(row['name'])  # Assuming the CSV has a column named 'name'
    return jsonify(medicines)

@app.route('/about')
def about():
    return render_template('about.html', title="About Us", page_name="About Us")

if __name__ == '__main__':
    app.run(debug=True)
