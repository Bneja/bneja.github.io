"""
Assignment #7: AJAX
"""

from flask import Flask, request
import json
app = Flask(__name__)


@app.route("/albums")
def albums():
    """Returns a list of albums (with album_id, author, and title) in JSON."""
    with open("data/albums.json") as album:
        return json.load(album)


@app.route("/albuminfo")
def albuminfo():
    album_id = request.args.get("album_id", None)
    if album_id:
        with open("data/tracks.json") as file:
            tracks=[]
            for track in json.load(file):
                if track["album_id"]==album_id:
                    tracks.append(track)
        with open("data/albums.json") as file:
            for album in json.load(file):
                if album_id==album["album_id"]:
                    cover=album["cover_img"]
            return json.dumps((tracks,cover.strip()))
    return ""


@app.route("/sample")
def sample():
    return app.send_static_file("index_static.html")


@app.route("/")
def index():
    return app.send_static_file("index.html")


if __name__ == "__main__":
    app.run(debug=True)
