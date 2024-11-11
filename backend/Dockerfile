# Use Node.js as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json/yarn.lock
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port that the app will run on
EXPOSE 8082

# Run the application
CMD ["node", "dist/main.js"]
