FROM ubuntu:18.04

# Install basic Ubuntu software
RUN \
	apt-get update && \
	apt-get upgrade -y && \
	apt-get install -y curl software-properties-common  

# DynamoDB is written in Java, so we need the JRE if we're to run it locally.
RUN \
	apt-get install -y default-jre 

# Install nodejs 10.x (LTS)
RUN \
	curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
	apt-get install -y nodejs && \
	node -v 

# Install serverless
#
# There are error when installing serverless directly in docker.
# See: https://github.com/serverless/serverless/issues/4319
RUN \
	npm install -g try-thread-sleep && \
	npm install -g serverless --ignore-scripts spawn-sync && \
	ls -lR /root

RUN \
	echo .-----------------------------------------------------. && \
	echo '   Node.js Version:' $(node -v) && \
	echo '   Serverless Version:' $(serverless --version) && \
	echo \'-----------------------------------------------------\'

WORKDIR /app
		#sls dynamodb start && \
		#sls dynamodb migrate && \
		#sls dynamodb && \
		#sls dynamodb stop && \

CMD \
	bash -c "npm install && export SLS_DEBUG=* && \
		sls dynamodb install && \
		java --version && \
		sls dynamodb start --dbPath /tmp/ && \
		sls dynamodb migrate && \
		pkill java && \
		sls offline start"
