from models import db, User, Post, Comment, Like, followers
from flask_restful import Api, Resource
from flask import Flask, make_response, request
from flask_migrate import Migrate
from flask_cors import CORS as FLaskCors
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
import os


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get(
    "DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

# istansiates app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

cors = FLaskCors(app)

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
                        print(user.to_dict())
                        return make_response(user.to_dict(), 200)
                    else:
                         return make_response({"error": "Password is incorrect"}, 404)
                else:
                     return make_response({"error": "Username is incorrect"}, 404)
                 
class Logout(Resource):
    @login_required
    def post(self):
          logout_user()
          return make_response("",204)
     
class Account(Resource):
    def post(self):
        try:
            data = request.get_json()
            new_user = User(username=data["username"],
                            password=data["password"],
                            first_name=data["first_name"],
                            last_name=data["last_name"],
                            )
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user)
            return make_response(new_user.to_dict(), 201)
        except:
            return make_response({'error': 'username already exists'}, 409)
        
    @login_required
    def patch(self):
        try:
            data = request.get_json()
            first_name = data['first_name']
            last_name = data['last_name']
            bio = data['bio']
            current_user.first_name = first_name
            current_user.last_name = last_name
            current_user.bio = bio
            db.session.commit()
            return make_response(current_user.to_dict(), 200)
        except ValueError as e:
            return make_response({'error': str(e)}, 400)
        
    @login_required
    def delete(self):
        db.session.delete(current_user)
        db.session.commit()
        logout_user()
        return make_response("",204)

class AccountById(Resource):
    @login_required
    def get(self, id):
        user = User.query.filter(User.id == id).first()
        if user:
            return make_response(user.to_dict(),200)
class Users(Resource):
     def get(self):
          users = [user.to_dict() for user in User.query.all()]
          return make_response(users, 200)

class Follow(Resource):
    @login_required
    def post(self):
        data=request.get_json()
        username = data['username']
        going_to_be_followed = User.query.filter(User.username == username).first()
        if going_to_be_followed:
            boole = current_user.follow(going_to_be_followed)
            if boole is True:
                return make_response({"success": f"now following {going_to_be_followed.username}"}, 200)
            if boole is False:
                return make_response({"error": f"already following {going_to_be_followed.username}"}, 409)
        if going_to_be_followed is None:
             return make_response({f"error": "cannot find user to follow"}, 404)
            
    def delete(self):
            data=request.get_json()
            username = data['username']
            going_to_be_followed = User.query.filter(User.username == username).first()
            if going_to_be_followed:
                boole = current_user.unfollow(going_to_be_followed)
                if boole is True:
                    return make_response({"success": f"unfollowed {going_to_be_followed.username}"}, 200)
                if boole is False:
                    return make_response({"error": f"you arent following {going_to_be_followed.username}"}, 404)
            if going_to_be_followed is None:
                 return make_response({f"error": "cannot find user to unfollow"}, 404)

class SearchUser(Resource):
    def get(self):
        data = request.get_json()
        search_query = data['username']
        results = [user.to_dict(only=('id', 'username','profile_picture')) 
                   for user in User.query.filter(User.username.contains(search_query)).all()]
        return make_response(results, 200)

class Posting(Resource):
    def get(self):
        # todo: pull up users posts
        pass
    @login_required
    def post(self):
        data = request.get_json()
        image = data['image']
        subtext = data['subtext']
        id = current_user.id
        post = Post(user_id=id, image=image, subtext=subtext)
        db.session.add(post)
        db.session.commit()
        return make_response(post.to_dict(), 200)
    
    @login_required
    def delete(self):
        data = request.get_json()
        post_id = data['id']
        post = Post.query.filter(Post.id == post_id).first()
        if post is not None:
            db.session.delete(post)
            db.session.commit()
            return make_response("", 204)
        return make_response("error", 404)
        
class Feed(Resource):
    @login_required
    def get(self):
        posts = [post.to_dict() for post in current_user.followed_posts()]
        
        return make_response(posts, 200)

class Likes(Resource):
    @login_required
    def post(self):
        data= request.get_json()
        post_id = data["post_id"]
        post = Post.query.filter_by(id=post_id).first()
        if post:
            result = post.like(current_user)
            if result is True:
                return make_response(post.to_dict(), 200)
            elif result is False:
                return make_response("already liked", 404)
        else:
           return make_response({"error": "No post found"}, 404)

        
    def delete(self):
        data= request.get_json()
        post_id = data["post_id"]
        post = Post.query.filter_by(id=post_id).first()
        if post:
            result = post.unlike(current_user)
            if result is True:
                return make_response("", 204)
            elif result is False:
                return make_response({"error": "hasnt been liked yet ya doof"}, 404)
        else:
           return make_response({"error": "No post found"}, 404)

class Comments(Resource):
    def post(self):
        data = request.get_json()
        post_id = data["post_id"]
        comment = data["comment"]
        post = Post.query.filter_by(id=post_id).first()
        if post:
            com =Comment(comment= comment, post_id=post.id, user_id=current_user.id)
            db.session.add(com)
            db.session.commit()
        else:
           return make_response({"error": "No post found"}, 404)
    
    def patch(self):
        data = request.get_json()
        id = data["comment_id"]
        text = data["comment"]
        comment = Comment.query.filter(Comment.id == id).first()
        if comment:
            comment.comment = text
            db.session.commit()
            return make_response(comment.to_dict(), 200)
    
    def delete(self):
        data = request.get_json()
        id = data["comment_id"]
        comment = Comment.query.filter(Comment.id == id).first()
        if comment:
            db.session.delete(comment)
            db.session.commit()
            return make_response("", 204)
        else:
           return make_response({"error": "No comment found"}, 404)        

          
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')

api.add_resource(Account, '/account')
api.add_resource(Users, '/users')
api.add_resource(SearchUser, '/users/search')
api.add_resource(Follow, '/follow')
api.add_resource(Feed, '/feed')

api.add_resource(Posting, '/post')
api.add_resource(Likes, '/like')
api.add_resource(Comments, '/comments')




if __name__ == "__main__":
    app.run(port=5555, debug = True )


    
