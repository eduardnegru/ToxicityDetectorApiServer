FROM flask-demo-app
ADD . /usr/app
WORKDIR /usr/app
RUN pip3 install -r requirements.txt
EXPOSE 8000
CMD python server.py