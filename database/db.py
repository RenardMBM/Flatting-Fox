from passlib.hash import pbkdf2_sha256
from sqlite3 import connect


class DB:
    def __init__(self):
        conn = connect('../database/ff.db', check_same_thread=False)
        self.conn = conn

    def get_connection(self):
        return self.conn

    def __del__(self):
        self.conn.close()


class UsersTable:
    def __init__(self, connection):
        self.connection = connection

    def init_table(self):
        cursor = self.connection.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS users 
                            (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                             login VARCHAR(25) UNIQUE,
                             user_name VARCHAR(30),
                             password_hash VARCHAR(100),
                             maximum INTEGER DEFAULT 0,
                             token VARCHAR(32)
                             )''')
        cursor.close()
        self.connection.commit()

    """
    Set
    """

    def insert(self, login, user_name, password):
        cursor = self.connection.cursor()
        cursor.execute('''INSERT INTO users 
                          (login, user_name, password_hash) 
                          VALUES (?,?,?)''', (login, user_name, pbkdf2_sha256.hash(password)))
        cursor.close()
        self.connection.commit()

    def set_token(self, login, token):
        cursor = self.connection.cursor()
        cursor.execute('''UPDATE users 
                          SET token = ?
                          WHERE login = ?''', (token, login))
        cursor.close()
        self.connection.commit()

    def set_max(self, user_id, maximum):
        cursor = self.connection.cursor()
        cursor.execute('''UPDATE users 
                          SET maximum = ?
                          WHERE id = ?''', (maximum, user_id))
        cursor.close()
        self.connection.commit()

    def set_password(self, user_id, new_password):
        cursor = self.connection.cursor()
        cursor.execute('''UPDATE users
                          SET password = ?
                          WHERE id = ?''', (pbkdf2_sha256.hash(new_password), user_id))

    """
    Get
    """

    def get_token(self, user_id):
        cursor = self.connection.cursor()
        cursor.execute("SELECT token FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        return row

    def get_password(self, login):
        cursor = self.connection.cursor()
        cursor.execute('''SELECT password_hash
                              FROM users WHERE login = ?''', (login,))
        row = cursor.fetchone()
        return row

    def get_image(self, login):
        cursor = self.connection.cursor()
        cursor.execute('''SELECT image
                          FROM users WHERE login = ?''', (login,))
        row = cursor.fetchone()
        return row

    def get_max(self, user_id):
        cursor = self.connection.cursor()
        cursor.execute('''SELECT maximum
                          FROM users WHERE id = ?''', (user_id,))
        row = cursor.fetchone()
        return row[0]

    def get_top(self):
        cursor = self.connection.cursor()
        cursor.execute("SELECT user_name, maximum FROM users")
        rows = cursor.fetchall()
        rows = sorted(rows, key=lambda x: (x[1], x[0]))
        if len(rows) > 10:
            return rows[-1:-11]
        return rows[-1::-1]

    def get(self, login):
        cursor = self.connection.cursor()
        cursor.execute('''SELECT id,
                          login,
                          user_name
                          FROM users WHERE login = ?''', (login,))
        row = cursor.fetchone()
        return row

    def exists(self, login):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM users WHERE login = ?",
                       (login,))
        row = cursor.fetchone()
        return (True, row[0]) if row else (False,)

    """
    Check
    """

    def check_password(self, login, password):
        row = self.get_password(login)
        answer = 'error'

        if row and pbkdf2_sha256.verify(password, row[0]):
            answer = 'success'

        return answer

    def check_token(self, user_id, token):
        row = self.get_token(user_id)
        answer = 'error'

        if row and (token,) == row:
            answer = "success"

        return answer


class StoryTable:
    def __init__(self, connection):
        self.connection = connection

    def init_table(self):
        cursor = self.connection.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS stories 
                            (id INTEGER PRIMARY KEY AUTOINCREMENT,
                             user_id INTEGER,
                             total INT,
                             date TIMESTAMP
                             )''')
        cursor.close()
        self.connection.commit()

    def insert(self, user_id, total, datetime):
        cursor = self.connection.cursor()

        cursor.execute('''INSERT INTO stories
                          (user_id, total, date) 
                          VALUES (?,?,?)''', (user_id, total, datetime))

        cursor.close()
        self.connection.commit()

    def get(self, user_id):
        cursor = self.connection.cursor()
        cursor.execute("SELECT date, total FROM stories WHERE user_id = ?", (user_id,))
        row = cursor.fetchall()
        return row

    def get_all(self):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM stories")
        rows = cursor.fetchall()
        return rows

    def delete(self, user_id):
        cursor = self.connection.cursor()
        cursor.execute('''DELETE FROM stories WHERE user_id = ?''', (user_id,))
        cursor.close()
        self.connection.commit()
