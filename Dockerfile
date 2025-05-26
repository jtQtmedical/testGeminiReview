# Use the official Node.js image.
FROM node:18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN apt-get update && \
    apt-get install -y default-mysql-client netcat-openbsd && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN npm install

# Copy local code to the container image.
COPY . .

# Run the web service on container startup.
EXPOSE 3000
CMD ["node", "app.js"]