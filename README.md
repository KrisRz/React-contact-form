This project is for demonstration purposes only. For code access or questions, please contact me.

# Next.js Login Page with reCAPTCHA

A secure login page built with Next.js 15 and React 18, featuring reCAPTCHA integration and form validation.

## Features

- 🚀 Next.js 15.3.2 with App Router
- ⚛️ React 18.2.0
- 🔒 reCAPTCHA v2 integration
- ✅ Real-time form validation
- 🎨 Modern UI with CSS Modules
- ⚡ API route with rate limiting
- 🔄 Loading states and error handling
- 📱 Responsive design

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

4. Get your reCAPTCHA keys:
   - Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
   - Register a new site
   - Choose reCAPTCHA v2
   - Add your domain
   - Copy the site key and secret key to your `.env.local` file

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Future Implementations

The project is ready for:

1. Authentication Integration:
   - NextAuth.js
   - JWT
   - OAuth providers

2. Database Integration:
   - MongoDB
   - PostgreSQL
   - MySQL

3. Additional Features:
   - Password reset functionality
   - Remember me option
   - Two-factor authentication
   - User profile management

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

Feel free to submit issues and pull requests.

## License

MIT 
