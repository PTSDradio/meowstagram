from models import db, User, Post, Comment, Like
from flask_restful import Api, Resource
from flask import Flask, make_response, request
from flask_migrate import Migrate
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
import os


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get(
    "DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

# istansiates app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)
db.init_app(app)
api=Api(app)

login_manager=LoginManager()
login_manager.init_app(app)
app.secret_key = "0d460b166f3aafb50ecf59747099704f64d0c9cf6ce595cfc15a9d70aa109514"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class Login(Resource):
    def post(self):
        
                data = request.get_json()
                username=data["username"]
                password=data["password"]
                user = User.query.filter(User.username==username).first()
                if user:
                    password_bool = user.verify_password(password)
                    if password_bool:
                        login_user(user)
                        return make_response("", 204)
                    else:
                         return make_response({"error": "Password is incorrect"}, 404)
                else:
                     return make_response({"error": "Username is incorrect"}, 404)

                 
class Logout(Resource):
     def post(self):
          logout_user()
          return make_response("",204)
     
class AddUser(Resource):
    def post(self):
        try:
            data = request.get_json()
            new_user = User(username=data["username"],
                            password=data["password"],
                            first_name=data["first_name"],
                            last_name=data["last_name"],
                            bio=data["bio"]
                            )
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user)
            return make_response(new_user.to_dict(), 201)
        except ValueError as e:
            return make_response({'error': str(e),}, 400)


api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')

api.add_resource(AddUser, '/register')



if __name__ == "__main__":
    app.run(port=5555, debug = True )


    
