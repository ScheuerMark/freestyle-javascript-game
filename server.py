from flask import Flask, render_template, request, redirect, url_for, session, escape
import os, data_manager

UPLOAD_FOLDER = './static'

app = Flask(__name__)


@app.route("/", methods=['GET', 'POST'])
def main():
    scores = data_manager.list_scores()
    print(scores)
    if request.method == 'POST':
        request_form_new_score = dict(request.form)
        data_manager.add_user(request_form_new_score)
        return render_template("index.html", scores=scores)
    else:
        return render_template("index.html", scores=scores)



if __name__ == "__main__":
    app.run(
        host='0.0.0.0',
        port=8010,
        debug=True,
    )
