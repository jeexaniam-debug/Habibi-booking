from app.database.database import SessionLocal
from app.database.models import User
from app.core.security import hash_password


def create_admin():
    db = SessionLocal()

    try:
        email = "admin@example.com"

        existing_admin = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_admin:
            print("Admin already exists.")
            return

        admin = User(
            name="Administrator",
            email=email,
            password_hash=hash_password("admin123"),
            role="ADMIN"
        )

        db.add(admin)
        db.commit()

        print("Admin created successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()