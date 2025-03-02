# Use minimal Alpine Linux base image
FROM alpine:latest

# Set working directory
WORKDIR /usr/src/app

# Install necessary dependencies
RUN apk add --no-cache curl bash libstdc++ nodejs npm

# Copy package files before installing dependencies (cache optimization)
COPY package.json package-lock.json .npmrc ./

# Install dependencies using npm
RUN npm install --production

# Copy the entire project
COPY . .

# Install Heroui CLI globally
RUN npm install -g heroui-cli

# Expose port 3000
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "dev"]