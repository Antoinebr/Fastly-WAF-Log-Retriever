# Use the official Node.js Alpine image as the base image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install dependencies.  Use --production to only install production dependencies (more lightweight)
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Create the logs directory if it doesn't exist
RUN mkdir -p logs

# Define the command to run the application
# This will run the script in cron mode by default,
#  and you can pass arguments to control the cron schedule.
CMD ["node", "main.js", "--cron", "6 * * * *"]  # Example: Run every hour at minute 6