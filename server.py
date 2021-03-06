# compose_flask/app.py
import os
import numpy as np
from flask import Flask
from flask import request
from ast import literal_eval
from keras.models import load_model
from tqdm import tqdm
import tensorflow as tf
from flask import jsonify
global graph
graph = tf.get_default_graph()

embeddings_index = {}
model = load_model("./models/lstm/wiki")

# # Convert values to embeddings
def text_to_array(text):
	empyt_emb = np.zeros(300)
	text = text.split()

	embeds = [embeddings_index.get(word, empyt_emb) for word in text]
	embeds += [empyt_emb] * (30 - len(embeds))
	return np.array(embeds)

def read_embeddings():
	f = open('./embeddings/wiki/wiki.vec')
	i = 0
	for line in tqdm(f):

		if(line[-1] == '\n'):
			line = line[:-1]

		values = line.split(" ")
		word = values[0]
		coefs = np.asarray(values[1:301])
		# print(len(coefs))
		# embeddings_index[word] = coefs
		embeddings_index[word] = coefs.astype("float32")
		# print(embeddings_index[word])
		# if i == 100:
		# 	break
		# i = i + 1
	f.close()


app = Flask(__name__)

@app.route('/')
def hello():
	return 'It works!'

@app.route('/predict', methods = ['POST'])
def run_prediction():
	try:
		message = str(literal_eval(list(request.form.to_dict(flat=True).keys())[0])["text"])
		v = text_to_array(message)

		with graph.as_default():
			prediction = model.predict(np.array([text_to_array(message)])).flatten()[0]

		resp = jsonify({"prediction": format(float(prediction), '.3f')})
		resp.status_code = 200
	except:
		resp = jsonify({"error": "Something went wrong"})
		resp.status_code = 500

	resp.headers['Access-Control-Allow-Origin'] = '*'
	resp.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'

	return resp


if __name__ == "__main__":
	read_embeddings()
	app.run(host="0.0.0.0", debug=True, port=8000)