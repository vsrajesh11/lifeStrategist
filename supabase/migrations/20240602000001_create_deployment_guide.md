# Deployment Guide for GoalTracker App

## Option 1: Deploy to a Custom Domain with Vercel

1. **Create a Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)

2. **Connect Your Repository**
   - Push your code to GitHub, GitLab, or Bitbucket
   - Connect your repository to Vercel

3. **Configure Environment Variables**
   - Add the following environment variables in Vercel:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
   - Vercel will automatically build and deploy your app
   - You can use a custom domain in the Vercel dashboard

## Option 2: Deploy to Netlify

1. **Create a Netlify Account**
   - Sign up at [netlify.com](https://netlify.com)

2. **Connect Your Repository**
   - Push your code to GitHub, GitLab, or Bitbucket
   - Connect your repository to Netlify

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Configure Environment Variables**
   - Add the same environment variables as mentioned above

5. **Deploy**
   - Netlify will build and deploy your app
   - You can configure a custom domain in the Netlify dashboard

## Option 3: Self-Hosting

1. **Build the App**
   ```bash
   npm run build
   ```

2. **Serve the Static Files**
   - Use Nginx, Apache, or any static file server
   - Example Nginx configuration:

   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     root /path/to/your/dist;
     index index.html;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

3. **Configure SSL**
   - Use Let's Encrypt for free SSL certificates

## Important Notes

1. **Update Supabase Configuration**
   - In your Supabase dashboard, add your domain to the allowed domains for authentication

2. **CORS Configuration**
   - Ensure your domain is added to the CORS allowed origins in Supabase

3. **Environment Variables**
   - Make sure all required environment variables are set in your deployment environment

4. **Continuous Deployment**
   - Set up CI/CD pipelines for automatic deployment on code changes

5. **Monitoring**
   - Consider adding monitoring tools like Sentry for error tracking
