# Start from ubuntu
FROM node:20.11.1-bookworm

# Update repos and install dependencies
RUN apt-get update \
  && apt-get -y upgrade \
  && apt-get -y install git build-essential libsqlite3-dev zlib1g-dev npm

# Create a directory and copy in all files
RUN mkdir -p /tmp/tippecanoe-src
RUN git clone https://github.com/mapbox/tippecanoe.git /tmp/tippecanoe-src
WORKDIR /tmp/tippecanoe-src

# Build tippecanoe
RUN make \
  && make install

# Copy scripts and extract pmtiles
COPY scripts /scripts
COPY pwa_config /pwa_config
RUN ls -al /scripts
COPY scripts /scripts
RUN cd /scripts && npm install
COPY pwa_config /pwa_config


# Remove the temp directory and unneeded packages
WORKDIR /
RUN rm -rf /tmp/tippecanoe-src \
  && apt-get -y remove --purge build-essential && apt-get -y autoremove

# Run the default command to show usage
CMD tippecanoe --help