# Form Builder – Backend

A full-stack Form Builder application backend built using **Node.js, Express.js, and MongoDB**. It provides REST APIs for authentication, form creation, form management, and form submissions.

## 🚀 Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt
- Zod Validation
- Helmet
- CORS
- Morgan
- Express Rate Limit

## 📁 Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── formRoutes.js
│   │   └── submissionRoutes.js
│   ├── scripts/
│   │   └── seed.js
│   ├── validators/
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
└── package.json
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_BACKEND_REPOSITORY_URL
```

### 2. Navigate to backend

```bash
cd backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the backend root directory.

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```


### 5. Start the server

```bash
npm run dev
```

Or, if your project does not have a development script

```bash
node src/server.js
```
run script/seed.js file first to enter first entry 

## 🔐 API Endpoints
     Description         Methods         Link
To check Api connection :     Get        http://localhost:5000/api/health

login                   :     Post       http://localhost :5000/api/auth/login

get all forms           :     Get        1. http://localhost:5000/api/forms
	                                 2.http://localhost:5000/api/forms?page=1&limit=10

get form by id          :     Get         http://localhost:5000/api/forms/{formID}

post form details       :     Post        http://localhost:5000/api/forms/{formID}

update form data        :     Put         http://localhost:5000/api/forms/{formID}

delete form data        :     Delete      http://localhost:5000/api/forms/{formID}

submit form             :     Post        http://localhost:5000/api/forms/{formID}/submissions

Get Submitted data      :     GET         http://localhost:5000/api/forms/{formID}/submissions?page=1&limit=10


need to send JWT toke as a Bearer token for all url except login




## 🛡️ Security Features

- JWT-based authentication
- Password hashing using bcrypt
- Request validation using Zod
- Helmet security headers
- CORS configuration
- API rate limiting
- Request sanitization
- Centralized error handling

## 🩺 Health Check

```http
GET /api/health
```

Expected response:

```json
{
  "success": true,
  "status": "ok"
}
```

## 👩‍💻 Author

**Deebalakshmi Mathan**

Full Stack / React Developer
