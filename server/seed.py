from random import randint, choice as rc

from faker import Faker


from app import app
from models import db, User, Post, Comment, Like, followers

fake = Faker()

def create_user():
    li = []
    for i in range(10):
        u = User(username=fake.user_name(),
                password=fake.password(),
                profile_picture=fake.name(),
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                bio=fake.paragraph()
        )
        li.append(u)
    return li

def create_post(users):
    li = []
    for i in range(15):
        p = Post(user_id = rc(users).id,
                 image= "pikmin jpeg",
                 subtext= fake.paragraph()
        )
        li.append(p)
    return li

def create_likes(posts, users):
    for post in posts:
        post.likes.append(rc(users))
    db.session.commit()

def follows(users):
    for i in range(5):
        rc(users).following.append(rc(users))
    

    

if __name__ == '__main__':
    with app.app_context():
        print("clearing db")
        User.query.delete()
        Post.query.delete()
        Comment.query.delete()
        Like.query.delete()

        print("creating users...")
        users = create_user()
        print("making them follow")
        follows(users)
        db.session.add_all(users)
        db.session.commit()

        print("creating posts...")
        posts = create_post(users)
        print("liking posts...")
        create_likes(posts, users)
        db.session.add_all(posts)
        db.session.commit()

# mock user
# {
#     "username":"icemin",
#     "password":"pikmin",
#     "first_name":"pik",
#     "last_name":"min",
#     "bio":"huuya huuya huuya"
# }

# mock user 2
# {
#     "username":"purplemin",
#     "password":"pikmin",
#     "first_name":"pik",
#     "last_name":"min",
#     "bio":"HUUUYA"
# }

# mock post
# {
#     "image": "standin image",
#     "subtext": "huya hu"
# }
