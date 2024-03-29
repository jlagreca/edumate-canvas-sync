FROM nodesource/jessie:4.2.0
MAINTAINER Tim Douglas <neurotech@gmail.com>

# Set timezone
RUN echo "Australia/Sydney" > /etc/timezone
ENV TZ="Australia/Sydney"

# Update and install libxml2 for node-ibm_db
RUN apt-get update && apt-get install -y libxml2

COPY package.json package.json
RUN npm install

COPY . .

# Cleanup
RUN rm -rf /var/lib/apt/lists/* /tmp/* /root/.npm /root/.node-gyp

# Run the application
CMD [ "node", "app.js" ]