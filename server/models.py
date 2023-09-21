from sqlalchemy import MetaData, Integer, ForeignKey, String, Column, Table
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates, relationship
from sqlalchemy.ext.hybrid import hybrid_property
import datetime
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)

followers = db.Table('followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('users.id'))
)

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

    posts = db.relationship("Post", cascade="all, delete-orphan",  back_populates="user")
    likes = db.relationship("Post", secondary="likes", back_populates="likes")
    comments = db.relationship("Comment", cascade="all, delete-orphan",  back_populates="user")
    following = db.relationship("User", secondary=followers, 
                                primaryjoin=(followers.c.follower_id == id),
                                secondaryjoin=(followers.c.followed_id == id),
                                lazy='dynamic', 
                                back_populates="followers")
    followers = db.relationship("User", secondary=followers, 
                                primaryjoin=(followers.c.followed_id == id),
                                secondaryjoin=(followers.c.follower_id == id),
                                lazy='dynamic',  
                                back_populates="following")
    
    serialize_rules = ('-following.bio', '-following.followers',
                        '-following.comments', '-following.created_at', '-following.updated_at',
                         '-following.first_name', '-following.last_name', '-following.likes',
                           '-following.password_hash', '-following.posts', '-following.following', '-followers.bio', '-followers.followers',
                        '-followers.comments', '-followers.created_at', '-followers.updated_at',
                         '-followers.first_name', '-followers.last_name', '-followers.likes',
                           '-followers.password_hash', '-followers.posts', '-followers.following',
                           '-comments', '-likes.comments', '-likes')

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
    
    def follow(self, user):
        if not self.is_following(user):
            self.following.append(user)
            db.session.commit()
            return True
        else: return False

    def unfollow(self, user):
        if self.is_following(user):
            self.following.remove(user)
            db.session.commit()
            return True
        else: return False
    
    def is_following(self, user):
        return self.following.filter(
            followers.c.followed_id == user.id).count() > 0

    def followed_posts(self):
        followed = Post.query.join(
            followers, (followers.c.followed_id == Post.user_id)).filter(
                followers.c.follower_id == self.id)
        own = Post.query.filter_by(user_id=self.id)
        return followed.union(own).order_by(Post.created_at.desc())
    
class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    image = db.Column(db.String)
    subtext = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    user = db.relationship("User",  back_populates="posts")
    likes = db.relationship("User", secondary="likes", back_populates="likes")
    comments = db.relationship("Comment", cascade="all, delete-orphan",  back_populates="post")

    serialize_rules = ('-comments.post', '-user.bio', '-user.followers',
                        '-user.comments', '-user.created_at', '-user.updated_at',
                         '-user.first_name', '-user.last_name', '-user.id', '-user.likes',
                           '-user.password_hash', '-user.posts', '-user.following', '-likes.bio', '-likes.followers',
                        '-likes.comments', '-likes.created_at', '-likes.updated_at',
                         '-likes.first_name', '-likes.last_name', '-likes.id', '-likes.likes',
                           '-likes.password_hash', '-likes.posts', '-likes.following''-user.followers',
                        '-user.comments', '-user.created_at', '-user.updated_at',
                         '-user.first_name', '-user.last_name', '-user.id', '-user.likes',
                           '-user.password_hash', '-user.posts', '-user.following',)

    def like(self, user):
        if not self.already_liked(user):
            self.likes.append(user)
            db.session.commit()
            return True
        else: return False

    def unlike(self, user):
        if self.already_liked(user):
            self.likes.remove(user)
            db.session.commit()
            return True
        else: return False
    
    def already_liked(self, user):
        if user in self.likes: 
            return True
    
class Like(db.Model, SerializerMixin):
    __tablename__="likes"

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class Comment(db.Model, SerializerMixin):
    __tablename__="comments"

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    comment = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    post = db.relationship("Post", back_populates="comments")
    user = db.relationship("User",  back_populates="comments")

    serialize_rules = ('-post', '-user.comments', '-user.followers',
                        '-user.comments', '-user.created_at', '-user.updated_at',
                         '-user.first_name', '-user.last_name', '-user.id', '-user.likes',
                           '-user.password_hash', '-user.posts', '-user.following', '-user.bio')

    def create(self, user, post):
        self.post.append(post)
        self.user.append(user)
        db.session.commit()
        return True


