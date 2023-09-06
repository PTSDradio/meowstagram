from sqlalchemy import MetaData
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates 
from sqlalchemy.ext.hybrid import hybrid_property
import datetime
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)


class User(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    bio = db.Column(db.String)
    profile_picture = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    password_hash = db.Column(db.String(128))

    #dont want password accessible
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute!')
    
    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)
        
    #checks if password is equal password hash
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    posts = db.relationship("Post", back_populates="user")
    likes = db.relationship("Like", back_populates="user")
    comments = db.relationship("Comment", back_populates="user")

    serialize_rules = ('-posts.user',)

class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    image = db.Column(db.String)
    subtext = db.Column(db.String(255))
    created_at = db.Column(db.DateTime)

    user = db.relationship("User", back_populates="posts")
    likes = db.relationship("Like", back_populates="post")
    comments = db.relationship("Comment", back_populates="post")

    serialize_rules = ('-user.posts', '-likes.post', '-comments.post')

class Like(db.Model, SerializerMixin):
    __tablename__="likes"

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    post = db.relationship("Post", back_populates="likes")
    user = db.relationship("User", back_populates="likes")

    serialize_rules = ('-post.likes', '-user.likes')

class Comment(db.Model, SerializerMixin):
    __tablename__="comments"

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    comment = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    post = db.relationship("Post", back_populates="comments")
    user = db.relationship("User", back_populates="comments")

    serialize_rules = ('-post.comments', '-user.comments')
