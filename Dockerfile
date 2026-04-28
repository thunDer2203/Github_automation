# Use the official, lightweight Nginx alpine image
FROM nginx:alpine

# Copy custom Nginx configuration to listen on port 8080 (Cloud Run default)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all static web files into the Nginx html directory
COPY . /usr/share/nginx/html/

# Expose port 8080
EXPOSE 8080

# Start Nginx and keep it running in the foreground
CMD ["nginx", "-g", "daemon off;"]
