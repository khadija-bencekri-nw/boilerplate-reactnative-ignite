FROM node:18

# Set environment to production by default
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Default to port 8081 for React Native
ENV PORT 8081
EXPOSE 8081

# Install global npm packages (npm and expo-cli)
RUN npm install --unsafe-perm --allow-root -g npm@latest expo-cli@latest

# Set working directory and copy dependencies to avoid re-installing on each build
WORKDIR /opt/react_native_app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the entire app source code
COPY . .

# Start the application
CMD ["yarn", "start"]