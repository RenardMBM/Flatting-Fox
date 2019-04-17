from flask import Flask, request, render_template, session, redirect
from json import dumps, loads
from json.decoder import JSONDecodeError
from random import choice
from string import ascii_lowercase, ascii_uppercase, digits
from database.db import *
from sqlite3 import IntegrityError

app = Flask(__name__, template_folder='../frontend', static_folder='../frontend')
app.config['SECRET_KEY'] = ''.join(choice(
    ascii_uppercase + ascii_lowercase + digits
) for _ in range(33))


@app.route("/")
def index():
    return render_template('html/intro.html', title="Flattering Fox")


@app.route("/register")
def sign_up():
    return render_template("html/signUp.html", title="Registration")


@app.route("/Register", methods=["POST"])
def register():
    if request.method == 'POST':
        try:
            print(request.data)
            data = loads(request.data)
        except JSONDecodeError:
            return dumps('Oops')

        indexes = ('login', 'user_name', 'password')

        if type(data) is not dict or \
                not all([i in data for i in indexes]) or len(data) != len(indexes):
            answer = 'data is not json or wrong json'

        elif users_table.get(data['login']):
            answer = 'Login Error'

        elif 6 < len(data['password']) < 32 and data['password'].isalnum() \
                and not (data['password'].isdigit() or data['password'].isalpha()):
            try:
                users_table.insert(
                    data['login'],
                    data['user_name'],
                    data['password']
                )
                answer = 'success'

            except IntegrityError:
                answer = 'Login Error'

        else:
            answer = 'Password Error'

        return dumps(answer)


@app.route("/login")
def sign_in():
    return render_template('html/signIn.html', title='Sign In')


@app.route("/Login", methods=['POST'])
def login():
    if request.method == 'POST':
        try:
            data = loads(request.data)

        except JSONDecodeError:
            return dumps({'errors': 'Oops',
                          'user': None})

        indexes = ('login', 'password')

        if type(data) is dict and \
                all([i in data for i in indexes]) and len(data) == len(indexes):
            log = data['login']
            password = data['password']
            answer = users_table.check_password(log, password)

            if answer == 'success':
                token = ''.join(choice(
                    ascii_uppercase + ascii_lowercase + digits
                ) for _ in range(32))

                users_table.set_token(log, token)
                print(token)
                print(users_table.get_token(2))
                session["login"] = log

                answer = {'errors': None,
                          'user': users_table.get(log) + (token,)}

            else:
                answer = {'errors': 'error',
                          'user': None}
        else:
            answer = {'errors': 'data is not json or wrong json',
                      'user': None}

    else:
        answer = {'errors': 'is not post',
                  'user': None}

    print(dumps(answer))
    return dumps(answer)


@app.route("/Exit", methods=["POST"])
def sign_out():
    if "login" not in session:
        return redirect("/")
    if request.method == 'POST':
        try:
            del session["login"]
            return dumps("success")
        except KeyError:
            return dumps("error")


@app.route("/main")
def basic():
    if "login" in session:
        return render_template("html/main.html", title="Flattering Fox")
    return redirect('/')


@app.route('/Leaders', methods=["POST"])
def leader():
    if "login" not in session:
        return redirect("/")
    if request.method == "POST":
        return dumps({
            "errors": None,
            "leaders": users_table.get_top()
        })


@app.route('/game')
def game():
    if "login" in session:
        return render_template("html/game.html", title="Flattering Fox")
    return redirect("/")


@app.route("/Save", methods=["POST"])
def save():
    if request.method == 'POST':
        try:
            data = loads(request.data)

        except JSONDecodeError:
            return dumps('Oops')
        indexes = ('user-id', 'token', 'score', 'time')
        # print(type(data))
        # print(data)
        # print(len(data), len(indexes))
        # print(users_table.check_token(data["user-id"], data["token"]))
        if type(data) is dict and \
                all([i in data for i in indexes]) and len(data) == len(indexes) and\
                users_table.check_token(data["user-id"], data["token"]) == "success":
            print(users_table.get_max(data["user-id"]))
            if data["score"] > users_table.get_max(data["user-id"]):
                print(">")
                users_table.set_max(data["user-id"], data["score"])
            story_table.insert(data["user-id"], data['score'], data["time"])
            return dumps("success")
        return dumps("error")


@app.route("/Story", methods=["POST"])
def story():
    if "login" not in session:
        return redirect("/")

    if request.method == 'POST':
        try:
            data = loads(request.data)

        except JSONDecodeError:
            return dumps('Oops')
        indexes = ('user-id',)
        if type(data) is dict and \
                all([i in data for i in indexes]) and len(data) == len(indexes):
            games = story_table.get(data["user-id"])
            return dumps({"errors": None,
                          "games": games})
        return dumps({"errors": "error",
                      "games": None})


@app.route('/profile')
def profile():
    if "login" in session:
        return render_template("html/profile.html", title="Flattering Fox")
    return redirect("/main")


@app.route('/Max', methods=["POST"])
def max_points():
    if request.method == "POST":
        try:
            data = loads(request.data)

        except JSONDecodeError:
            return dumps('Oops')
        indexes = ('user-id',)
        if type(data) is dict and \
                all([i in data for i in indexes]) and len(data) == len(indexes):
            # print(data["user-id"])
            return dumps({
                "errors": None,
                "max": users_table.get_max(data["user-id"])
            })


if __name__ == "__main__":
    database = DB()
    users_table = UsersTable(database.get_connection())
    story_table = StoryTable(database.get_connection())
    app.run("127.0.0.1", 8000)
